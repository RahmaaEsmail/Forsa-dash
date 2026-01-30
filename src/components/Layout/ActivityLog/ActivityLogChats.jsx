import React from 'react'
import ActivityLogChat from './ActivityLogChat'

export default function ActivityLogChats() {
  return (
    <div className='flex flex-col gap-6'>
      <ActivityLogChat />
      <ActivityLogChat />
      <ActivityLogChat />
    </div>
  )
}
