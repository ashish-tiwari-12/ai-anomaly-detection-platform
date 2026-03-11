import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, ShieldAlert, Users, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ...(user?.role === 'admin'
      ? [{ name: 'Admin Panel', href: '/admin', icon: ShieldAlert }]
      : []),
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div 
        className={clsx(
          "fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar component */}
      <div 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-surface/50 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tighter">
              AI Anomaly
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto mt-6">
          <nav className="flex-1 px-4 space-y-2 text-sm font-medium">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-gray-400 hover:bg-surface hover:text-white border border-transparent"
                )}
                end={item.href === '/'}
              >
                <item.icon className={clsx("h-5 w-5 transition-transform group-hover:scale-110", "text-current")} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* User Quick Info */}
        <div className="p-4 border-t border-gray-800 bg-surface/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
