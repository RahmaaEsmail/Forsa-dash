import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { product_data } from "../../../../utils/productsData";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductVisibilityBadge from "./ProductVisibilityBadge";
import CustomEmptyData from "../../../shared/CustomEmptyData";
import { Edit, Eye, Fullscreen, PackageSearch, Trash } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "../../../ui/button";
import { DeleteModal } from "../../../shared/DeleteModal";
import useDeleteProduct from "../../../../hooks/products/useDeleteProduct";
import useUpdateActiveStatus from "../../../../hooks/products/useUpdateActiveStatus";
import { ActiveInActiveStatusModal } from "../../../shared/ActiveInActiveStatusModal";
import { useNavigate } from "react-router-dom";

const thBase =
  "p-6 text-center! text-base font-bold! text-secondary! whitespace-nowrap";
const tdBase =
  "p-6 text-base! text-center! font-normal text-placeholder! whitespace-nowrap";
const rowBase =
  "border-b !p-5 border-border/60 last:border-b-0 hover:bg-black/[0.02]";

export default function ProductTable({ data = product_data }) {

  console.log("data", data);
  const columnsCount = 16; // ✅ تحديث عدد الأعمدة

  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);

  const { mutate: deleteProduct, isPending, isSuccess } = useDeleteProduct()
  const { mutate: updateStatusProduct, isPending: isPendingStatus, isSuccess: isSuccessStatus } = useUpdateActiveStatus()

  function handleDeleteProduct() {
    deleteProduct(openDeleteModal?.id);
  }

  function handleUpdateStatus() {
    updateStatusProduct();
  }

  return (
    <div className="bg-white px-5! rounded-main overflow-hidden border border-border/60">
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow className="border-b border-border/60">
            <TableHead className={`${thBase} text-left`}>Product Image</TableHead>
            <TableHead className={`${thBase} text-left`}>Product Name</TableHead>
            <TableHead className={`${thBase} text-left`}>Product Description</TableHead>
            <TableHead className={`${thBase} text-center`}>Status</TableHead>
            <TableHead className={`${thBase} text-left`}>Category</TableHead>
            <TableHead className={`${thBase} text-center`}>Visibility</TableHead>
            <TableHead className={`${thBase} text-left`}>Sub Category</TableHead>
            <TableHead className={`${thBase} text-center`}>Brand</TableHead>
            <TableHead className={`${thBase} text-center`}>Model</TableHead>
            <TableHead className={`${thBase} text-center`}>Currency</TableHead>
            <TableHead className={`${thBase} text-center`}>Cost Price</TableHead>
            <TableHead className={`${thBase} text-center`}>Selling Price</TableHead>
            <TableHead className={`${thBase} text-center`}>Units</TableHead>
            <TableHead className={`${thBase} text-center`}>Date Added</TableHead>
            <TableHead className={`${thBase} text-center`}>Last Updated</TableHead>
            <TableHead className={`${thBase} text-center`}>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length > 0 ? (
            data?.map((prod) => (
              <TableRow key={prod?.id} className={rowBase}>
                <TableCell className={`${tdBase} text-left`}>
                  <img
                    onError={(e) => e.currentTarget.src = "/images/imageplaceholder.png"}
                    src={prod?.image || '/images/imageplaceholder.png'}
                    alt={prod?.name?.en || "product"}
                    className="w-24 h-24 rounded-md object-cover"
                  />
                </TableCell>

                <TableCell className={`${tdBase} text-left`}>
                  <div className="flex flex-col">
                    <span className="font-medium">{prod?.name?.en}</span>
                    <span className="text-sm text-gray-500">{prod?.name?.ar}</span>
                  </div>
                </TableCell>

                <TableCell className={`${tdBase} text-left w-37.5`}>
                  <div className="flex flex-col">
                    <span className="font-medium truncate">{prod?.description}</span>
                  </div>
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <ProductStatusBadge value={prod?.status} />
                </TableCell>

                <TableCell className={`${tdBase} text-left`}>
                  {prod?.category?.parent?.name || "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <ProductVisibilityBadge value={prod?.is_active ? "Active" : "Inactive"} />
                </TableCell>

                <TableCell className={`${tdBase} text-left`}>
                  {prod?.category?.name || "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {prod?.brand || "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {prod?.model || "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {prod?.currency || "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <span className="font-medium text-green-600">
                    {prod?.cost_price ? `${prod.currency} ${parseFloat(prod.cost_price).toFixed(2)}` : "---"}
                  </span>
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <span className="font-medium text-blue-600">
                    {prod?.selling_price ? `${prod.currency} ${parseFloat(prod.selling_price).toFixed(2)}` : "---"}
                  </span>
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {prod?.units?.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {prod.units.map((unit, index) => (
                        <span key={unit.id} className="text-sm">
                          {unit.name?.en}-{unit?.name?.ar}
                          {index < prod.units.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  ) : "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {dayjs(prod?.created_at).format('YYYY-MM-DD HH:mm')}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {dayjs(prod?.updated_at).format('YYYY-MM-DD HH:mm')}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <div className="flex gap-1 items-center justify-center">
                    <Button
                      onClick={() => navigate(`/add_product?id=${prod?.id}`)}
                      title="Edit Product" 
                      variant="ghost" 
                      size="icon"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => setOpenDeleteModal(prod)}
                      title="Delete Product" 
                      variant="ghost" 
                      size="icon"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => setOpenUpdateStatusModal(prod)}
                      title="Toggle Status" 
                      variant="ghost" 
                      size="icon"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button 
                      onClick={() => navigate(`/product-details/${prod?.id}`)}
                      title="Product Details" 
                      variant="ghost" 
                      size="icon"
                    >
                      <Fullscreen className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b-0 w-full">
              <TableCell colSpan={columnsCount} className="p-6">
                <CustomEmptyData
                  title="No Products Found"
                  description="Try changing filters or add a new product."
                  icon={PackageSearch}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteModal 
        isSuccess={isSuccess} 
        isLoading={isPending} 
        onDelete={handleDeleteProduct} 
        open={openDeleteModal} 
        setOpen={setOpenDeleteModal} 
        title={`Delete product #${openDeleteModal?.name?.en || openDeleteModal?.name}?`} 
        desc={"Are you sure you want to delete this item? This action cannot be undone."} 
      />
      
      <ActiveInActiveStatusModal 
        isSuccess={isSuccessStatus} 
        isLoading={isPendingStatus} 
        onSuccess={handleUpdateStatus} 
        open={openUpdateStatusModal} 
        setOpen={setOpenUpdateStatusModal} 
        title={`Change status for product #${openUpdateStatusModal?.name?.en || openUpdateStatusModal?.name?.ar}?`} 
      />
    </div>
  );
}