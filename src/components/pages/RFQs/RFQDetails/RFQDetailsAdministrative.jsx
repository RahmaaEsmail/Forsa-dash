import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, ShieldCheck, FileCheck, Hash } from 'lucide-react';

export default function RFQDetailsAdministrative({ rfq }) {
  const admin = rfq?.procurement_user;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Administrative
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between items-center group">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-100 p-1.5 rounded group-hover:bg-primary/10 transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Procurement Officer</span>
          </div>
          <span className="text-xs font-bold text-slate-900">{admin?.name || 'Unassigned'}</span>
        </div>

        <div className="flex justify-between items-center group">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-100 p-1.5 rounded group-hover:bg-primary/10 transition-colors">
              <Hash className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary" />
            </div>
            <span className="text-xs text-slate-500 font-medium">System ID</span>
          </div>
          <span className="text-xs font-bold text-slate-900">#{rfq.id}</span>
        </div>

        <div className="flex justify-between items-center group">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-100 p-1.5 rounded group-hover:bg-primary/10 transition-colors">
              <FileCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Reference</span>
          </div>
          <span className="text-xs font-bold text-slate-900">{rfq.supplier_reference || 'None'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
