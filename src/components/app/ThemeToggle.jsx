import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 bg-slate-200 rounded-full" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors duration-300 flex items-center px-1"
    >
      {/* Sol */}
      <Sun className={`absolute left-2 w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-40 text-slate-400' : 'opacity-100 text-yellow-500'}`} />
      
      {/* Luna */}
      <Moon className={`absolute right-2 w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-100 text-blue-400' : 'opacity-40 text-slate-400'}`} />
      
      {/* Toggle Circle */}
      <div
        className={`w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-md transition-transform duration-300 ${
          isDark ? 'translate-x-8' : 'translate-x-0'
        }`}
      />
    </button>
  );
}