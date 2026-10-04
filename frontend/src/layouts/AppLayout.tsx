import { Outlet, NavLink } from 'react-router-dom';
import { Home, Video, Search } from 'lucide-react';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-8x-warm text-8x-ink font-sans">
      <aside className="w-64 bg-8x-warm border-r border-8x-border flex flex-col z-10">
        <div className="px-6 py-8 flex items-center">
          <span className="font-serif font-bold text-3xl tracking-tight text-8x-ink">
            8x<span className="font-sans font-medium tracking-tight ml-1.5 text-xl">Fathom</span>
          </span>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          <NavLink 
            to="/" 
            className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive ? 'bg-white shadow-sm text-8x-coral border border-8x-border/50' : 'text-8x-muted hover:text-8x-ink hover:bg-8x-surface'}`}
          >
            {({ isActive }) => (
              <>
                <Home size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>
          <NavLink 
            to="/meetings" 
            className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive ? 'bg-white shadow-sm text-8x-coral border border-8x-border/50' : 'text-8x-muted hover:text-8x-ink hover:bg-8x-surface'}`}
          >
            {({ isActive }) => (
              <>
                <Video size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>Meetings</span>
              </>
            )}
          </NavLink>
          <NavLink 
            to="/search" 
            className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive ? 'bg-white shadow-sm text-8x-coral border border-8x-border/50' : 'text-8x-muted hover:text-8x-ink hover:bg-8x-surface'}`}
          >
            {({ isActive }) => (
              <>
                <Search size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>Search</span>
              </>
            )}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-8x-warm p-8 sm:p-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
