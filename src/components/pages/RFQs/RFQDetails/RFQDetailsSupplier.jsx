import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, MapPin, User } from 'lucide-react';

export default function RFQDetailsSupplier({ rfq }) {
  const supplier = rfq?.supplier;
  
  if (!supplier) return null;

  return (
    <Card className="border-none shadow-sm bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Supplier Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-md shadow-xs">
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Company Name</p>
            <p className="text-sm font-medium text-slate-900">{supplier.company_name || 'N/A'}</p>
            {supplier.vat_number && (
              <p className="text-xs text-slate-400 mt-1">VAT: {supplier.vat_number}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-xs">
              <Mail className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">{supplier.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-xs">
              <Phone className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mobile</p>
              <p className="text-sm font-medium text-slate-900">{supplier.mobile || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
