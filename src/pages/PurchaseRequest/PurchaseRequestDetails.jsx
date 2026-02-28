import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  User,
  Building2,
  FileText,
  Phone,
  Mail,
  Info,
  Globe,
  Building2Icon,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import usePurchaseDetails from '../../hooks/purchaseRequest/usePurchaseDetails';
import CustomTable from '../../components/shared/CustomTable';

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Loading from '../../components/shared/Loading';
import PurchaseDetailsHeader from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsHeader';
import PurchaseDetailsStatus from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsStatus';
import PurchaseDetailsProducts from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsProducts';
import PurchaseDetailsCustomer from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsCustomer';
import PurchaseDetailsLogistics from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsLogistics';
import PurchaseDetailsAdministrative from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsAdministrative';
import PurchaseDetailsStats from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsStats';
import PurchaseDetailsTimeline from '../../components/pages/PurchaseRequests/PurchaseDetails/PurchaseDetailsTimeline';

export default function PurchaseRequestDetails() {
  const { id } = useParams();
  const { mutate, data, isPending } = usePurchaseDetails();
  const pr = data?.data;

  useEffect(() => {
    if (id) mutate({ id });
  }, [id, mutate]);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'outline';
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'draft': return <FileText className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getPurchaseStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'outline';
      case 'partially_fulfilled': return 'warning';
      case 'fulfilled': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (isPending) return <Loading />;

  if (!pr) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
      <Info className="w-12 h-12 mb-2 opacity-20" />
      <p>Purchase request not found.</p>
    </div>
  );

  const totalEstimatedAmount = pr.items?.reduce((acc, curr) => acc + (curr.estimated_total || 0), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Card className="p-6 space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <PurchaseDetailsHeader
          getStatusIcon={getStatusIcon}
          getStatusVariant={getPurchaseStatusVariant}
          pr={pr}
        />

        <PurchaseDetailsStatus pr={pr} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Card */}
              <PurchaseDetailsCustomer pr={pr} />
              {/* Logistics Card */}
              <PurchaseDetailsLogistics pr={pr} />
            </div>
            <PurchaseDetailsProducts pr={pr} getPurchaseStatusVariant={getPurchaseStatusVariant} />
          </div>

          {/* Right Column: Metadata (1/3 width) */}
          <div className="space-y-6">
            {/* Administrative Info Card */}
            <PurchaseDetailsAdministrative pr={pr} />

            {/* Stats/Quick View */}
            <PurchaseDetailsStats totalEstimatedAmount={totalEstimatedAmount} pr={pr} />

            {/* Timeline Card */}
            <PurchaseDetailsTimeline pr={pr} />
          </div>
        </div>
      </Card>
    </div>
  );
}