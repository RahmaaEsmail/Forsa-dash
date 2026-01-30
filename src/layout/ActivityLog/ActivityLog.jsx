import React from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Link, Send } from 'lucide-react'
import ActivityLogChats from '../../components/Layout/ActivityLog/ActivityLogChats'

export default function ActivityLog() {
  return (
    <div className='fixed top-5 bottom-5 p-3 rounded-main right-3 bg-white w-75 border-r-2 border-[#E6EFF5] shadow-main'>
      <div className='flex w-70 fixed top-10  gap-2 items-center'>
        <img src="/public/images/streamline-logos_google-chat-logo-solid.svg" className='w-5 h-5'/>
        <p className='text-base font-bold text-secondary'>Activity Chat Log</p> 
      </div>
       
       <div className='flex relative top-14 flex-col gap-2'>
    <div className="flex items-center gap-3 py-2">
  <div className="h-px flex-1 bg-gray-200" />
  <p className="whitespace-nowrap rounded-full  px-3 py-1 text-md font-medium text-gray-600">
    Today
  </p>
  <div className="h-px flex-1 bg-gray-200" />
</div>


        <ActivityLogChats />
       </div>
       
      <div className='fixed w-70 bottom-7'>
        <div className='flex gap-2 items-center'>
          <div className='rounded-lg! pr-3 items-center bg-input-bg! w-full flex gap-8  border border-gray-200'>
            <Input placeholder="Type a message..." className={"border-none! outline-none bg-transparent"}/>
            <Link size={20} color='#858B9E'/>
          </div>
          <Button className={"rounded-full"}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  )
}
