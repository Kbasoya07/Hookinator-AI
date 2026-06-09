'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Sparkles, Copy, Check, Eye, Loader2, ChevronRight, AlertTriangle, X, Mail } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface APIResult {
  id?: string;
  title: string;
  description: string;
  hashtags: string[];
  scoreImprovement?: number;
}

export default function OptimizerPage() {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'optimize' | 'generate'>('optimize');
  
  // Tab 1 Inputs
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');

  // Tab 2 Inputs
  const [topic, setTopic] = useState('');
  const [genre, setGenre] = useState('');

  // Request States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<APIResult | null>(null);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  // Auto-hide alert banner/toast after 5 seconds
  useEffect(() => {
    if (showCreditAlert) {
      const timer = setTimeout(() => {
        setShowCreditAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCreditAlert]);

  // Copy Feedback States
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  // Check if credits are fully depleted
  const hasCredits = (profile?.monthly_credits ?? 0) + (profile?.top_up_credits ?? 0) > 0;
  
  const isOptimizeDisabled = !hasCredits && (profile?.optimizations_left ?? 0) <= 0;
  const isGenerateDisabled = !hasCredits && ((profile?.generations_left ?? 0) <= 0 || (profile?.hashtags_left ?? 0) < 7);

  const handleCopy = (text: string, type: 'title' | 'desc' | 'tags') => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else if (type === 'desc') {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    } else {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user has depleted their credits before triggering the action
    const isActionDisabled = activeTab === 'optimize' ? isOptimizeDisabled : isGenerateDisabled;
    if (isActionDisabled) {
      setShowCreditAlert(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    const payload =
      activeTab === 'optimize'
        ? { toolType: 'optimize', currentTitle, currentDescription }
        : { toolType: 'generate', topic, genre };

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Limit reached. Upgrade to Pro.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Optimization request failed.');
      }

      const data = await response.json();
      setResult({
        id: data.id || undefined,
        title: data.title,
        description: data.description,
        hashtags: data.hashtags || [],
        scoreImprovement: data.scoreImprovement,
      });

      // Refresh credits locally in real-time
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex-grow bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-8 w-8" style={{ color: 'var(--accent-color)' }} />
              Content Optimizer
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Refine metadata using proprietary AI models.
            </p>
          </div>
          {/* Credit balance visualizer */}
          <div className="flex gap-4 text-xs text-zinc-500 bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 py-3">
            <div>
              <span className="block font-semibold text-zinc-400">Optimizations Left</span>
              <span className="text-white font-bold">{profile?.optimizations_left ?? 0}</span>
            </div>
            <div className="border-l border-zinc-800" />
            <div>
              <span className="block font-semibold text-zinc-400">Generations Left</span>
              <span className="text-white font-bold">{profile?.generations_left ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Input Controls Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-zinc-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('optimize');
                  setError(null);
                }}
                className="pb-3 text-sm font-semibold border-b-2 px-4 transition-colors cursor-pointer"
                style={{
                  borderColor: activeTab === 'optimize' ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === 'optimize' ? 'white' : '#71717a',
                }}
              >
                Optimize Existing
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('generate');
                  setError(null);
                }}
                className="pb-3 text-sm font-semibold border-b-2 px-4 transition-colors cursor-pointer"
                style={{
                  borderColor: activeTab === 'generate' ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === 'generate' ? 'white' : '#71717a',
                }}
              >
                Generate New
              </button>
            </div>

            {/* Forms Panel */}
            <form onSubmit={handleAction} className="space-y-6">
              {activeTab === 'optimize' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Current Video Title
                    </label>
                    <input
                      type="text"
                      required
                      value={currentTitle}
                      onChange={(e) => setCurrentTitle(e.target.value)}
                      placeholder="e.g. How to grow on youtube fast!"
                      className="w-full rounded-xl border border-zinc-850 bg-zinc-950/50 p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[var(--accent-color)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Current Video Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={currentDescription}
                      onChange={(e) => setCurrentDescription(e.target.value)}
                      placeholder="e.g. In this video, I share tips on how to grow a youtube channel..."
                      className="w-full rounded-xl border border-zinc-850 bg-zinc-950/50 p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[var(--accent-color)] resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Video Topic Outline
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Coding a SaaS in 24 hours from scratch with Supabase"
                      className="w-full rounded-xl border border-zinc-850 bg-zinc-950/50 p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[var(--accent-color)] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Genre / Target Audience
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      required
                      className="w-full rounded-xl border border-zinc-850 bg-zinc-950 p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-color)]"
                    >
                      <option value="" disabled>Choose your genre/target audience</option>
                      <option value="Autos & Vehicles">Autos & Vehicles</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Film & Animation">Film & Animation</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Howto & Style">Howto & Style</option>
                      <option value="Music">Music</option>
                      <option value="News & Politics">News & Politics</option>
                      <option value="Nonprofits & Activism">Nonprofits & Activism</option>
                      <option value="People & Blogs">People & Blogs</option>
                      <option value="Pets & Animals">Pets & Animals</option>
                      <option value="Science & Technology">Science & Technology</option>
                      <option value="Sports">Sports</option>
                      <option value="Travel & Events">Travel & Events</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-black transition-transform hover:scale-102 cursor-pointer border-none disabled:opacity-50 disabled:pointer-events-none"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  boxShadow: '0 0 14px var(--accent-color-glow)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    Engaging AI Engine...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-black" />
                    {activeTab === 'optimize' ? 'Optimize Hook' : 'Generate Viral Metadata'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output Panel */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 min-h-[400px] flex flex-col justify-center relative">
            
            {/* Skeletons/Loading State */}
            {loading && (
              <div className="space-y-6 py-4 animate-pulse">
                <div className="h-4 w-1/4 bg-zinc-800 rounded"></div>
                <div className="h-10 w-full bg-zinc-900 rounded-xl"></div>
                <div className="h-4 w-1/3 bg-zinc-800 rounded mt-8"></div>
                <div className="h-28 w-full bg-zinc-900 rounded-xl"></div>
                <div className="h-6 w-1/2 bg-zinc-800 rounded mt-8"></div>
              </div>
            )}

            {/* Error States */}
            {!loading && error && (
              <div className="text-center max-w-sm mx-auto flex flex-col items-center">
                <div className="mb-4 rounded-full bg-red-950/40 p-3 border border-red-500/20 text-red-400">
                  <BadgeAlert className="h-8 w-8 text-red-500" />
                </div>
                {error.includes('Limit reached') ? (
                  <>
                    <h3 className="text-md font-bold text-white">Quota Limit Reached</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      You have exhausted your free credits. Upgrade to Hookinator Pro to unlock unlimited optimizations.
                    </p>
                    <Link
                      href="/pricing"
                      className="mt-6 flex items-center justify-center gap-1 text-xs font-semibold rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-2.5 text-white hover:bg-zinc-850 transition-colors"
                    >
                      Upgrade Plan <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-md font-bold text-white">Operation Failed</h3>
                    <p className="text-xs text-gray-500 mt-2">
                      {error}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && !result && (
              <div className="text-center max-w-xs mx-auto flex flex-col items-center py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 mb-4 text-gray-400">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white font-sans">Preview Workspace</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Submit your draft data to render AI generated video titles, SEO tags, and meta descriptions here.
                </p>
              </div>
            )}

            {/* Success Output State */}
            {!loading && !error && result && (
              <div className="space-y-6 py-2">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                    Optimized Result
                  </h3>
                  <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-[10px] text-green-400 font-semibold px-2 py-0.5">
                    Saved to History
                  </Badge>
                </div>

                {/* Rating Meter Card */}
                {result.scoreImprovement !== undefined && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {activeTab === 'optimize' ? 'Optimization Score Improvement' : 'AI SEO Quality Score'}
                      </span>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {activeTab === 'optimize' 
                          ? 'This represents the percentage increase in click-through rate (CTR) potential and search visibility compared to your original draft.'
                          : 'This represents the calculated search engine optimization (SEO) strength and readability score of the generated metadata.'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center shrink-0 min-w-[100px]">
                      {/* Circular Gauge / Percentage Display */}
                      <div className="relative flex items-center justify-center h-20 w-20">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Background Track */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="text-zinc-850"
                            strokeWidth="6"
                            stroke="currentColor"
                            fill="transparent"
                          />
                          {/* Animated Progress Indicator */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            style={{
                              strokeDasharray: '213.6',
                              strokeDashoffset: 213.6 - (213.6 * result.scoreImprovement) / 100,
                              stroke: 'var(--accent-color)',
                              filter: 'drop-shadow(0 0 4px var(--accent-color-glow))',
                              transition: 'stroke-dashoffset 0.8s ease-in-out',
                            }}
                            strokeWidth="6"
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-base font-extrabold text-white font-sans">
                            {activeTab === 'optimize' ? `+${result.scoreImprovement}%` : `${result.scoreImprovement}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title Card */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Optimized Title</span>
                    <button
                      onClick={() => handleCopy(result.title, 'title')}
                      className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="Copy Title"
                    >
                      {copiedTitle ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 text-sm font-bold text-white leading-relaxed">
                    {result.title}
                  </div>
                </div>

                {/* Description Card */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">SEO Meta Description</span>
                    <button
                      onClick={() => handleCopy(result.description, 'desc')}
                      className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="Copy Description"
                    >
                      {copiedDesc ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 text-xs text-gray-300 leading-relaxed font-sans max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {result.description}
                  </div>
                </div>

                {/* Hashtags Card */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Targeted Hashtags</span>
                    <button
                      onClick={() => handleCopy(result.hashtags.map(t => `#${t}`).join(' '), 'tags')}
                      className="text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Copy All Hashtags"
                    >
                      {copiedTags ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy All
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-gray-300 py-1 px-2.5 text-xs font-semibold cursor-pointer"
                        onClick={() => handleCopy(`#${tag}`, 'tags')}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="border-t border-zinc-900 pt-4 mt-6">
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-gray-400">
                        <Mail className="h-5 w-5" style={{ color: 'var(--accent-color)' }} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white">Have feedback or suggestions?</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                          We&apos;d love to hear how we can make Hookinator better for your workflow.
                        </p>
                      </div>
                    </div>
                    <a
                      href="mailto:mr.negative07007@gmail.com?subject=Hookinator Feedback"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Floating Credit Warning Alert Popup */}
      {showCreditAlert && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md w-full bg-zinc-950/90 border border-red-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.2)] flex gap-3 items-start backdrop-blur-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-bold text-white">Credits Exhausted</h4>
            <p className="text-xs text-red-200/70 mt-1 leading-relaxed">
              Your optimization and generation credits have been fully exhausted. Upgrade to Pro to unlock unlimited usage.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/pricing"
                className="text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg transition-colors inline-block"
              >
                Upgrade Plan
              </Link>
              <button
                type="button"
                onClick={() => setShowCreditAlert(false)}
                className="text-[11px] font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreditAlert(false)}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-zinc-900 self-start"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}

// Small inline fallback replacement icon for badge alerts
function BadgeAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
