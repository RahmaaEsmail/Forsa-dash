import { Menu, MoveDown, Search } from 'lucide-react'
import React from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useSidebar } from '../../context/SidebarContext'

export default function Header() {
  const { toggle } = useSidebar();

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

        <div className='flex flex-col gap-0.5 min-w-0'>
          <h4 className="text-secondary text-base md:text-large font-bold leading-tight truncate">Welcome back, Shahd</h4>
          <p className='text-placeholder text-xs md:text-small leading-tight hidden sm:block'>Measure your advertising ROI and report website traffic.</p>
        </div>
      </div>

      {/* Centre: Search bar */}
      <div className='bg-input-bg flex items-center gap-2 rounded-main px-3 h-10 flex-1 min-w-[140px] max-w-xs md:max-w-sm lg:min-w-100'>
        <Search size={14} color='gray' className='shrink-0' />
        <Input
          type="text"
          className="border-none shadow-none px-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 focus:outline-none focus:border-none w-full bg-transparent"
          placeholder="Search"
        />
      </div>

      {/* Right: Bell + Export */}
      <div className="flex gap-3 items-center shrink-0">
        <div className='relative'>
          <img src="/images/bell.svg" alt="Notifications" className='h-7 w-6' />
          <span className='w-5 h-5 rounded-full p-2 text-small bg-primary flex justify-center items-center text-white font-bold absolute -top-2 -right-2'>4</span>
        </div>

        <Button variant='default' className="text-small! py-2 font-bold flex gap-1 items-center" size='sm'>
          <span className='hidden sm:inline'>Export Data</span>
          <MoveDown size={12} />
        </Button>
      </div>
    </div>
  )
}
