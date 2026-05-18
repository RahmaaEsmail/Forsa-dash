import React from 'react'
import StatisticCard from '../Home/HomeStatistics/StatisticsCard'

export default function PurchaseRequestStats({ stats }) {
  return (
    <div className='grid px-5 grid-cols-3 gap-5 items-center'>
      <StatisticCard title={"All RFQ’s To Send"} number={stats?.to_send || "0"} icon={"/public/images/Icon.svg"} desc={`My RFQ’s ${stats?.my_to_send || 0}`}/>
      <StatisticCard title={"All RFQ’s are Waiting"} number={stats?.waiting || "0"} icon={"/public/images/Icon(2).svg"} desc={`My RFQ’s ${stats?.my_waiting || 0}`}/>
      <StatisticCard title={"All RFQ’s are late"} number={stats?.late || "0"} icon={"/public/images/Icon(1).svg"} desc={`My RFQ’s ${stats?.my_late || 0}`}/>
    </div>
  )
}
