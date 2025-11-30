import React from 'react';
import DesktopTitleBar from './DesktopTitleBar';
import DesktopSidebar from './DesktopSidebar';

const DesktopLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      <DesktopTitleBar />
      
      <div className="flex flex-1 pt-8 h-full overflow-hidden">
        <DesktopSidebar />
        
        <main className="flex-1 h-full overflow-auto bg-slate-950 relative">
          {/* File Explorer / Context Area could go here in a future update */}
          <div className="h-full w-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
