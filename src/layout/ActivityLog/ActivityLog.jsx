// ActivityLog.js
import React from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Link, Send } from 'lucide-react'
import ActivityLogChats from '../../components/Layout/ActivityLog/ActivityLogChats'

export default function ActivityLog({ isDrawer = false }) {
  // If it's a drawer, we don't want the 'fixed' and 'right-3' positioning 
  // because the Sheet component handles that.
  const containerClasses = isDrawer 
    ? "h-full flex flex-col bg-white" 
    : "fixed top-5 bottom-5 right-3 w-80 rounded-main bg-white border-r-2 border-[#E6EFF5] shadow-main flex flex-col";

  return (
    <div className={containerClasses}>
      {/* Header - Changed from fixed to static/sticky for better scrolling */}
      <div className='p-5 border-b flex gap-2 items-center'>
        <img src="/images/streamline-logos_google-chat-logo-solid.svg" className='w-5 h-5' alt="logo" />
        <p className='text-base font-bold text-secondary'>Activity Chat Log</p>
      </div>

      {/* Chat Body */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-4'>
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-gray-200" />
          <p className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-gray-400 uppercase">
            Today
          </p>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <ActivityLogChats />
      </div>

      {/* Input Area - Uses flex-shrink-0 to stay at bottom */}
      <div className='p-4 border-t bg-white'>
        <div className='flex gap-2 items-center'>
          <div className='rounded-lg pr-3 items-center bg-slate-50 w-full flex gap-2 border border-gray-200'>
            <Input 
              placeholder="Type a message..." 
              className="border-none focus-visible:ring-0 bg-transparent shadow-none" 
            />
            <Link size={18} className="text-gray-400 cursor-pointer hover:text-primary transition-colors" />
          </div>
          <Button className="rounded-full h-10 w-10 p-0 shrink-0">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}