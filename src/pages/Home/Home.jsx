import React from 'react'
import HomeStatistics from '../../components/pages/Home/HomeStatistics/HomeStatistics'
import HomeTables from '../../components/pages/Home/HomeTables/HomeTables'
import useListHome from '../../hooks/home/useListHome'
import Loading from '../../components/shared/Loading'

export default function Home() {
  const { data, isLoading } = useListHome();
  
  if (isLoading) return <Loading />;
  
  const stats = data?.data || data;

  return (
    <div className='flex flex-col pb-6 gap-5'>
      <HomeStatistics data={stats} />
      {/* <HomeTables /> Uncomment or update tables when API provides table data */}
    </div>
  )
}
