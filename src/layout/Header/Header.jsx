import { Bell, MoveDown, Search } from 'lucide-react'
import React from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

export default function Header() {
  return (
    <div className='bg-white rounded-main p-5 mt-10 flex justify-between items-center'>
      <div className='flex flex-col gap-1'>
        <h4 className="text-secondary text-large font-bold">Welcome back, Shahd</h4>
        <p className='text-placeholder leading-3.5 text-small'>Measure your advertising ROI and report website traffic.</p>
      </div>

      <div className='bg-input-bg flex items-center gap-2 rounded-main px-3 min-h-9.5 min-w-100'>
        <Search size={14} color='gray' />
        <Input type="text" className={"border-none shadow-none px-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 focus:outline-none focus:border-none"} placeholder="Search" />
      </div>

      <div className="flex gap-4 items-center">
        <div className='relative mt-2'>
          <img src="/images/bell.svg" alt="Notification Image" className='h-7 w-6' />
          <span className='w-5 h-5 rounded-full p-2 text-small bg-primary flex justify-center items-center text-white font-bold absolute -top-2 -right-2'>4</span>
        </div>

        <Button variant='default' className={"text-small! py-2 font-bold flex gap-1 items-center"} size='sm'>
          <span>Export Data</span>
          <MoveDown size={12} />
        </Button>
      </div>
    </div>
  )
}
