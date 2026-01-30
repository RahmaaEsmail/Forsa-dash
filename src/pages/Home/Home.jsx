import React from 'react'
import HomeStatistics from '../../components/pages/Home/HomeStatistics/HomeStatistics'
import HomeTables from '../../components/pages/Home/HomeTables/HomeTables'

export default function Home() {
  return (
    <div className='flex flex-col pb-6 gap-5'>
      <HomeStatistics />
      <HomeTables />
    </div>
  )
}
