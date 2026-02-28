import { CheckCircle2, XCircle, Clock, FileText, AlertCircle, Ban, UserCheck, UserX } from 'lucide-react';
import React from 'react';

export default function PurchaseDetailsStatus({ pr }) {
  
  // Helper function to get status config
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
          lightTextColor: 'text-green-600',
          title: 'Request Approved'
        };
      case 'rejected':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          lightTextColor: 'text-red-600',
          title: 'Request Rejected'
        };
      case 'cancelled':
        return {
          icon: Ban,
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          iconColor: 'text-slate-500',
          titleColor: 'text-slate-800',
          textColor: 'text-slate-700',
          lightTextColor: 'text-slate-600',
          title: 'Request Cancelled'
        };
      case 'draft':
        return {
          icon: FileText,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          lightTextColor: 'text-blue-600',
          title: 'Draft Request'
        };
      case 'pending':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          lightTextColor: 'text-yellow-600',
          title: 'Pending Approval'
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
          titleColor: 'text-gray-800',
          textColor: 'text-gray-700',
          lightTextColor: 'text-gray-600',
          title: 'Request Status'
        };
    }
  };

  const config = getStatusConfig(pr?.status);
  const StatusIcon = config.icon;

  // Don't show banner for pending and draft status (they might have their own UI elsewhere)
  if (pr?.status?.toLowerCase() === 'pending' || pr?.status?.toLowerCase() === 'draft') {
    return null;
  }

  return (
    <div>
      {/* Status Banner - Show for all non-pending/non-draft statuses */}
      {(pr?.status === 'rejected' || pr?.status === 'approved' || pr?.status === 'cancelled') && (
        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3`}>
          <StatusIcon className={`w-5 h-5 ${config.iconColor} mt-0.5 shrink-0`} />
          <div className="flex-1">
            <h4 className={`font-semibold ${config.titleColor} text-sm flex items-center gap-2`}>
              {config.title}
              <Badge variant="outline" className={`${config.lightTextColor} border-current text-[10px] uppercase`}>
                {pr?.status}
              </Badge>
            </h4>
            
            {/* Rejection Reason */}
            {pr?.status === 'rejected' && pr?.rejection_reason && (
              <div className="mt-2">
                <p className={`text-sm ${config.textColor}`}>{pr.rejection_reason}</p>
                {pr?.rejected_by && (
                  <div className="flex items-center gap-2 mt-2">
                    <UserX className={`w-3.5 h-3.5 ${config.lightTextColor}`} />
                    <p className={`text-xs ${config.lightTextColor}`}>
                      Rejected by: {pr.rejected_by.name || pr.rejected_by.email || pr.rejected_by}
                      {pr.rejected_by.email && pr.rejected_by.name && ` (${pr.rejected_by.email})`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Approval Details */}
            {pr?.status === 'approved' && pr?.approved_by && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <UserCheck className={`w-3.5 h-3.5 ${config.lightTextColor}`} />
                  <p className={`text-xs ${config.lightTextColor}`}>
                    Approved by: {pr.approved_by.name || pr.approved_by.email || pr.approved_by}
                    {pr.approved_by.email && pr.approved_by.name && ` (${pr.approved_by.email})`}
                  </p>
                </div>
                {pr.approved_at && (
                  <p className={`text-xs ${config.lightTextColor} mt-1`}>
                    Approved on: {new Date(pr.approved_at).toLocaleDateString()} at {new Date(pr.approved_at).toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}

            {/* Cancellation Details */}
            {pr?.status === 'cancelled' && pr?.cancellation_reason && (
              <div className="mt-2">
                <p className={`text-sm ${config.textColor}`}>{pr.cancellation_reason}</p>
                {pr?.cancelled_by && (
                  <p className={`text-xs ${config.lightTextColor} mt-2`}>
                    Cancelled by: {pr.cancelled_by.name || pr.cancelled_by.email || pr.cancelled_by}
                  </p>
                )}
              </div>
            )}

            {/* Additional Metadata */}
            {(pr?.status === 'approved' || pr?.status === 'rejected') && pr?.reviewed_at && (
              <p className={`text-xs ${config.lightTextColor} mt-2`}>
                Reviewed on: {new Date(pr.reviewed_at).toLocaleDateString()} at {new Date(pr.reviewed_at).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Warning Banner for Expired/Overdue */}
      {pr?.status?.toLowerCase() === 'approved' && pr?.expected_delivery_date && 
       new Date(pr.expected_delivery_date) < new Date() && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3 mt-4">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-orange-800 text-sm">Delivery Overdue</h4>
            <p className="text-sm text-orange-700 mt-1">
              Expected delivery date was {new Date(pr.expected_delivery_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}