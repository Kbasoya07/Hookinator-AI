import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="flex-grow bg-black px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual background glows */}
      <div 
        className="absolute top-20 left-1/2 -translate-x-1/2 h-[350px] w-[350px] md:h-[600px] md:w-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: 'var(--accent-color)' }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-12 border-b border-zinc-900 pb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-5xl flex flex-col md:flex-row items-center gap-2 justify-center md:justify-start font-sans">
            <BookOpen className="h-10 w-10 text-white" style={{ color: 'var(--accent-color)' }} />
            YouTube Creator Blog
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl leading-relaxed">
            Free guides, templates, and strategies to master YouTube SEO, increase your click-through rate, and rank higher on recommendations.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <Card className="h-full border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-900/60 overflow-hidden flex flex-col">
                {/* Decorative post header card gradient */}
                <div 
                  className="h-2 w-full transition-opacity duration-300 opacity-60 group-hover:opacity-100" 
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
                <CardHeader className="flex-grow p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.publishDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white font-sans tracking-tight leading-snug group-hover:text-[var(--accent-color)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <CardDescription className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                        {post.author.avatar}
                      </div>
                      <span className="text-zinc-400">{post.author.name}</span>
                    </div>
                    
                    <span className="flex items-center gap-1 text-zinc-300 group-hover:translate-x-1 transition-transform">
                      Read Post <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
