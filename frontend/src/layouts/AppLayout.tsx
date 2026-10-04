import { Outlet, NavLink, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-8x-warm text-8x-ink font-sans flex flex-col transition-colors">
      <div className="w-full px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 sticky top-0 z-50">
        <header className="w-full max-w-[1200px] mx-auto bg-8x-navbar/95 backdrop-blur-md rounded-2xl border border-8x-border/50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-sm transition-all gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-12 gap-4 sm:gap-0 w-full sm:w-auto">
            <Link to="/" className="font-serif font-bold text-2xl tracking-tight text-8x-ink transition-transform hover:scale-[1.02]">
              8x<span className="font-sans font-medium tracking-tight ml-1 text-lg">Fathom</span>
            </Link>
            <nav className="flex items-center justify-center space-x-6 sm:space-x-8 w-full sm:w-auto overflow-x-auto">
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>
      </div>
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16 animate-slide-up">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
