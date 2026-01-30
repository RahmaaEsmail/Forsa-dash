import React from 'react'
import MainLogo from '../../components/Layout/Sidebar/MainLogo/MainLogo'
import Links from '../../components/Layout/Sidebar/Links/Links'

export default function Sidebar() {
  return (
    <div className='fixed top-0 bottom-0 left-0 bg-white w-65 border-r-2 border-[#E6EFF5] shadow-main'>
       <MainLogo />
       <Links/>
    </div>
  )
}
