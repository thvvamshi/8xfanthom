import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-8x-muted hover:text-8x-ink hover:bg-8x-border/30 transition-colors focus:outline-none focus:ring-2 focus:ring-8x-coral focus:ring-offset-1 focus:ring-offset-transparent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
