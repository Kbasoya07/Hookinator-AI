'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Hash, 
  Cpu, 
  Star 
} from 'lucide-react';

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
            Proprietary AI Engine
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-tight max-w-4xl font-sans">
            Turn Average YouTube Videos Into{' '}
            <span 
              className="transition-all duration-300"
              style={{
                color: 'var(--accent-color)',
                textShadow: '0 0 20px var(--accent-color-glow)',
              }}
            >
              Viral Click Magnets
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
            Stop losing views to bad CTR. Instantly optimize your video titles, generate keyword-rich SEO descriptions, and select high-performing hashtags in seconds.
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
              Start Free <ArrowRight className="ml-2 h-4 w-4 text-black" />
            </Link>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                "w-full sm:w-auto rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white px-8 py-6 text-sm font-semibold text-white transition-colors cursor-pointer flex items-center justify-center"
              )}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl font-sans">
            Engineered For Audience Growth
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Everything you need to beat the algorithm and capture the curiosity gap.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: AI Titles */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700">
            <CardHeader>
              <div 
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
              >
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-white font-sans">AI Title Optimization</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Generates high-CTR hooks using human psychological triggers like curiosity gaps, urgency, and listicles.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 2: SEO Descriptions */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700">
            <CardHeader>
              <div 
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-white font-sans">SEO Meta Descriptions</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Automatically formats descriptions with chapters, timestamps, and key search terms for maximum indexing.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 3: Hashtags */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700">
            <CardHeader>
              <div 
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--accent-color-glow)', color: 'var(--accent-color)' }}
              >
                <Hash className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-white font-sans">Smart Hashtags</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Selects the exact mix of high, medium, and low volume target tags to place your videos in recommended queues.
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
              Three Steps to Viral SEO
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
              <h3 className="text-md font-semibold text-white mb-2 font-sans">Paste Draft</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Input your video&apos;s working title, raw description, or general topic outline.
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
              <h3 className="text-md font-semibold text-white mb-2 font-sans">AI Analysis</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Hookinator AI scans your input for target keyword gaps, readability scores, and CTR potential.
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
              <h3 className="text-md font-semibold text-white mb-2 font-sans">Copy & Publish</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Review proposed title variations and descriptions, copy with one click, and update your YouTube Studio upload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="border-zinc-800 bg-zinc-900/30 p-8 md:p-12 text-center backdrop-blur-sm relative">
          <div className="flex justify-center gap-1 text-yellow-500 mb-6">
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
          </div>
          <blockquote className="text-lg md:text-xl text-gray-300 italic leading-relaxed">
            &ldquo;We optimized 5 of our back-catalog tech videos using Hookinator&apos;s title suggestions. Within 48 hours, our baseline impression click-through rate jumped from 4.2% to 8.9%. This tool is an absolute cheat code.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-gray-300">
              MK
            </div>
            <cite className="not-italic mt-3 block text-sm font-semibold text-white font-sans">
              Marcus K.
            </cite>
            <span className="text-xs text-gray-500 mt-1">Tech Reviewer (140K Subscribers)</span>
          </div>
        </Card>
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
              Optimize First Video Now <ArrowRight className="ml-2 h-4 w-4 text-black" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
