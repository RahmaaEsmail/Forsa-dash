import { FileText } from 'lucide-react'
import React from 'react'

export default function PurchaseDetailsStats({ totalEstimatedAmount, pr }) {
  return (
    <div className="p-5 rounded-xl border bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-slate-600">Total Estimation</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-primary">
            {totalEstimatedAmount?.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-muted-foreground">SAR</span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <FileText className="w-3 h-3" />
          <span>RFQs: {pr?.rfqs_count || 0}</span>
        </div>
      </div>
    </div>
  )
}
