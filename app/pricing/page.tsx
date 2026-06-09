'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, QrCode, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  const [activeProCard, setActiveProCard] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-mono relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 h-[350px] w-[350px] md:h-[600px] md:w-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: 'var(--accent-color)' }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white font-sans">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Choose the plan that fits your YouTube content workflow. Upgrade manual verification is fast and zero-cost.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch justify-center">
          {/* Free Tier */}
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex flex-col justify-between hover:border-zinc-700 transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white font-sans">Free Plan</CardTitle>
              <CardDescription className="text-gray-400 text-xs mt-1">For new creators starting out</CardDescription>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-gray-500 ml-2 text-sm">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>50 optimizations / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>30 content generations / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>70 hashtags / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Basic support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button 
                variant="outline"
                className="w-full rounded-xl border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-white py-6 text-xs font-semibold text-white cursor-pointer"
              >
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Monthly */}
          <Card 
            className="bg-zinc-900/50 backdrop-blur-sm flex flex-col justify-between hover:scale-102 transition-all relative"
            style={{ 
              borderColor: activeProCard === 'monthly' ? 'var(--accent-color)' : '#27272a',
              boxShadow: activeProCard === 'monthly' ? '0 0 15px var(--accent-color-glow)' : 'none'
            }}
            onClick={() => setActiveProCard('monthly')}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white font-sans">Pro Monthly</CardTitle>
              <CardDescription className="text-gray-400 text-xs mt-1">Accelerate views every month</CardDescription>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">₹199</span>
                <span className="text-gray-500 ml-2 text-sm">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>Unlimited optimizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>50 content generations / mo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>100 hashtags / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>Priority support & early updates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button 
                className="w-full rounded-xl py-6 text-xs font-semibold text-black border-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  boxShadow: '0 0 10px var(--accent-color-glow)',
                }}
              >
                Choose Pro Monthly
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Yearly */}
          <Card 
            className="bg-zinc-900/50 backdrop-blur-sm flex flex-col justify-between hover:scale-102 transition-all relative"
            style={{ 
              borderColor: activeProCard === 'yearly' ? 'var(--accent-color)' : '#27272a',
              boxShadow: activeProCard === 'yearly' ? '0 0 15px var(--accent-color-glow)' : 'none'
            }}
            onClick={() => setActiveProCard('yearly')}
          >
            {/* Pop badge */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold text-black"
              style={{ backgroundColor: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-color-glow)' }}
            >
              <Sparkles className="h-3 w-3" />
              2 MONTHS FREE
            </div>

            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white font-sans">Pro Yearly</CardTitle>
              <CardDescription className="text-gray-400 text-xs mt-1">Dominate the platform long term</CardDescription>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">₹1,999</span>
                <span className="text-gray-500 ml-2 text-sm">/ year</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-left text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>Unlimited optimizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>50 content generations / mo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>100 hashtags / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-color)' }} />
                  <span>Priority support & early updates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button 
                className="w-full rounded-xl py-6 text-xs font-semibold text-black border-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  boxShadow: '0 0 10px var(--accent-color-glow)',
                }}
              >
                Choose Pro Yearly
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* UPI Verification Section */}
        <div className="mt-20 max-w-2xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Visual QR Code Placeholder */}
            <div className="h-40 w-40 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-4 text-center shrink-0">
              <QrCode className="h-20 w-20 text-gray-500" style={{ color: 'var(--accent-color-glow)' }} />
              <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase mt-2">
                UPI QR Code
              </span>
            </div>

            {/* Verification Instructions */}
            <div className="space-y-4">
              <Badge 
                variant="outline" 
                className="border-red-500/20 bg-red-500/5 text-red-400 font-semibold px-3 py-1 text-[10px]"
              >
                Manual Verification Setup
              </Badge>
              <h3 className="text-lg font-bold text-white font-sans">Payment Instructions</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Scan the QR code or send payment to the UPI address below. Hookinator operates on a zero-cost gateway setup. 
              </p>
              <div 
                className="rounded-lg bg-zinc-950 border border-zinc-850 px-4 py-3 text-xs font-bold text-white font-mono tracking-wider flex items-center justify-between"
                style={{ borderColor: 'var(--accent-color-glow)' }}
              >
                <span>Pay to: yourupi@okaxis</span>
                <span className="text-[10px] font-semibold text-gray-500 select-none">UPI Address</span>
              </div>
              <p className="text-gray-500 text-[10px] leading-relaxed flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                Once paid, send your transaction reference ID to support. Admin verification takes ~1-2 hours to upgrade your account plan to Pro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
