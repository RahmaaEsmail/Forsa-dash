import React from 'react'
import { Badge } from '../../../ui/badge'
import { Calendar, User } from 'lucide-react'

export default function PurchaseDetailsHeader({getStatusVariant , pr, getStatusIcon}) {
  return (
     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={getStatusVariant(pr?.status)} className="px-3 py-0.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                    {getStatusIcon(pr?.status)}
                    {pr?.status}
                  </Badge>
                  {pr?.status === 'rejected' && pr?.rejected_at && (
                    <span className="text-xs text-muted-foreground">
                      Rejected on {new Date(pr?.rejected_at).toLocaleDateString()}
                    </span>
                  )}
                  {pr?.status === 'approved' && pr?.approved_at && (
                    <span className="text-xs text-muted-foreground">
                      Approved on {new Date(pr?.approved_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Request #{pr?.pr_number}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Created on {new Date(pr.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Created by {pr?.created_by?.name}
                  </p>
                </div>
              </div>
            
            </div>
  )
}
