import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const statuses = [
  { id: 'draft', label: 'Draft', key: 'draft' },
  { id: 'client_approval', label: 'Client Approval', key: 'client_approval' },
  { id: 'sales_manager_approval', label: 'Manager Approval', key: 'sales_manager_approval' },
  { id: 'proforma_invoice', label: 'Proforma', key: 'proforma_invoice' },
  { id: 'paid_payment', label: 'Paid', key: 'paid_payment' },
  { id: 'delivered', label: 'Delivered', key: 'delivered' },
]

export default function QuotationStatusTabs({ currentStatus }) {
  const currentIndex = statuses.findIndex(s => s.id === currentStatus)

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        />

        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex || currentStatus === 'delivered'
          const isActive = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={status.id} className="flex flex-col items-center relative z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4",
                  isCompleted ? "bg-primary border-primary text-white" : 
                  isActive ? "bg-white border-primary text-primary" : 
                  "bg-white border-slate-100 text-slate-300"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider transition-colors",
                    isActive ? "text-primary" : isCompleted ? "text-slate-600" : "text-slate-300"
                )}>
                  {status.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
