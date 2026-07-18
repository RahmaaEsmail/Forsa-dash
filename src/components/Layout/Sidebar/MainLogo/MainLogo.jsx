import React from 'react'
import { useSidebar } from '../../../../context/SidebarContext'

export default function MainLogo() {
  const { isMinimized } = useSidebar() || {};

  return (
    <div className={`mt-4 md:mt-16 flex justify-center items-center transition-all duration-300 ${isMinimized ? 'mx-2 md:mx-2' : 'mx-8.75'}`}>
      <span className={`text-primary font-black text-xl tracking-wider select-none font-cairo transition-all duration-300 ${isMinimized ? 'hidden md:block' : 'hidden'}`}>
        FORSA
      </span>
      <img 
        src='/images/LOGO.svg' 
        className={`h-22 w-39.25 object-cover transition-all duration-300 ${isMinimized ? 'block md:hidden' : 'block'}`} 
        alt="Logo"
      />
    </div>
  )
}

