import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full h-12 flex items-center justify-center relative group ${
      isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
    }`}
    title={label}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
    )}
    <div className="text-2xl">
      {icon}
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
    { path: '/qubit-ai', icon: '⚛️', label: 'Qubit AI Assistant' },
    { path: '/qrng', icon: '🌀', label: 'ANU QRNG' },
  ];

  const handleExit = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <div className="w-16 bg-dark-900 border-r border-dark-800 flex flex-col items-center py-4 h-full select-none">
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
          onClick={handleExit}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-500 hover:bg-dark-800 transition-colors"
          title="Exit App"
        >
          <div className="text-2xl">🚪</div>
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;
