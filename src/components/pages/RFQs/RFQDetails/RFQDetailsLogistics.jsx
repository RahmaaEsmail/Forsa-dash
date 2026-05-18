import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Truck, Globe, Clock } from 'lucide-react';

export default function RFQDetailsLogistics({ rfq }) {
  return (
    <Card className="border-none shadow-sm bg-slate-50/50 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          Logistics & Delivery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-md shadow-xs">
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Delivery Address</p>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              {rfq.delivery_address || rfq.purchase_request?.delivery_address || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-xs">
              <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Delivery Type</p>
              <p className="text-sm font-medium text-slate-900 capitalize">{rfq.delivery_type || 'Standard'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-xs">
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lead Time</p>
              <p className="text-sm font-medium text-slate-900">7-10 Days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
