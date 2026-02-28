import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Building2Icon, Globe, Mail, Phone } from 'lucide-react'
import { Badge } from '../../../ui/badge'
import { Separator } from '../../../ui/separator'

export default function PurchaseDetailsCustomer({ pr }) {
  return (
    <Card className="shadow-sm border-slate-200 pt-0 overflow-hidden">
      <CardHeader className="pb-3 bg-slate-50/50 pt-5 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
            <Building2Icon className="w-4 h-4" /> Customer Information
          </CardTitle>
          {pr?.customer?.customer_type && (
            <Badge variant="outline" className="bg-white capitalize text-[10px]">
              {pr?.customer.customer_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900">
            {pr?.customer?.company_name || `${pr?.customer?.first_name || ''} ${pr?.customer?.last_name || ''}`.trim() || 'N/A'}
          </h3>
          {pr?.customer?.website && (
            <a
              href={pr?.customer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              <Globe className="w-3 h-3" /> {pr?.customer.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        {(pr?.customer?.commercial_register || pr?.customer?.tax_number) && (
          <>
            <div className="grid grid-cols-2 gap-4 py-2">
              {pr?.customer?.commercial_register && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Commercial Register
                  </p>
                  <p className="text-sm font-medium">{pr?.customer.commercial_register}</p>
                </div>
              )}
              {pr?.customer?.tax_number && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Tax Number
                  </p>
                  <p className="text-sm font-medium">{pr?.customer.tax_number}</p>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        <div className="space-y-2.5">
          {pr?.customer?.email && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-slate-600">{pr?.customer?.email}</span>
            </div>
          )}
          {(pr?.customer?.mobile || pr?.customer?.phone) && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                {pr?.customer?.mobile && <span className="text-slate-600">{pr?.customer.mobile}</span>}
                {pr?.customer?.phone && (
                  <span className="text-[10px] text-muted-foreground">
                    Office: {pr?.customer.phone}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {pr?.customer?.notes && (
          <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mt-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Customer Notes</p>
            <p className="text-xs italic text-slate-600">{pr?.customer.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
