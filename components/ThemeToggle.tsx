// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-12 h-12 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-800"
    >
        <HiOutlineLightBulb className="w-12 h-12" />
    </button>
  );
}
