'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';

export type AccentColor = 'pink' | 'blue' | 'green' | 'cyan' | 'orange';

export interface AccentDetails {
  color: string;
  hover: string;
  glow: string;
}

export const accentColorMap: Record<AccentColor, AccentDetails> = {
  pink: { color: '#ec4899', hover: '#db2777', glow: 'rgba(236, 72, 153, 0.2)' },
  blue: { color: '#3b82f6', hover: '#2563eb', glow: 'rgba(59, 130, 246, 0.2)' },
  green: { color: '#22c55e', hover: '#16a34a', glow: 'rgba(34, 197, 94, 0.2)' },
  cyan: { color: '#06b6d4', hover: '#0891b2', glow: 'rgba(6, 182, 212, 0.2)' },
  orange: { color: '#f97316', hover: '#ea580c', glow: 'rgba(249, 115, 22, 0.2)' },
};

interface ThemeContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  accentDetails: AccentDetails;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [accentColor, setAccentColorState] = useState<AccentColor>('pink');

  // 1. Load from localStorage on mount (initial fallback)
  useEffect(() => {
    const saved = localStorage.getItem('hookinator-accent-color') as AccentColor;
    if (saved && Object.keys(accentColorMap).includes(saved)) {
      setAccentColorState(saved);
    }
  }, []);

  // 2. Load from Supabase profile on user login / profile changes
  useEffect(() => {
    if (profile?.accent_color && Object.keys(accentColorMap).includes(profile.accent_color)) {
      setAccentColorState(profile.accent_color as AccentColor);
    }
  }, [profile?.accent_color]);

  // 3. Update CSS Variables and save to localStorage
  useEffect(() => {
    const details = accentColorMap[accentColor];
    const root = document.documentElement;
    root.style.setProperty('--accent-color', details.color);
    root.style.setProperty('--accent-color-hover', details.hover);
    root.style.setProperty('--accent-color-glow', details.glow);
    localStorage.setItem('hookinator-accent-color', accentColor);
  }, [accentColor]);

  // 4. Update state and write to Supabase if user is logged in
  const setAccentColor = async (color: AccentColor) => {
    if (Object.keys(accentColorMap).includes(color)) {
      setAccentColorState(color);
      if (user) {
        try {
          const response = await fetch('/api/profile/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accentColor: color }),
          });
          
          if (!response.ok) {
            console.error('Failed to sync accent color to server');
          }
        } catch (err) {
          console.error('Accent color API sync error:', err);
        }
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        accentColor,
        setAccentColor,
        accentDetails: accentColorMap[accentColor],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
