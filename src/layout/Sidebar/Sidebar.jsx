import React from 'react'
import MainLogo from '../../components/Layout/Sidebar/MainLogo/MainLogo'
import Links from '../../components/Layout/Sidebar/Links/Links'
import { useSidebar } from '../../context/SidebarContext'
import { X } from 'lucide-react'
import { Button } from '../../components/ui/button'

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Backdrop overlay – only shown on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed z-50 top-0 bottom-0 left-0 bg-white w-65 border-r-2 border-[#E6EFF5] shadow-main',
          'overflow-y-auto max-h-screen',
          'transition-transform duration-300 ease-in-out',
          // mobile: hidden by default, slides in when open
          // desktop (md+): always visible
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Close button – visible only on mobile */}
        <div className='flex justify-end p-3 md:hidden'>
          <Button variant='ghost' size='icon' onClick={close} aria-label='Close menu'>
            <X className='w-5 h-5 text-gray-500' />
          </Button>
        </div>

        <MainLogo />
        <Links />
      </aside>
    </>
  )
}
