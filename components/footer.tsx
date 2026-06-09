'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-900 bg-black py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <span className="text-sm text-gray-500">
              © {currentYear} Hookinator AI. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link 
              href="/" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/optimizer" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Optimizer
            </Link>
            <Link 
              href="/blog" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/privacy" 
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
