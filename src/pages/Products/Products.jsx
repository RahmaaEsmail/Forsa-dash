import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Download, Plus } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import ProductTable from "../../components/pages/Products/ProductTable/ProductTable";
import ProductFilterations from "../../components/pages/Products/ProductFilterations/ProductFilterations";
import Pagination from "../../components/shared/Pagination";
import { useNavigate } from "react-router-dom";
import useGetProducts from "../../hooks/products/useGetProducts";
import Loading from "../../components/shared/Loading";
import { exportToExcel } from "../../utils/exportToExcel";

const PRODUCT_COL_MAP = {
  id:            '#',
  'name.en':     'Name (EN)',
  'name.ar':     'Name (AR)',
  model:         'Model',
  brand:         'Brand',
  selling_price: 'Selling Price',
  cost_price:    'Cost Price',
  currency:      'Currency',
  status:        'Status',
  minimum_stock: 'Min Stock',
  max_stock:     'Max Stock',
  'category.name': 'Category',
};

export default function Products() {
  const [filters, setFilters] = useState({
    category: "",
    name: "",
    visibility: "",
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const navigate = useNavigate();

  const { data, isLoading } = useGetProducts({
    page,
    per_page: perPage,
    visibility: filters?.visibility || undefined,
    category_id: filters?.category || undefined,
    search: filters?.name || undefined,
  });

  const handlePageChange = useCallback((pageNum) => {
    setPage(pageNum);
  }, []);

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={"Products Catalog"}
        subTitle={
          "Manage all building material products, control visibility, and keep catalog data up to date."
        }
      >
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="border-primary text-primary font-bold hover:bg-primary/5 gap-2"
            onClick={() => exportToExcel(data?.data || [], 'products', PRODUCT_COL_MAP)}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button onClick={() => navigate(`/add_product`)} className={"px-3!"}>
            <Plus />
            <span>Add new product</span>
          </Button>
        </div>
      </PageHeader>

      <ProductFilterations setFilter={setFilters} filter={filters} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ProductTable data={data?.data || []} />
          <Pagination
            total={data?.meta?.total ?? data?.data?.length ?? 0}
            page={page}
            per_page={perPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
