import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function RFQDetailsCustomer({ rfq }) {
  const customer = rfq?.customer;
  
  if (!customer) return null;

  return (
    <Card className="border-none shadow-sm bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-md shadow-xs">
            {customer.customer_type === 'company' ? <Building2 className="w-4 h-4 text-slate-400" /> : <User className="w-4 h-4 text-slate-400" />}
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Name</p>
            <p className="text-sm font-medium text-slate-900">{customer.company_name || customer.name || 'N/A'}</p>
            <p className="text-xs text-slate-400 mt-1 capitalize">{customer.customer_type}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-xs">
              <Mail className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">{customer.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-xs">
              <Phone className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mobile</p>
              <p className="text-sm font-medium text-slate-900">{customer.mobile || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
