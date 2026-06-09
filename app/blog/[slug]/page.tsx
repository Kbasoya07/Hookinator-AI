import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-static';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static routes for all 5 posts during Next.js build
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

// Generate page-specific metadata dynamically
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Hookinator AI',
    };
  }

  return {
    title: `${post.title} | Hookinator AI`,
    description: post.metaDescription,
    alternates: {
      canonical: `https://hookinator.com/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Hookinator AI`,
      description: post.metaDescription,
      url: `https://hookinator.com/blog/${slug}`,
      type: 'article',
      publishedTime: new Date(post.publishDate).toISOString(),
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Hookinator AI`,
      description: post.metaDescription,
    }
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find related posts
  const relatedPosts = BLOG_POSTS.filter((p) => 
    post.relatedSlugs.includes(p.slug)
  );

  // Generate Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': post.title,
    'description': post.metaDescription,
    'datePublished': new Date(post.publishDate).toISOString(),
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Hookinator AI',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://hookinator.com/favicon.ico',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://hookinator.com/blog/${slug}`,
    }
  };

  return (
    <div className="flex-grow bg-black px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Structured data in head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Visual background glows */}
      <div 
        className="absolute top-20 left-1/4 -translate-x-1/2 h-[400px] w-[400px] rounded-full blur-[140px] opacity-5 pointer-events-none"
        style={{ backgroundColor: 'var(--accent-color)' }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>

        {/* Page Grid */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Sidebar (TOC, Meta info) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Meta Card */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-900/10 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-gray-300">
                  {post.author.avatar}
                </div>
                <div>
                  <span className="block text-sm font-semibold text-white font-sans">{post.author.name}</span>
                  <span className="block text-[11px] text-gray-500">{post.author.role}</span>
                </div>
              </div>

              <div className="border-t border-zinc-950 pt-4 space-y-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="font-semibold text-zinc-300 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reading Time</span>
                  <span className="font-semibold text-zinc-300 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            {post.toc && post.toc.length > 0 && (
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/10 p-6 space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Table of Contents
                </h4>
                <nav className="space-y-2.5">
                  {post.toc.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className={`block text-xs text-gray-500 hover:text-white transition-colors leading-relaxed font-sans ${
                        link.level === 3 ? 'pl-3' : 'font-semibold'
                      }`}
                    >
                      {link.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>

          {/* Right Main Post Content */}
          <article className="lg:col-span-8 space-y-8">
            
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-5xl leading-tight font-sans">
                {post.title}
              </h1>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-zinc-800 bg-zinc-950 text-gray-400 text-[10px] py-0.5">
                  YouTube Growth
                </Badge>
                <Badge variant="outline" className="border-zinc-800 bg-zinc-950 text-gray-400 text-[10px] py-0.5">
                  SEO Guide
                </Badge>
              </div>
            </div>

            {/* Body */}
            <div 
              className="prose prose-invert max-w-none text-gray-400 text-sm leading-relaxed space-y-6 font-sans
                prose-headings:text-white prose-headings:font-bold prose-headings:font-sans
                prose-h2:text-xl prose-h2:border-b prose-h2:border-zinc-900 prose-h2:pb-2 prose-h2:pt-6
                prose-h3:text-base prose-h3:pt-4
                prose-strong:text-white prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-2
                prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-850 prose-pre:p-4 prose-pre:rounded-xl prose-pre:text-zinc-300 prose-pre:font-mono
              "
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* CTA Box at end */}
            <Card 
              className="border-zinc-800 bg-zinc-900/30 p-8 text-center backdrop-blur-sm relative overflow-hidden"
              style={{
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.4), 0 0 30px var(--accent-color-glow-10)',
              }}
            >
              <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
                <div 
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white font-sans">
                  Optimize Your YouTube Titles Instantly
                </h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  Stop guessing what titles and tags rank. Let Hookinator AI generate psychologically proven titles, search-friendly outlines, and sidebar keywords in 30 seconds.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <Link
                    href="/register"
                    className="rounded-xl px-6 py-3 text-xs font-bold text-black border-none transition-transform hover:scale-102 flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      boxShadow: '0 0 14px var(--accent-color-glow)',
                    }}
                  >
                    Try Hookinator AI Free <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-black" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-xl border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white px-6 py-3 text-xs font-semibold text-white transition-colors flex items-center justify-center cursor-pointer"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </Card>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-zinc-900 pt-8 space-y-4">
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  Related Growth Guides
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                      <div className="rounded-xl border border-zinc-850 bg-zinc-900/10 p-5 hover:border-zinc-800 transition-colors h-full flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 font-semibold">{related.publishDate}</span>
                          <h4 className="text-sm font-bold text-white font-sans mt-1.5 group-hover:text-[var(--accent-color)] transition-colors leading-snug">
                            {related.title}
                          </h4>
                        </div>
                        <span className="text-xs text-zinc-400 mt-4 flex items-center gap-1 group-hover:text-white transition-colors">
                          Read Guide <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </article>

        </div>
      </div>
    </div>
  );
}
