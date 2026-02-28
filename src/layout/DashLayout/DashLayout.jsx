import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import ActivityLog from '../ActivityLog/ActivityLog';
import { SidebarProvider } from '../../context/SidebarContext';

const withActivityLog = (pathname) => {
  const noLog = ['/', '/products', '/suppliers', '/create-unit', '/units', '/categories', '/add_product'];
  if (noLog.includes(pathname)) return false;
  if (pathname.includes('product-details') || pathname.includes('supplier')) return false;
  return true;
};

export default function DashLayout() {
  const location = useLocation();
  const showActivityLog = withActivityLog(location.pathname);

  return (
    <SidebarProvider>
      <div className='min-h-screen bg-[#F8F9FB]'>
        {/* Fixed sidebar – slides in on mobile, always visible on md+ */}
        <Sidebar />

        {/* Main content column */}
        <div className={`transition-all duration-300 md:ml-75    md:mr-10  px-4 md:px-0`}>
          <Header />
          <main className='mt-10 min-h-screen overflow-auto'>
            <Outlet />
          </main>
        </div>

        {/* {showActivityLog && <ActivityLog isDrawer={true} />} */}
      </div>
    </SidebarProvider>
  )
}
