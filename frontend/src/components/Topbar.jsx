import React, { useContext } from 'react';
import { Menu, LogOut, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-gray-800 glass lg:px-6">
      <div className="flex items-center">
        <button
          className="p-2 text-gray-400 bg-surface rounded-xl hover:text-white hover:bg-gray-800 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="hidden lg:block text-sm font-medium text-gray-400">
          Advanced Anomaly Detection Engine
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 transition-colors rounded-full hover:bg-surface hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-surface animate-pulse"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-800"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 text-sm font-medium text-danger transition-colors rounded-xl hover:bg-danger/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
