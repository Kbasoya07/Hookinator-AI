'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useTheme, AccentColor, accentColorMap } from '@/components/theme-provider';
import { LogOut, User, Palette, Menu, X } from 'lucide-react';
import { MagnetIcon as Magnet } from '@/components/icons';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { accentColor, setAccentColor } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Optimizer', href: '/optimizer' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  const colors: AccentColor[] = ['pink', 'blue', 'green', 'cyan', 'orange'];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="flex items-center justify-center transition-transform group-hover:scale-105">
                <Magnet
                  className="h-7 w-7 transition-colors duration-300"
                  style={{
                    stroke: 'var(--accent-color)',
                    filter: 'drop-shadow(0 0 6px var(--accent-color-glow))',
                  }}
                />
              </div>
              <span 
                className="text-xl font-bold tracking-tight text-white transition-all duration-300"
                style={{
                  textShadow: '0 0 8px var(--accent-color-glow)',
                }}
              >
                Hookinator<span style={{ color: 'var(--accent-color)' }}>AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{
                    color: isActive ? 'var(--accent-color)' : '#9ca3af',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Theme + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Accent Picker */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-gray-400 transition-colors hover:text-white"
              >
                <Palette className="h-4 w-4" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500">Accent Theme</div>
                  <div className="mt-1 flex flex-col gap-1">
                    {colors.map((color) => {
                      const isActive = accentColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            setAccentColor(color);
                            setDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full rounded-lg px-2 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-zinc-900 hover:text-white"
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-zinc-800"
                            style={{ backgroundColor: accentColorMap[color].color }}
                          />
                          <span className="capitalize">{color}</span>
                          {isActive && (
                            <span 
                              className="ml-auto h-1.5 w-1.5 rounded-full" 
                              style={{ backgroundColor: 'var(--accent-color)' }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                    <User className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="max-w-[120px] truncate text-xs font-medium hidden lg:inline">
                    {user.email}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-red-500 hover:bg-zinc-900 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-black transition-colors"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    boxShadow: '0 0 10px var(--accent-color-glow)',
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Picker */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-gray-400"
              >
                <Palette className="h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-xl">
                  <div className="flex flex-col gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setAccentColor(color);
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full rounded-lg px-2 py-1 text-xs text-gray-300 hover:bg-zinc-900"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: accentColorMap[color].color }}
                        />
                        <span className="capitalize">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-gray-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-900 bg-black px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? 'var(--accent-color)' : '#9ca3af',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="border-t border-zinc-900 my-2 pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-1.5 text-xs text-gray-500 truncate">{user.email}</div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-zinc-900"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-zinc-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center rounded-lg border border-zinc-850 py-2 text-sm text-gray-300 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center rounded-lg py-2 text-sm text-black"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
