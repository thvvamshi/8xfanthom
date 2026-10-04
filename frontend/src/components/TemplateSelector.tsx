import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function TemplateSelector({ value, onChange, options }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-bold text-8x-ink bg-transparent hover:bg-8x-surface/50 px-3 py-1.5 rounded-md transition-colors"
      >
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 text-8x-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-8x-navbar border border-8x-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-8x-surface transition-colors"
              >
                <span className={`flex-1 ${value === option ? 'font-bold text-8x-ink' : 'text-8x-ink/80'}`}>
                  {option}
                </span>
                {value === option && <Check className="w-4 h-4 text-8x-coral" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
