import React from 'react'
import { Circles } from 'react-loader-spinner'

export default function Loading() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Circles
        height="80"
        width="80"
        color="#C94544"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  )
}
