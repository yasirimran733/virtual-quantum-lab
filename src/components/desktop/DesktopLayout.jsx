import React from 'react';
import DesktopTitleBar from './DesktopTitleBar';
import DesktopSidebar from './DesktopSidebar';

const DesktopLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-dark-900 text-gray-900 dark:text-white">
      <DesktopTitleBar />
      
      <div className="flex flex-1 pt-10 h-full overflow-hidden">
        <DesktopSidebar />
        
        <main className="flex-1 h-full overflow-auto bg-gray-50 dark:bg-dark-900 relative scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
          {/* File Explorer / Context Area could go here in a future update */}
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
