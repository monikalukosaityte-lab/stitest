// Exercise the actual TSX components with React, without a Next server/build.
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

function setup() {
  const dom = new JSDOM(
    '<!doctype html><html><head></head><body></body></html>',
    {
      url: 'https://www.stitestkit.co.uk/rapid-tests/syphilis-home-test-kit?private=value',
      pretendToBeVisual: true,
    },
  );
  for (const name of [
    'window',
    'document',
    'navigator',
    'localStorage',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLButtonElement',
    'HTMLTextAreaElement',
    'Element',
    'Node',
    'NodeFilter',
    'DocumentFragment',
    'Event',
    'CustomEvent',
    'MouseEvent',
    'KeyboardEvent',
    'FocusEvent',
    'MutationObserver',
    'getComputedStyle',
    'requestAnimationFrame',
    'cancelAnimationFrame',
  ]) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: dom.window[name],
    });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  for (const extension of ['.ts', '.tsx']) {
    Module._extensions[extension] = (module, filename) => {
      const { outputText } = ts.transpileModule(
        fs.readFileSync(filename, 'utf8'),
        {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            jsx: ts.JsxEmit.ReactJSX,
            esModuleInterop: true,
            target: ts.ScriptTarget.ES2020,
          },
          fileName: filename,
        },
      );
      module._compile(outputText, filename);
    };
  }
  const resolve = Module._resolveFilename;
  Module._resolveFilename = function (request, ...args) {
    return resolve.call(
      this,
      request.startsWith('@/')
        ? path.join(__dirname, '../src', request.slice(2))
        : request,
      ...args,
    );
  };
  const React = require('react');
  let pathname = '/';
  const load = Module._load;
  Module._load = function (request, ...args) {
    // Only the Next router is replaced; state, DOM events and UI are real.
    if (request === 'next/navigation') return { usePathname: () => pathname };
    if (request === 'next/link') {
      return {
        __esModule: true,
        default: ({ children, ...props }) =>
          React.createElement('a', props, children),
      };
    }
    if (request === 'next/image') {
      return {
        __esModule: true,
        default: (props) => {
          const attributes = { ...props };
          delete attributes.fill;
          delete attributes.priority;
          return React.createElement('img', attributes);
        },
      };
    }
    return load.call(this, request, ...args);
  };
  return {
    dom,
    React,
    setPathname: (value) => {
      pathname = value;
    },
  };
}

module.exports = { setup };
