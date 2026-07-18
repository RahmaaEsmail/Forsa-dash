import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('sidebar-minimized') === 'true';
    } catch {
      return false;
    }
  });

  // Close sidebar when the viewport grows past md breakpoint
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e) => { if (e.matches) setIsOpen(false); };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const close  = () => setIsOpen(false);

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar-minimized', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, isMinimized, toggleMinimize }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);

