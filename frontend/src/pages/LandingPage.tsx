import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-8x-warm text-8x-ink font-sans flex flex-col animate-fade-in overflow-hidden transition-colors">
      {/* Navbar (Standalone for Landing Page) */}
      <div className="w-full px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 sticky top-0 z-50">
        <header className="w-full max-w-[1200px] mx-auto bg-8x-navbar/95 backdrop-blur-md rounded-2xl border border-8x-border/50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-sm transition-all gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-12 gap-4 sm:gap-0 w-full sm:w-auto">
            <Link to="/" className="font-serif font-bold text-2xl tracking-tight text-8x-ink transition-transform hover:scale-[1.02]">
              8x<span className="font-sans font-medium tracking-tight ml-1 text-lg">Fathom</span>
            </Link>
            <nav className="flex items-center justify-center space-x-6 sm:space-x-8 w-full sm:w-auto overflow-x-auto">
              <Link to="/dashboard" className="text-sm font-semibold text-8x-muted hover:text-8x-ink transition-colors">Dashboard</Link>
              <Link to="/meetings" className="text-sm font-semibold text-8x-muted hover:text-8x-ink transition-colors">Meetings</Link>
              <Link to="/search" className="text-sm font-semibold text-8x-muted hover:text-8x-ink transition-colors">Search</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
            <ThemeToggle />
            <Link to="/dashboard" className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-8x-btn-primary text-sm font-bold rounded-lg text-8x-btn-primary-fg bg-8x-btn-primary hover:bg-8x-btn-primary-hover transition-colors">
              Sign In
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 w-full max-w-[1200px] mx-auto">
        
        {/* SECTION 1 - HERO */}
        <section className="px-4 sm:px-6 md:px-8 pt-20 pb-32 flex flex-col items-center text-center max-w-4xl mx-auto animate-slide-up">
          <span className="text-xs font-bold text-8x-ink/60 uppercase tracking-[0.15em] mb-8 block">Meeting Intelligence</span>
          <h1 className="text-[56px] md:text-[80px] font-serif text-8x-ink mb-10 tracking-tight leading-[1.05] max-w-3xl mx-auto">
            Every meeting.<br/>Understood.
          </h1>
          <p className="text-[19px] md:text-[21px] text-8x-muted max-w-2xl mx-auto leading-relaxed mb-14">
            Record, search and understand every conversation — without digging through an hour of video.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
            <Link 
              to="/meetings"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-8x-coral hover:bg-[#D94F32] transition-colors shadow-sm"
            >
              Explore your meetings
            </Link>
            <Link 
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 border border-8x-border/80 text-base font-bold rounded-xl text-8x-ink bg-transparent hover:bg-white/50 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>

        {/* SECTION 2 - PRODUCT VALUE */}
        <section className="px-4 sm:px-6 md:px-8 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-full">
            <div className="flex flex-col group border-t border-8x-border/60 pt-6 transition-colors hover:border-8x-coral">
              <span className="text-sm font-bold text-8x-muted font-mono mb-4">01</span>
              <h3 className="text-2xl font-serif text-8x-ink mb-4 leading-snug">Understand every conversation</h3>
              <p className="text-lg text-8x-muted leading-relaxed">Instantly read the AI summary and key points of what was actually discussed.</p>
            </div>
            <div className="flex flex-col group border-t border-8x-border/60 pt-6 transition-colors hover:border-8x-coral">
              <span className="text-sm font-bold text-8x-muted font-mono mb-4">02</span>
              <h3 className="text-2xl font-serif text-8x-ink mb-4 leading-snug">Find the exact moment</h3>
              <p className="text-lg text-8x-muted leading-relaxed">Search across all meetings and jump directly to the timestamp in the recording.</p>
            </div>
            <div className="flex flex-col group border-t border-8x-border/60 pt-6 transition-colors hover:border-8x-coral">
              <span className="text-sm font-bold text-8x-muted font-mono mb-4">03</span>
              <h3 className="text-2xl font-serif text-8x-ink mb-4 leading-snug">Turn conversations into action</h3>
              <p className="text-lg text-8x-muted leading-relaxed">Automatically extract action items and highlights so your team always knows what's next.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3 - PRODUCT PREVIEW */}
        <section className="px-4 sm:px-6 md:px-8 pb-32">
          <div className="max-w-full mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif text-8x-ink tracking-tight mb-5">Built for clarity</h2>
              <p className="text-xl text-8x-muted max-w-2xl mx-auto">A product workspace that gets out of your way.</p>
            </div>
            
            {/* Mock Workspace UI */}
            <div className="bg-8x-surface rounded-2xl border border-8x-border/60 shadow-xl overflow-hidden group hover:border-8x-border transition-colors">
              <div className="p-8 md:p-12">
                <div className="mb-10 pb-8 border-b border-8x-border/40">
                  <span className="text-[12px] font-bold text-8x-muted uppercase tracking-widest mb-4 block">Meeting</span>
                  <h3 className="text-3xl md:text-4xl font-serif text-8x-ink mb-6 tracking-tight leading-tight">Q3 Product Strategy Sync</h3>
                  <div className="flex items-center gap-4 text-sm text-8x-muted font-medium">
                    <span>Oct 24, 2026</span>
                    <span className="text-8x-border/80">•</span>
                    <span>5 participants</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Mock Player */}
                    <div className="bg-8x-ink text-white p-6 rounded-2xl shadow-sm border border-[#2A2D26]">
                      <div className="aspect-video bg-[#0c0d0a] rounded-xl mb-5 flex items-center justify-center border border-[#2A2D26]">
                        <span className="text-8x-muted font-medium tracking-wide">Recording View</span>
                      </div>
                      <div className="flex items-center space-x-5">
                        <div className="w-10 h-10 flex items-center justify-center bg-8x-coral rounded-full">
                          <Play size={18} className="text-white fill-current ml-1" />
                        </div>
                        <div className="flex-1 h-1.5 bg-[#2A2D26] rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-8x-coral rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    {/* Mock Transcript snippet */}
                    <div>
                      <h4 className="text-lg font-bold text-8x-ink mb-6 pb-4 border-b border-8x-border/40">Transcript</h4>
                      <div className="space-y-4 pr-4">
                        <div className="flex space-x-6 p-4 -mx-4 rounded-xl bg-8x-warm/50 border border-8x-border/40">
                          <span className="text-sm font-semibold min-w-[3.5rem] text-left tabular-nums text-8x-coral mt-0.5">14:22</span>
                          <div className="flex-1">
                            <span className="text-sm font-bold mb-1 block text-8x-ink">Sarah Chen</span>
                            <p className="text-base leading-relaxed text-8x-ink font-medium">So the main priority for Q3 is stabilizing the core experience before we expand the feature set.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Summary */}
                  <div className="flex flex-col lg:border-l lg:border-8x-border/40 lg:pl-8">
                    <h4 className="text-lg font-bold text-8x-ink mb-6 pb-4 border-b border-8x-border/40">AI Summary</h4>
                    <div className="space-y-8">
                      <div>
                        <h5 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Key Points</h5>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-8x-ink">
                          <li>Prioritize stability in Q3 over new features.</li>
                          <li>Customer feedback indicates performance is the main blocker for enterprise adoption.</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-4">Action Items</h5>
                        <ul className="space-y-3">
                          <li className="flex items-start text-sm">
                            <div className="h-4 w-4 rounded border border-8x-border mt-0.5 mr-3 bg-white"></div>
                            <span className="text-8x-ink font-medium">Draft Q3 stability roadmap</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - FINAL CTA */}
        <section className="px-4 sm:px-6 md:px-8 py-32 text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-8x-ink mb-10 tracking-tight leading-tight">Make every conversation<br/>useful.</h2>
          <Link 
            to="/meetings"
            className="inline-flex items-center px-8 py-4 border border-8x-btn-primary text-base font-bold rounded-xl text-8x-btn-primary-fg bg-8x-btn-primary hover:bg-8x-btn-primary-hover transition-colors shadow-sm"
          >
            Open your meetings <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </section>
      </main>
      
      <footer className="border-t border-8x-border/40 py-8 text-center text-8x-muted text-sm font-medium">
        <p>&copy; 2026 8xFathom. A premium meeting workspace.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
