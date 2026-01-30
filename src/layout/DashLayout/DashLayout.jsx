import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'

export default function DashLayout() {
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
