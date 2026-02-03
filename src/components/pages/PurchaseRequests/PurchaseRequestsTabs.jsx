import React, { lazy, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Suspense } from 'react'
import { Circles } from 'react-loader-spinner'
import { Card } from '../../ui/card';

const PurchaseProducts = lazy(() => import("./PurchaseProducts"));
const PurchaseProfits = lazy(() => import("./PurchaseProfits"));

const tabs = [
  {
    id: 1,
    name: "Products",
    component: <PurchaseProducts />,
  },
  {
    id: 2,
    name: "Profit",
    component: <PurchaseProfits />,
  }
]

export default function PurchaseRequestsTabs() {
  const defaultTab = useMemo(() => tabs[0]?.id ,[])
  const [selectedTabId , setSelectedTabId] = useState(defaultTab);

  return (
    <Tabs 
    className="gap-0"
    value={selectedTabId}
        onValueChange={setSelectedTabId}>
      <TabsList
       className="bg-white rounded-tl-lg p-0 h-12 rounded-b-none rounded-tr-lg w-fit">
        {tabs.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className="flex-1 shadow-none! data-[state=active]:shadow-none! rounded-none  p-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-secondary data-[state=active]:font-bold text-[#B2B8CF] text-base"
          >
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((item) => (
        <TabsContent key={item.id} value={item.id} className="mt-0 ">
          <Card className="rounded-tl-none  rounded-tr-lg rounded-b-lg shadow-none border-[#E6EFF5]">
            <Suspense fallback={<div className="h-full py-6 w-full flex justify-center">
              <Circles
                height="50"
                width="50"
                color="#C94544"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>}>
              {item.component}
            </Suspense>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
