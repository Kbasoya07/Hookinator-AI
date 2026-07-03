import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Hash, 
  Cpu 
} from 'lucide-react';
import { FAQSchema } from '@/components/structured-data';

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-mono relative overflow-hidden">
      {/* Visual background glows */}
      <div 
        className="absolute top-20 left-1/4 -translate-x-1/2 h-[350px] w-[350px] md:h-[600px] md:w-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: 'var(--accent-color)' }}
      />
      <div 
        className="absolute bottom-40 right-1/4 translate-x-1/2 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full blur-[140px] opacity-5 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: 'var(--accent-color)' }}
      />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <Badge 
            variant="outline" 
            className="mb-6 border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs text-gray-300 font-semibold"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
            The Ultimate YouTube SEO Tool
          </Badge>

          {/* Hero H1 containing primary keywords */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-tight max-w-4xl font-sans">
            Rank #1 on Search with Our{' '}
            <span 
              className="transition-all duration-300"
              style={{
                color: 'var(--accent-color)',
                textShadow: '0 0 20px var(--accent-color-glow)',
              }}
            >
              YouTube Title Optimizer
            </span>
          </h1>

          {/* Keyword-rich subheadline and descriptive paragraph */}
          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
            Stop losing views to bad CTR. Our advanced <span className="text-white font-semibold">youtube seo tool</span> makes it simple to <Link href="/optimizer" className="text-white underline hover:text-[var(--accent-color)] transition-colors font-bold">optimize youtube titles</Link> for your audience, auto-write metadata using a premium <span className="text-white font-semibold">youtube description generator</span>, and boost organic discoverability with a smart <span className="text-white font-semibold">youtube hashtag generator</span>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: 'default' }),
                "w-full sm:w-auto rounded-xl px-8 py-6 text-sm font-bold text-black border-none transition-transform hover:scale-102 cursor-pointer flex items-center justify-center"
              )}
              style={{
                backgroundColor: 'var(--accent-color)',
                boxShadow: '0 0 20px var(--accent-color-glow)',
              }}
            >
              Optimize YouTube Titles Free <ArrowRight className="ml-2 h-4 w-4 text-black" />
            </Link>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                "w-full sm:w-auto rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white px-8 py-6 text-sm font-semibold text-white transition-colors cursor-pointer flex items-center justify-center"
              )}
            >
              youtube seo tool pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans">
            Supercharge Growth with the Best YouTube SEO Tool
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Deploy advanced search algorithms to bypass the curiosity gap and capture more recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: H2 containing primary keywords */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700">
            <CardHeader>
              <div 
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
              >
                <Cpu className="h-5 w-5" />
              </div>
              {/* Keyword: viral youtube title generator / clickbait title maker */}
              <h2 className="text-lg font-bold text-white font-sans">Viral YouTube Title Generator & Clickbait Title Maker</h2>
              <CardDescription className="text-gray-400 text-xs mt-2">
                Generate high-CTR hooks, youtube shorts title generator concepts, and youtube thumbnail title generator variants matching human curiosity triggers.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 2: H2 containing primary keywords */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700">
            <CardHeader>
              <div 
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
              >
                <FileText className="h-5 w-5" />
              </div>
              {/* Keyword: youtube description generator */}
              <h2 className="text-lg font-bold text-white font-sans">Write Rank-Winning Outlines with Our YouTube Description Generator</h2>
              <CardDescription className="text-gray-400 text-xs mt-2">
                Draft outlines with structured chapters, video timestamps, and critical keywords to secure top rankings on YouTube and Google search results.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 3: H2 containing primary keywords */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700">
            <CardHeader>
              <div 
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
              >
                <Hash className="h-5 w-5" />
              </div>
              {/* Keyword: youtube hashtag generator */}
              <h2 className="text-lg font-bold text-white font-sans">Maximize Reach with a Smart YouTube Hashtag Generator</h2>
              <CardDescription className="text-gray-400 text-xs mt-2">
                Analyze and extract high-search-volume tags and related terms to map your uploads into recommended sidebar queues.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 border-t border-zinc-900/80 bg-zinc-950/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans">
              Three Steps to Optimize YouTube Titles
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              How Hookinator takes your raw video concept and updates it for release.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-lg font-bold text-white mb-4"
                style={{ borderColor: 'var(--accent-color)' }}
              >
                1
              </div>
              <h3 className="text-md font-semibold text-white mb-2 font-sans">Input Video Concept</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Paste your current draft title, outline, genre category, or basic topic draft.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-lg font-bold text-white mb-4"
                style={{ borderColor: 'var(--accent-color)' }}
              >
                2
              </div>
              <h3 className="text-md font-semibold text-white mb-2 font-sans">AI SEO Analysis</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Our advanced proprietary model scans target search volumes, curiosity score benchmarks, and tag distributions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-lg font-bold text-white mb-4"
                style={{ borderColor: 'var(--accent-color)' }}
              >
                3
              </div>
              <h3 className="text-md font-semibold text-white mb-2 font-sans">Publish to YouTube Studio</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Copy optimized titles, descriptions, and hashtags with a single click and paste them into your video settings.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-900/60">
        <FAQSchema />
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Learn how Hookinator helps content creators optimize YouTube titles and descriptions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              q: "Is this the best youtube title optimizer free to use?",
              a: "Yes! Hookinator AI offers the best youtube title optimizer free tier with complimentary credits so you can generate high-CTR hooks without paying a single cent."
            },
            {
              q: "Can I use the ai youtube title generator for gaming videos?",
              a: "Absolutely! Our ai youtube title generator for gaming channels helps match high-energy video highlights with curiosity gaps, listicles, or challenge hooks."
            },
            {
              q: "Is there a youtube description generator for roblox content?",
              a: "Yes! Roblox creators can easily use Hookinator as a youtube description generator for roblox or Minecraft videos. It automatically structures game outlines, chapter segments, and keyword metadata."
            },
            {
              q: "Do you have a specialized youtube seo tool for indian creators?",
              a: "Hookinator functions perfectly as a youtube seo tool for indian creators, supporting multiple niches, content genres, and Hinglish or regional language concepts."
            },
            {
              q: "How does the youtube shorts title generator work?",
              a: "Our youtube shorts title generator parses your short concept to output short, punchy, high-impact titles (under 60 characters) formatted with engaging emojis and hashtags."
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-850 bg-zinc-900/10 p-6 text-left">
              <h3 className="text-base font-bold text-white font-sans mb-2">
                {item.q}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 border-t border-zinc-900/80 bg-zinc-950/40 py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl font-sans">
            Ready to Dominate YouTube Search?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Get started today and optimize your first video in less than 30 seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: 'default' }),
                "rounded-xl px-10 py-6 text-sm font-bold text-black border-none transition-transform hover:scale-102 cursor-pointer flex items-center justify-center"
              )}
              style={{
                backgroundColor: 'var(--accent-color)',
                boxShadow: '0 0 20px var(--accent-color-glow)',
              }}
            >
              Optimize YouTube Titles Free <ArrowRight className="ml-2 h-4 w-4 text-black" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
