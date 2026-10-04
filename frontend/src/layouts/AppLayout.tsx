import { Outlet, NavLink } from 'react-router-dom';
import { Home, Video, Search } from 'lucide-react';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <span className="font-bold text-xl tracking-tight text-blue-600">8xFathom</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink 
            to="/" 
            className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/meetings" 
            className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Video size={18} />
            <span>Meetings</span>
          </NavLink>
          <NavLink 
            to="/search" 
            className={({isActive}) => `flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Search size={18} />
            <span>Search</span>
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50/50 p-8 sm:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
