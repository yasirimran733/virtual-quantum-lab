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
    <div className="h-8 bg-slate-900 flex items-center justify-between select-none border-b border-slate-700 w-full fixed top-0 left-0 z-50">
      {/* Drag Region & Logo */}
      <div className="flex items-center pl-3 app-drag-region">
        <img src="/favicon.svg" alt="App Logo" className="w-4 h-4 mr-3" />
        <span className="text-xs text-slate-300 font-medium">Virtual Quantum Lab</span>
      </div>

      {/* Spacer to balance the layout since we removed the center title */}
      <div className="flex-1 app-drag-region"></div>

      {/* Window Controls */}
      <div className="flex h-full no-drag">
        <button 
          onClick={handleMinimize}
          className="h-full w-12 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Minimize"
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" fill="currentColor" />
          </svg>
        </button>
        
        <button 
          onClick={handleMaximize}
          className="h-full w-12 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
          className="h-full w-12 flex items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white transition-colors group"
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
