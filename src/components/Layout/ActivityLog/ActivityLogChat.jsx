import React from 'react'

export default function ActivityLogChat() {
  return (
    <div className='flex gap-2'>
      <img src="https://avatar.iran.liara.run/public/36" className='w-10 h-10 mt-auto rounded-full' />
      <div className='bg-[#F5F7FA] w-full p-4 rounded-tr-lg rounded-tl-lg rounded-br-lg min-h-[110px]'>
        <h4 className='font-bold text-secondary text-lg'>Shahd Ayman </h4>
        <p className='text-base font-normal text-secondary'>Creating a new record</p>

        <p className='text-secondary w-fit text-sm font-normal ms-auto mt-auto'>6.30 pm</p>
      </div>
    </div>
  )
}
