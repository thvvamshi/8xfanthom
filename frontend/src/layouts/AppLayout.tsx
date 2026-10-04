import { Outlet, NavLink, Link } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-8x-warm text-8x-ink font-sans flex flex-col">
      <header className="px-8 py-6 flex items-center border-b border-8x-border/40 bg-8x-warm/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to="/" className="font-serif font-bold text-2xl tracking-tight text-8x-ink transition-transform hover:scale-[1.02]">
              8x<span className="font-sans font-medium tracking-tight ml-1 text-lg">Fathom</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-8x-coral' : 'text-8x-muted hover:text-8x-ink'}`}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/meetings" 
                className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-8x-coral' : 'text-8x-muted hover:text-8x-ink'}`}
              >
                Meetings
              </NavLink>
              <NavLink 
                to="/search" 
                className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-8x-coral' : 'text-8x-muted hover:text-8x-ink'}`}
              >
                Search
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-8 sm:px-8 sm:py-16 animate-slide-up">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
