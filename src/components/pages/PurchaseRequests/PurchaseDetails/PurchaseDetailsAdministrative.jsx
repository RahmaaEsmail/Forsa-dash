import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Separator } from '../../../ui/separator'
import { FileText } from 'lucide-react'

export default function PurchaseDetailsAdministrative({ pr }) {
  return (
    <Card className="bg-slate-50/50 border-dashed border-slate-300 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" /> Administrative Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Sales Representative */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">
            Assigned Sales Rep
          </span>
          {pr?.sales_user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                {pr?.sales_user.name?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-slate-700">{pr?.sales_user.name}</span>
                <span className="text-[10px] text-muted-foreground">{pr?.sales_user.email}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No sales rep assigned</p>
          )}
        </div>

        <Separator />

        {/* Created By */}
        {pr?.created_by && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground uppercase font-bold">Created By</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                {pr?.created_by.name?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-slate-700">{pr?.created_by.name}</span>
                <span className="text-[10px] text-muted-foreground">{pr?.created_by.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* General Notes */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">General Notes</span>
          <p className="text-xs text-slate-600 italic leading-relaxed bg-white p-3 rounded-md border">
            {pr?.notes ? pr?.notes : "No internal notes provided."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
