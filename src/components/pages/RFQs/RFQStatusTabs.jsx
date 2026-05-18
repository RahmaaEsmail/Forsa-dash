import React from 'react'
import { Check } from 'lucide-react'

const statuses = [
  { label: "Draft", key: "draft" },
  { label: "RFQ Sent", key: "rfq_sent" },
  { label: "Buyer Approval", key: "buyer_approval" },
  { label: "Price Gathering Approval", key: "price_gathering_approval" },
  { label: "PO Approval", key: "po_approval" },
  { label: "Purchase Ordered", key: "purchase_ordered" },
];

export default function RFQStatusTabs({ currentStatus = "draft" }) {
  const displayStatuses = [...statuses];
  if (currentStatus === 'canceled') {
    displayStatuses.push({ label: "Canceled", key: "canceled" });
  }

  const currentIndex = displayStatuses.findIndex(s => s.key === currentStatus) === -1 ? 0 : displayStatuses.findIndex(s => s.key === currentStatus);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center w-full min-w-max bg-white rounded-full border border-slate-100 p-1 shadow-sm">
        {displayStatuses.map((status, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div 
              key={index}
              className={`flex-1 flex justify-center items-center px-6 py-3 rounded-full transition-all relative ${
                isActive 
                  ? "bg-[#E0F2FE] text-[#0369A1] font-bold shadow-xs" 
                  : isCompleted 
                    ? "text-[#0369A1] font-medium" 
                    : "text-slate-400 font-medium"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isActive || isCompleted ? "bg-[#0369A1] text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span className="text-xs lg:text-sm whitespace-nowrap">
                  {status.label}
                </span>
              </div>
              
              {index < displayStatuses.length - 1 && (
                <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[1px] h-4 bg-slate-100" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

