import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  copyable?: boolean;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  label,
  copyable = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-400">{label}</span>
          {language && (
            <span className="text-xs text-zinc-500 font-mono">{language}</span>
          )}
        </div>
      )}
      
      <div className="relative">
        <pre className="
          bg-zinc-900 border border-zinc-700 rounded-lg p-4
          text-lime-100 font-mono text-sm leading-relaxed
          overflow-x-auto
          group-hover:border-zinc-600 transition-colors duration-200
        ">
          <code>{code}</code>
        </pre>
        
        {copyable && (
          <button
            onClick={handleCopy}
            className="
              absolute top-3 right-3
              p-2 rounded-md
              bg-zinc-800/80 backdrop-blur-sm
              text-zinc-400 hover:text-white
              border border-zinc-700 hover:border-zinc-600
              opacity-0 group-hover:opacity-100
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900
            "
            title="Copy to clipboard"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export { CodeBlock };
export type { CodeBlockProps }; 