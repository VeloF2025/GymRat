'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { currentUser, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {currentUser && (
          <>
            {/* Desktop Sidebar */}
            <Sidebar />
            
            {/* Mobile Sidebar */}
            {sidebarOpen && (
              <div className="md:hidden">
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-30" onClick={toggleSidebar}></div>
                <Sidebar isMobile onClose={toggleSidebar} />
              </div>
            )}
            
            {/* Mobile Sidebar Toggle Button */}
            <button
              className="md:hidden fixed bottom-4 right-4 z-20 p-3 rounded-full bg-blue-600 text-white shadow-lg"
              onClick={toggleSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </>
        )}
        
        <main className={`flex-1 p-4 md:p-6 ${currentUser ? 'md:ml-64' : ''}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
