import React from 'react'
import StatisticCard from './StatisticsCard'

export default function HomeStatistics() {
  return (
    <div className='grid grid-cols-3 gap-7'>
      <StatisticCard title="Transportation Spending" up={true} number={"302.9K"} bgIcon={"#FBB100"} rating={"8.5%"} icon={"/images/icon-park-twotone_transporter.svg"}/>
      <StatisticCard title="Logistics Spending" up={false} number={"316.6K"} bgIcon={"#00B69B"} rating={"4.3%"} icon={"/images/carbon_chart-logistic-regression.svg"}/>
      <StatisticCard title="GR" up={true} number={"69K"} bgIcon={"#8280FF"} rating={"2%"} icon={"/images/carbon_dashboard.svg"}/>
    </div>
  )
}
