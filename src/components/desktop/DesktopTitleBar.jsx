import React, { useState, useEffect } from 'react';

const DesktopTitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI.maximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    window.electronAPI.close();
  };

  return (
    <div className="h-10 bg-dark-900 flex items-center justify-between select-none border-b border-dark-800 w-full fixed top-0 left-0 z-50 transition-colors duration-300">
      {/* Drag Region & Logo */}
      <div className="flex items-center pl-4 h-full app-drag-region flex-1">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 flex items-center justify-center text-lg">⚛️</div>
          <span className="text-sm text-gray-300 font-medium tracking-wide">Virtual Quantum Lab</span>
        </div>
      </div>

      {/* Window Controls */}
      <div className="flex h-full no-drag">
        <button 
          onClick={handleMinimize}
          className="h-full w-12 flex items-center justify-center hover:bg-dark-700 text-gray-400 hover:text-white transition-colors focus:outline-none"
          title="Minimize"
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" fill="currentColor" />
          </svg>
        </button>
        
        <button 
          onClick={handleMaximize}
          className="h-full w-12 flex items-center justify-center hover:bg-dark-700 text-gray-400 hover:text-white transition-colors focus:outline-none"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M2.1,0v2H0v8.1h8.2v-2h2.1V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" fill="currentColor" />
            </svg>
          )}
        </button>
        
        <button 
          onClick={handleClose}
          className="h-full w-12 flex items-center justify-center hover:bg-red-600 text-gray-400 hover:text-white transition-colors focus:outline-none group"
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="group-hover:text-white">
            <path d="M0,0l10,10M10,0L0,10" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DesktopTitleBar;
