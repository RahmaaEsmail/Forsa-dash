import { Calendar, Clock, MapPin } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Badge } from '../../../ui/badge'

export default function PurchaseDetailsLogistics({pr}) {
  return (
    <Card className="shadow-sm pt-0 border-slate-200">
      <CardHeader className="pb-3 pt-5 border-b bg-slate-50/50">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
          <MapPin className="w-4 h-4" /> Logistics & Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {pr?.delivery_address && (
          <div className="relative pl-6 border-l-2 border-primary/20 py-1">
            <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
            <span className="text-muted-foreground block mb-1 uppercase text-[10px] font-bold">
              Delivery Address
            </span>
            <p className="font-semibold text-slate-800 leading-snug">{pr?.delivery_address}</p>
            {(pr?.delivery_lat || pr?.delivery_lng) && (
              <div className="flex gap-2 mt-2">
                {pr?.delivery_lat && (
                  <Badge variant="secondary" className="text-[10px] text-gray-300">
                    Lat: {pr?.delivery_lat}
                  </Badge>
                )}
                {pr?.delivery_lng && (
                  <Badge variant="secondary" className="text-[10px] text-gray-300">
                    Lng: {pr?.delivery_lng}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-md text-orange-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-orange-700 font-bold">Required Date</p>
              <p className="text-lg font-bold text-orange-900">
                {new Date(pr?.required_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          {pr?.pr_date && (
            <div className="text-right">
              <p className="text-[10px] uppercase text-orange-700 font-bold tracking-tight">PR Date</p>
              <p className="text-sm font-medium text-orange-800">
                {new Date(pr?.pr_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {pr?.submitted_at && (
          <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
            <p className="text-[10px] uppercase font-bold text-blue-700 mb-1">Submitted</p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-blue-900">
                {new Date(pr?.submitted_at).toLocaleDateString()} by {pr?.submitted_by?.name}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
