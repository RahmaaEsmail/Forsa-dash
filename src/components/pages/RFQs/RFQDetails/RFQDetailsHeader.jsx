import React from 'react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { FileText, Calendar } from 'lucide-react';

export default function RFQDetailsHeader({ rfq, getStatusIcon, getStatusVariant }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {rfq.rfq_number}
            <Badge variant={getStatusVariant(rfq.status)} className="capitalize gap-1.5 ml-2">
              {getStatusIcon(rfq.status)}
              {rfq.status?.replace('_', ' ')}
            </Badge>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Created from <span className="font-medium text-primary">#{rfq.purchase_request?.pr_number}</span>
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>RFQ Date: <span className="text-slate-900 font-medium">{rfq.rfq_date ? format(new Date(rfq.rfq_date), 'MMM dd, yyyy') : 'N/A'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-400" />
          <span>Required Date: <span className="text-slate-900 font-medium">{rfq.required_date ? format(new Date(rfq.required_date), 'MMM dd, yyyy') : 'N/A'}</span></span>
        </div>
      </div>
    </div>
  );
}
