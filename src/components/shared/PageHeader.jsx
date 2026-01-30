import React from 'react'

export default function PageHeader({ title, subTitle, children }) {
  return (
    <div className="flex justify-between items-center">
      <div className='flex flex-col gap-1'>
        <h3 className='text-secondary  text-x-large font-bold'>{title}</h3>
        <p className='text-base font-normal text-paragraph!'>{subTitle}</p>
      </div>

      {children}
    </div>
  )
}
