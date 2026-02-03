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
  const columnsCount = 9; // ✅ نفس عدد الأعمدة في TableHead
   
  const navigate = useNavigate();

  const [openDeleteModal , setOpenDeleteModal] = useState(false);
  const [openUpdateStatusModal , setOpenUpdateStatusModal] = useState(false);
  
  const {mutate : deleteProduct , isPending ,isSuccess} = useDeleteProduct()
  const {mutate : updateStatusProduct , isPending  : isPendingStatus, isSuccess : isSuccessStatus} = useUpdateActiveStatus()

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
            <TableHead className={`${thBase} text-center`}>Status</TableHead>
            <TableHead className={`${thBase} text-left`}>Category</TableHead>
            <TableHead className={`${thBase} text-center`}>Visibility</TableHead>
            <TableHead className={`${thBase} text-left`}>Sub Category</TableHead>
            <TableHead className={`${thBase} text-center`}>SKUs</TableHead>
            <TableHead className={`${thBase} text-center`}>Currecy</TableHead>
            <TableHead className={`${thBase} text-center`}>Date Added</TableHead>
            <TableHead className={`${thBase} text-center`}>Last Updated</TableHead>
            <TableHead className={`${thBase} text-center`}>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length > 0 ? (
            data.map((prod) => (
              <TableRow key={prod?.id} className={rowBase}>
                <TableCell className={`${tdBase} text-left`}>
                 { <img
                    src={prod?.image}
                    alt={prod?.name || "product"}
                    className="w-10 h-10 rounded-md object-cover"
                  />}
                </TableCell>

                <TableCell className={`${tdBase} text-left`}>
                  <span className="font-medium">{prod?.name}</span>
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <ProductStatusBadge value={prod?.status} />
                </TableCell>

                <TableCell className={`${tdBase} text-left`}>
                  {prod?.category?.parent ?? "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  <ProductVisibilityBadge value={prod?.visibility} />
                </TableCell>

                <TableCell className={`${tdBase} text-left`}>
                  {prod?.category?.name ?? "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {prod?.model ?? "---"}
                </TableCell>

                 <TableCell className={`${tdBase} text-center`}>
                  {prod?.currency ?? "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {dayjs(prod?.created_at).format('YYYY-MM-DD HH:mm:ss') ?? "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                  {dayjs(prod?.updated_at).format('YYYY-MM-DD HH:mm:ss') ?? "---"}
                </TableCell>

                <TableCell className={`${tdBase} text-center`}>
                 <div className="flex gap-1 items-center">
                  <Button 
                  onClick={() => navigate(`/add_product?id=${prod?.id}`)}
                  title="Edit Product" variant="ghost" size="icon">
                    <Edit />
                  </Button>

                  <Button 
                  onClick={() => setOpenDeleteModal(prod)}
                  title="Delete Product"  variant="ghost" size="icon">
                    <Trash />
                  </Button>

                  <Button
                  onClick={() => setOpenUpdateStatusModal(prod)}
                  title="Hide Product" variant="ghost" size="icon">
                    <Eye />
                  </Button>

                  <Button title="Product Details" variant="ghost" size="icon">
                    <Fullscreen />
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
                  // actionLabel="Add new product"
                  // onAction={() => navigate("/add_product")}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteModal isSuccess={isSuccess} isLoading={isPending} onDelete={handleDeleteProduct} open={openDeleteModal} setOpen={setOpenDeleteModal} title={`This is a  product #${openDeleteModal?.name}?`} desc={"Are you sure you want to delete this item? This action cannot be undone."}/>
      <ActiveInActiveStatusModal isSuccess={isSuccessStatus} isLoading={isPendingStatus} onSuccess={handleUpdateStatus} open={openUpdateStatusModal} setOpen={setOpenUpdateStatusModal} title={`This is a  product #${openUpdateStatusModal?.name}?`}/>
    </div>
  );
}
