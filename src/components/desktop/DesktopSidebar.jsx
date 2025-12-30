import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 rounded-xl flex items-center justify-center relative group transition-all duration-200 ${
      isActive 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
        : 'text-gray-400 hover:bg-dark-800 hover:text-white'
    }`}
    title={label}
  >
    <div className="text-xl">
      {icon}
    </div>
    
    {/* Tooltip */}
    <div className="absolute left-14 bg-dark-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-dark-700 z-50">
      {label}
    </div>
  </button>
);

const DesktopSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/simulations', icon: '🔬', label: 'Simulations' },
    { path: '/learn', icon: '📚', label: 'Learn' },
    { path: '/qubit-ai', icon: '⚛️', label: 'AI Assistant' },
  ];

  return (
    <div className="w-16 bg-dark-900 border-r border-dark-800 flex flex-col items-center py-6 h-full select-none z-40">
      <div className="flex-1 w-full flex flex-col gap-4 items-center">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      
      <div className="w-full flex flex-col gap-4 pb-4 items-center">
        <button
          onClick={() => navigate('/download')}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary-400 hover:bg-dark-800 transition-colors"
          title="Check for Updates"
        >
          <div className="text-xl">⬇️</div>
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;
