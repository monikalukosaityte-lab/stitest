import { PostCard } from '@/components/sections/blog/blog-page';
import { ArticleFrontmatter } from '@/lib/types';

export function MoreEntries({ articles }: { articles: ArticleFrontmatter[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="section-padding bg-muted">
      <div className="container">
        <h2 className="mb-8 text-3xl md:text-4xl">
          Keep <em>reading</em>
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <li key={article.slug}>
              <PostCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
