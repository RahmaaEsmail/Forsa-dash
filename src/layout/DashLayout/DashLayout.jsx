import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import ActivityLog from '../ActivityLog/ActivityLog';

export default function DashLayout() {
  const location = useLocation();
  
  if(location.pathname == "/" || location.pathname=="/products" || location.pathname == "/add_product") {  
  return (
    <div>
      <Sidebar />
      <div className='ml-75 mr-10  mx-auto'>
        <Header />
        <main className='mt-10 min-h-screen overflow-auto'><Outlet/></main>
      </div>
    </div>
  )
}

 return (
    <div>
      <Sidebar />
      <div className='ml-70 mr-85'>
        <Header />
        <main className='mt-10 min-h-screen overflow-auto'><Outlet/></main>
      </div>

      <ActivityLog />
    </div>
  )
}
