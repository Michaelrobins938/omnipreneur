import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  showGrid?: boolean;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  showGrid = false,
  className = '',
}) => {
  return (
    <div className={`
      min-h-screen bg-zinc-950 text-white
      ${showGrid ? 'grid-bg' : ''}
      ${className}
    `}>
      {/* Sticky Header */}
      <header className="
        sticky top-0 z-50
        bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800
        px-6 py-4
      ">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-xl font-display font-semibold text-white">
              Omnipreneur
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Products
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Support
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="
              px-4 py-2 text-sm
              bg-zinc-800 hover:bg-zinc-700
              border border-zinc-700 hover:border-zinc-600
              rounded-lg transition-all duration-200
            ">
              Sign In
            </button>
            <button className="
              px-4 py-2 text-sm
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              rounded-lg transition-all duration-200
              shadow-lg hover:shadow-glow
            ">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="
        max-w-4xl mx-auto px-6 py-12
        min-h-[calc(100vh-200px)]
      ">
        {children}
      </main>

      {/* Footer with Gradient Band */}
      <footer className="
        relative mt-auto
        bg-zinc-900 border-t border-zinc-800
        px-6 py-8
      ">
        <div className="
          absolute inset-0
          bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10
          opacity-50
        " />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <span className="text-xl font-display font-semibold text-white">
                  Omnipreneur
                </span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The complete AI automation suite for high-ticket SaaS businesses. 
                Built for operators, not influencers.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Bundle Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Content Spawner</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AutoRewrite Engine</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aesthetic Generator</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="
            mt-8 pt-8 border-t border-zinc-800
            flex flex-col md:flex-row justify-between items-center
            text-sm text-zinc-500
          ">
            <p>&copy; 2024 Omnipreneur. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { BaseLayout };
export type { BaseLayoutProps }; 