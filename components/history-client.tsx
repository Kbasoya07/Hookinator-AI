'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  History,
  Search,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface OptimizationLog {
  id: string;
  tool_type: 'optimize' | 'generate';
  input_title: string;
  input_description: string;
  output_title: string;
  output_description: string;
  hashtags: string[];
  created_at: string;
}

interface HistoryClientProps {
  initialHistory: OptimizationLog[];
  search: string;
  page: number;
  pageCount: number;
  totalCount: number;
}

export default function HistoryClient({
  initialHistory,
  search,
  page,
  pageCount,
  totalCount,
}: HistoryClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState(search);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Copy state mapping
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'title' | 'desc' | 'tags' | 'all' | null>(null);

  // Sync search input with parent search prop if it changes (e.g. browser history popState)
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  // Debounce search input to navigate URL
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery !== search) {
        router.push(`/history?page=1&search=${encodeURIComponent(searchQuery)}`);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, search, router]);

  // Copy to clipboard handler
  const handleCopy = (text: string, id: string, type: 'title' | 'desc' | 'tags' | 'all') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  // Delete transaction handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this optimization from your history?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('optimizations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (expandedId === id) setExpandedId(null);
      
      // Refresh Next.js server components data
      router.refresh();
    } catch (err) {
      console.error('Failed to delete history item:', err);
      alert('Failed to delete this item. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/history?page=1&search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex-grow bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <History className="h-8 w-8" style={{ color: 'var(--accent-color)' }} />
              Optimization History
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Browse, search, and manage your past AI-generated titles and descriptions.
            </p>
          </div>
          
          <div className="text-xs text-zinc-500 bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 py-3">
            <span className="block font-semibold text-zinc-400">Total Transactions</span>
            <span className="text-white font-bold text-base">{totalCount} runs</span>
          </div>
        </div>

        {/* Filter bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-6 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search input titles..."
            className="w-full rounded-xl border border-zinc-850 bg-zinc-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-color)]"
          />
        </form>

        {/* Empty State */}
        {initialHistory.length === 0 && (
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/10 p-12">
            <div className="text-center max-w-sm mx-auto flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 mb-4 text-gray-500">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No items found</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {search
                  ? "No transactions match your search term. Try adjusting your query keywords."
                  : "You haven't run any title optimizations or metadata generations yet."}
              </p>
              {!search && (
                <Link
                  href="/optimizer"
                  className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl bg-white text-black px-5 py-2.5 hover:bg-gray-200 transition-colors"
                >
                  Start Optimizing <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* History List */}
        {initialHistory.length > 0 && (
          <div className="space-y-4">
            {initialHistory.map((item) => {
              const isExpanded = expandedId === item.id;
              const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              // Parse score if it was serialized into output_description
              const scoreMatch = item.output_description.match(/<!-- score:(\d+) -->/);
              const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
              const cleanDescription = item.output_description.replace(/[\r\n]*<!-- score:\d+ -->/, '');

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-zinc-700 bg-zinc-900/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                      : 'border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20'
                  }`}
                >
                  {/* Collapsed Header Bar */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 min-w-0 flex-grow">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge
                          variant="secondary"
                          className={`${
                            item.tool_type === 'optimize'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          } text-[10px] uppercase font-semibold px-2 py-0.5`}
                        >
                          {item.tool_type === 'optimize' ? 'Optimize' : 'Generate'}
                        </Badge>
                        {score !== null && (
                          <Badge
                            variant="outline"
                            className="border-[var(--accent-color)]/25 bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-[10px] font-semibold px-2 py-0.5"
                          >
                            {item.tool_type === 'optimize' ? `+${score}% Improvement` : `Score: ${score}%`}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-zinc-500 font-medium">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">
                        {item.output_title}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate max-w-3xl">
                        Topic/Original: {item.input_title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.output_title, item.id, 'title');
                        }}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="Copy Optimized Title"
                      >
                        {copiedId === item.id && copiedType === 'title' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      
                      <div className="p-1 text-zinc-500 hover:text-white rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body Detail Panel */}
                  {isExpanded && (
                    <div className="border-t border-zinc-850 bg-zinc-950/40 p-5 space-y-6">
                      
                      {/* Grid comparison */}
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Source Input details */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Source Input Outline
                          </h4>
                          <div className="rounded-xl border border-zinc-850/60 bg-zinc-900/10 p-4 space-y-3">
                            <div>
                              <span className="block text-[10px] text-zinc-500 font-semibold uppercase">
                                {item.tool_type === 'optimize' ? 'Draft Title' : 'Input Topic'}
                              </span>
                              <p className="text-xs text-zinc-300 font-semibold mt-1">
                                {item.input_title}
                              </p>
                            </div>
                            <div>
                              <span className="block text-[10px] text-zinc-500 font-semibold uppercase">
                                {item.tool_type === 'optimize' ? 'Draft Description' : 'Genre Category'}
                              </span>
                              <p className="text-xs text-zinc-300 font-normal mt-1 leading-relaxed whitespace-pre-wrap">
                                {item.input_description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Optimized AI Output details */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="h-3 w-3" style={{ color: 'var(--accent-color)' }} />
                              Optimized AI Outputs
                            </h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCopy(item.output_title, item.id, 'title')}
                                className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                              >
                                {copiedId === item.id && copiedType === 'title' ? (
                                  <>
                                    <Check className="h-3 w-3 text-green-500" /> Title Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copy Title
                                  </>
                                )}
                              </button>
                              <span className="text-zinc-700">|</span>
                              <button
                                onClick={() => handleCopy(cleanDescription, item.id, 'desc')}
                                className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                              >
                                {copiedId === item.id && copiedType === 'desc' ? (
                                  <>
                                    <Check className="h-3 w-3 text-green-500" /> Desc Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copy Desc
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 space-y-4">
                            <div>
                              <span className="block text-[10px] text-zinc-500 font-semibold uppercase">
                                Optimized Title
                              </span>
                              <p className="text-sm text-white font-bold mt-1 leading-relaxed">
                                {item.output_title}
                              </p>
                            </div>
                            <div className="border-t border-zinc-850 pt-3">
                              <span className="block text-[10px] text-zinc-500 font-semibold uppercase mb-1">
                                Optimized Description
                              </span>
                              <p className="text-xs text-zinc-300 font-normal leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto font-sans">
                                {cleanDescription}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Hashtags container */}
                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="border-t border-zinc-850 pt-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Targeted Hashtags
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(
                                  item.hashtags.map(t => `#${t}`).join(' '),
                                  item.id,
                                  'tags'
                                )
                              }
                              className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                            >
                              {copiedId === item.id && copiedType === 'tags' ? (
                                  <>
                                    <Check className="h-3 w-3 text-green-500" /> Hashtags Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copy All Tags
                                  </>
                                )}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.hashtags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                onClick={() => handleCopy(`#${tag}`, item.id, 'tags')}
                                className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 py-1 px-2.5 text-xs font-semibold cursor-pointer"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expanded footer actions */}
                      <div className="border-t border-zinc-850 pt-4 flex justify-between items-center">
                        <button
                          onClick={() => {
                            const fullMeta = `TITLE:\n${item.output_title}\n\nDESCRIPTION:\n${cleanDescription}\n\nHASHTAGS:\n${item.hashtags.map(t => `#${t}`).join(' ')}`;
                            handleCopy(fullMeta, item.id, 'all');
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          {copiedId === item.id && copiedType === 'all' ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              Copied Everything
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy All Metadata
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-950/20 border border-red-500/10 hover:border-red-500/30 hover:bg-red-950/40 px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {deletingId === item.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete Transaction
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-zinc-900 pt-6">
            <p className="text-xs text-zinc-500">
              Showing page <span className="font-semibold text-white">{page}</span> of{' '}
              <span className="font-semibold text-white">{pageCount}</span> ({totalCount} total runs)
            </p>
            <div className="flex gap-2">
              <Link
                href={`/history?page=${page > 1 ? page - 1 : 1}&search=${encodeURIComponent(search)}`}
                className={`flex items-center gap-1.5 rounded-xl border border-zinc-850 bg-zinc-900/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-900/40 ${
                  page <= 1 ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Link>
              <Link
                href={`/history?page=${page < pageCount ? page + 1 : pageCount}&search=${encodeURIComponent(search)}`}
                className={`flex items-center gap-1.5 rounded-xl border border-zinc-850 bg-zinc-900/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-900/40 ${
                  page >= pageCount ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
