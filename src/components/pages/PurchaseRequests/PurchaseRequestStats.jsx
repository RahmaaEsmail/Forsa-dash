import React from 'react'
import StatisticCard from '../Home/HomeStatistics/StatisticsCard'

export default function PurchaseRequestStats() {
  return (
    <div className='grid px-5 grid-cols-3 gap-5 items-center'>
      <StatisticCard title={"All RFQ’s To Send"} number={"18"} icon={"/public/images/Icon.svg"} desc="My  RFQ’s 12"/>
      <StatisticCard title={"All RFQ’s are Waiting"} number={"0"} icon={"/public/images/Icon(2).svg"} desc="My  RFQ’s 12"/>
      <StatisticCard title={"All RFQ’s are late"} number={"29"} icon={"/public/images/Icon(1).svg"} desc="My  RFQ’s 12"/>
    </div>
  )
}
