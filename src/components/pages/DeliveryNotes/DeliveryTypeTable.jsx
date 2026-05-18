import React, { useState } from 'react'
import CustomTable from "../../shared/CustomTable"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { useDeleteDeliveryType } from '../../../hooks/delivery-notes/useDeliveryTypeMutations'
import DeliveryTypeModal from './DeliveryTypeModal'

export default function DeliveryTypeTable({ data, isLoading }) {
  const [editingType, setEditingType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteMutation = useDeleteDeliveryType();

  const handleEdit = (type) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this delivery type?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      title: "Order",
      width: "80px",
      render: (_, record) => <span className="font-bold text-slate-400">{record.order}</span>
    },
    {
      title: "Name",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{record.name?.en}</span>
          <span className="text-xs text-slate-500 font-medium" dir="rtl">{record.name?.ar}</span>
        </div>
      )
    },
    {
      title: "Code",
      render: (_, record) => (
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-mono">
          {record.code}
        </Badge>
      )
    },
    {
      title: "Description",
      className: "max-w-[300px]",
      render: (_, record) => (
        <p className="text-sm text-slate-500 line-clamp-2">{record.description?.en || "No description"}</p>
      )
    },
    {
      title: "Status",
      render: (_, record) => (
        <Badge className={record.is_active ? "bg-emerald-500 text-white border-none" : "bg-slate-300 text-white border-none"}>
          {record.is_active ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      title: "Actions",
      className: "text-right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEdit(record)}
            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDelete(record.id)}
            className="h-8 w-8 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <CustomTable 
        columns={columns}
        dataSource={data}
        isLoading={isLoading}
        rowKey="id"
        className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
        headerClassName="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b"
        rowClassName="border-b last:border-b-0 hover:bg-slate-50/50 transition-colors"
      />

      <DeliveryTypeModal 
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingType(null);
        }}
        editingType={editingType}
      />
    </>
  )
}
