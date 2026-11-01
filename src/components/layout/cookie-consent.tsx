'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  CookieChoice,
  readCookieChoice,
  saveCookieChoice,
  startAnalytics,
  stopAnalytics,
  trackPageView,
} from '@/lib/cookie-consent';

export default function CookieConsent() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<CookieChoice | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const lastPage = useRef<string | null>(null);
  const choiceRef = useRef<CookieChoice | null>(null);
  const settingsTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Read storage after hydration; the server must not guess a browser choice.
    const initialRead = setTimeout(() => {
      const saved = readCookieChoice();
      choiceRef.current = saved;
      setChoice(saved);
      setAnalytics(saved?.analytics ?? false);
      setReady(true);
      if (!saved?.analytics) stopAnalytics();
    }, 0);

    const openSettings = () => {
      settingsTrigger.current = document.activeElement as HTMLElement | null;
      setAnalytics(choiceRef.current?.analytics ?? false);
      setSettingsOpen(true);
    };
    const syncChoice = () => {
      const savedChoice = readCookieChoice();
      choiceRef.current = savedChoice;
      setChoice(savedChoice);
      setAnalytics(savedChoice?.analytics ?? false);
      if (!savedChoice?.analytics && stopAnalytics()) {
        window.location.reload();
      }
    };
    window.addEventListener('sti-cookie-settings', openSettings);
    window.addEventListener('storage', syncChoice);
    window.addEventListener('focus', syncChoice);
    return () => {
      clearTimeout(initialRead);
      window.removeEventListener('sti-cookie-settings', openSettings);
      window.removeEventListener('storage', syncChoice);
      window.removeEventListener('focus', syncChoice);
    };
  }, []);

  useEffect(() => {
    if (!ready || !choice?.analytics) return;
    startAnalytics();
    if (lastPage.current !== pathname) {
      trackPageView(pathname);
      lastPage.current = pathname;
    }
  }, [choice, pathname, ready]);

  useEffect(() => {
    if (!choice) return;
    // Browser timeouts cannot represent a six-month delay (32-bit maximum).
    let timeout: ReturnType<typeof setTimeout>;
    const checkExpiry = () => {
      const remaining = choice.expiresAt - Date.now();
      if (remaining > 0) {
        timeout = setTimeout(checkExpiry, Math.min(remaining, 86400000));
        return;
      }
      choiceRef.current = null;
      setChoice(null);
      setAnalytics(false);
      if (stopAnalytics()) window.location.reload();
    };
    checkExpiry();
    return () => clearTimeout(timeout);
  }, [choice]);

  function choose(allowed: boolean) {
    const saved = saveCookieChoice(allowed);
    choiceRef.current = saved;
    setChoice(saved);
    setAnalytics(allowed);
    setSettingsOpen(false);
    if (!allowed && stopAnalytics()) window.location.reload();
  }

  return (
    <>
      {ready && !choice && (
        <section
          aria-label="Cookie choices"
          className="bg-card text-card-foreground fixed bottom-0 left-1/2 z-50 max-h-dvh w-9/10 -translate-x-1/2 space-y-4 overflow-y-auto rounded-t-xs p-8 shadow-lg lg:w-7/10"
        >
          <div className="space-y-2">
            <h2 className="font-text text-lg font-bold">Cookie consent</h2>
            <p>
              We remember your cookie preferences. With your permission, we may
              use analytics cookies to understand how this site is used. You can
              accept or decline optional cookies and change your choice at any
              time. Learn more in our{' '}
              <Link href="/cookies" className="underline">
                cookie notice
              </Link>
              .
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="order-3 md:order-1">
              <Button
                variant="consent-link"
                size="consent"
                onClick={(event) => {
                  settingsTrigger.current = event.currentTarget;
                  setSettingsOpen(true);
                }}
              >
                Manage preferences
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <Button
                variant="consent"
                size="consent"
                onClick={() => choose(true)}
              >
                Accept
              </Button>
            </div>
            <div className="order-2 md:order-3">
              <Button
                variant="consent"
                size="consent"
                onClick={() => choose(false)}
              >
                Decline
              </Button>
            </div>
          </div>
        </section>
      )}

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="bottom"
          className="bg-card text-card-foreground max-h-dvh overflow-y-auto"
          onCloseAutoFocus={(event) => {
            if (settingsTrigger.current?.isConnected) {
              event.preventDefault();
              settingsTrigger.current.focus();
            }
          }}
        >
          <div className="container max-w-2xl space-y-6 py-4">
            <SheetHeader>
              <SheetTitle>Cookie settings</SheetTitle>
              <SheetDescription>
                Choose whether to allow optional analytics cookies on STI Test
                Kit. Shopping takes you to Test Discreet, which has its own
                cookie settings.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-2">
              <h3>Essential storage — always on</h3>
              <p className="text-muted-foreground text-sm">
                We remember your cookie choice on this device for up to six
                months. This does not track your browsing.
              </p>
            </div>
            <label className="flex items-start gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="accent-primary mt-1 size-5"
              />
              <span className="space-y-2">
                <strong className="block">Analytics cookies</strong>
                <span className="text-muted-foreground block text-sm">
                  With your permission, we may use Google Analytics to measure
                  visits and general page types. Your exposure date is not sent.
                  Advertising personalisation is disabled.
                </span>
              </span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Button
                variant="consent"
                size="consent"
                onClick={() => choose(true)}
              >
                Accept
              </Button>
              <Button
                variant="consent"
                size="consent"
                onClick={() => choose(false)}
              >
                Decline
              </Button>
              <Button
                variant="consent"
                size="consent"
                onClick={() => choose(analytics)}
              >
                Save choices
              </Button>
            </div>
            <Link href="/cookies" className="inline-block underline">
              Read about cookies
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function CookieSettingsButton() {
  return (
    <Button
      variant="outline-invert"
      size="sm"
      onClick={() => window.dispatchEvent(new Event('sti-cookie-settings'))}
    >
      Cookie settings
    </Button>
  );
}
