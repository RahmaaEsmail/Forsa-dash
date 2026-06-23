import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import ActivityLog from '../ActivityLog/ActivityLog';
import { SidebarProvider } from '../../context/SidebarContext';
import { MessageSquare } from 'lucide-react';

const getModelFromPath = (pathname) => {
  // Remove query params and hashes, then split by slashes
  const cleanPath = pathname.split('?')[0].split('#')[0];
  console.log("cleanPath", cleanPath);
  const parts = cleanPath.split('/').filter(Boolean);
  console.log("parts", parts);

  if (parts.length === 2) {
    if (parts[0] === 'purchase_request_details') {
      return { model_type: 'purchase_request', model_id: parts[1] };
    }
    if (parts[0] === 'delivery-note-details') {
      return { model_type: 'delivery_order', model_id: parts[1] };
    }
  }

  if (parts.length === 3) {
    if (parts[0] === 'rfqs' && parts[2] === 'details') {
      return { model_type: 'rfq', model_id: parts[1] };
    }
    if (parts[0] === 'rfqs' && parts[2] === 'edit') {
      return { model_type: 'rfq', model_id: parts[1] };
    }
    if (parts[0] === 'quotations' && parts[2] === 'details') {
      return { model_type: 'quotation', model_id: parts[1] };
    }
    if (parts[0] === 'grns' && parts[2] === 'details') {
      return { model_type: 'grn', model_id: parts[1] };
    }
    if (parts[0] === 'customer-invoices' && parts[2] === 'details') {
      return { model_type: 'customer_invoice', model_id: parts[1] };
    }
  }

  return null;
};

export default function DashLayout() {
  const location = useLocation();
  const modelInfo = getModelFromPath(location.pathname);
  console.log("modelInfo", modelInfo);
  const [isOpen, setIsOpen] = useState(true); // Open by default for better user visibility

  // Automatically close sidebar when navigating to a page without activity logs
  useEffect(() => {
    console.log("DashLayout: Current pathname:", location.pathname, "Resolved modelInfo:", modelInfo);
    if (!modelInfo) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [location.pathname, !!modelInfo]);

  const hasActivityLog = !!modelInfo;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F8F9FB] relative overflow-x-hidden">
        {/* Fixed sidebar – slides in on mobile, always visible on md+ */}
        <Sidebar />

        {/* Main content column with dynamic right margin */}
        <div
          className={`transition-all duration-300 md:ml-75 px-4 md:px-0 ${
            hasActivityLog && isOpen ? 'md:mr-[370px]' : 'md:mr-10'
          }`}
        >
          <Header />
          <main className="mt-10 min-h-screen overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* Floating Action Button (FAB) to open Activity Log when closed */}
        {hasActivityLog && !isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer border border-primary/20"
            title="Open Activity Log"
          >
            <MessageSquare size={22} className="group-hover:rotate-6 transition-transform" />
          </button>
        )}

        {/* Sidebar Activity Log */}
        {hasActivityLog && isOpen && (
          <ActivityLog
            modelType={modelInfo.model_type}
            modelId={modelInfo.model_id}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
