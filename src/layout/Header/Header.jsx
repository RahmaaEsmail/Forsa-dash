import { Menu, MoveDown, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useSidebar } from '../../context/SidebarContext'
import useUnreadCount from '../../hooks/Notifications/useUnreadCount'
import { NavLink } from 'react-router-dom'
import { config } from '../../api/config'

export default function Header() {
  const { toggle, isMinimized, toggleMinimize } = useSidebar() || {};
  const { data: unreadCountData } = useUnreadCount();
  
  console.log("data" , unreadCountData)
  const unreadCount = unreadCountData?.data?.unread_count || 0;
  const [userData, setUserData] = useState(null);
  useEffect(() => { 
    console.log("user data", JSON.parse(localStorage.getItem((config.localStorageUserData))))
    setUserData(JSON.parse(localStorage.getItem((config.localStorageUserData))))
  } ,[])

  return (
    <div className='bg-white rounded-main p-4 md:p-5 mt-6 md:mt-10 flex flex-wrap gap-3 justify-between items-center'>
      {/* Left: Hamburger + Title */}
      <div className='flex items-center gap-3 min-w-0'>
        {/* Hamburger – only visible on mobile */}
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0 md:hidden'
          onClick={toggle}
          aria-label='Open menu'
        >
          <Menu className='w-5 h-5 text-secondary' />
        </Button>

        {/* Toggle Minimize Arrow – visible only on desktop */}
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0 hidden md:inline-flex text-secondary hover:bg-slate-100 rounded-full'
          onClick={toggleMinimize}
          aria-label={isMinimized ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isMinimized ? (
            <ChevronRight className='w-5 h-5' />
          ) : (
            <ChevronLeft className='w-5 h-5' />
          )}
        </Button>

        <div className='flex flex-col gap-0.5 min-w-0'>
          <h4 className="text-secondary text-base md:text-large font-bold leading-tight truncate">Welcome back, {userData?.name}</h4>
          <p className='text-placeholder text-xs md:text-small leading-tight hidden sm:block'>Measure your advertising ROI and report website traffic.</p>
        </div>
      </div>

      {/* Centre: Search bar */}
      {/* <div className='bg-input-bg flex items-center gap-2 rounded-main px-3 h-10 flex-1 min-w-[140px] max-w-xs md:max-w-sm lg:min-w-100'>
        <Search size={14} color='gray' className='shrink-0' />
        <Input
          type="text"
          className="border-none shadow-none px-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 focus:outline-none focus:border-none w-full bg-transparent"
          placeholder="Search"
        />
      </div> */}

      {/* Right: Bell + Export */}
      <div className="flex gap-3 items-center shrink-0">
        <NavLink to="/notifications" className='relative'>
          <img src="/images/bell.svg" alt="Notifications" className='h-7 w-6' />
          {unreadCount > 0 && (
            <span className='w-5 h-5 rounded-full p-2 text-[10px] bg-primary flex justify-center items-center text-white font-bold absolute -top-2 -right-2'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </NavLink>

        {/* <Button variant='default' className="text-small! py-2 font-bold flex gap-1 items-center" size='sm'>
          <span className='hidden sm:inline'>Export Data</span>
          <MoveDown size={12} />
        </Button> */}
      </div>
    </div>
  )
}
