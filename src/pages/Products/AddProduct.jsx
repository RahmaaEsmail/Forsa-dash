import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import AddProductTabs from '../../components/pages/Products/AddProduct/AddProductTabs';
import useProductDetails from '../../hooks/products/useProductDetails';
import Loading from '../../components/shared/Loading';
import ActivityLog from '../../layout/ActivityLog/ActivityLog';

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [showLog, setShowLog] = useState(false);

  const { mutate, data, isPending } = useProductDetails();

  useEffect(() => {
    if (id) {
      mutate({ id });
    }
  }, [id]);

  return (
    isPending ? <Loading /> :
    <div className="flex h-full min-h-screen">
      <div className="flex-1 flex flex-col gap-10 pb-6 overflow-y-auto">
        <PageHeader
          title={id ? `Edit Product #${data?.data?.name?.en}` : "Add new Product"}
          subTitle={"Create a new building material item, define its category, pricing, and procurement details."}
        >
          <div className="flex gap-2 items-center">
            {id && (
              <Button
                variant="outline"
                className={`h-10 px-4 gap-2 font-bold ${showLog ? 'bg-primary/10 border-primary text-primary' : 'border-slate-300 text-slate-600'}`}
                onClick={() => setShowLog(v => !v)}
                title="Activity Log"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => navigate(`/products`)}
              className={"px-3!"}>
              <ArrowLeft />
              <span>Back to Product Catalog</span>
            </Button>
          </div>
        </PageHeader>

        <div>
          <AddProductTabs />
        </div>
      </div>

      {id && showLog && (
        <ActivityLog
          modelType="product"
          modelId={id}
          onClose={() => setShowLog(false)}
        />
      )}
    </div>
  )
}
