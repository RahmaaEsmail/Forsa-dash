import React, { useState } from 'react'
import CustomTable from '../../shared/CustomTable'
import { Button } from '../../ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import SearchableAsyncSelect from '../../shared/SearchableAsyncSelect'
import { handleGetAllProducts } from '../../../services/products'
import { handleGetAllUnits } from '../../../services/units'
import CreateProductModal from './CreateProductModal'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'

export default function PurchaseProducts() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const handleCreateProduct = (searchValue, index) => {
    setNewProductName(searchValue);
    setActiveItemIndex(index);
    setIsProductModalOpen(true);
  };

  const columns = [
    {
      title: "Product",
      className: "w-[250px]",
      render: (_, __, index) => (
        <div className="min-w-[200px] text-left">
          <SearchableAsyncSelect
            control={control}
            name={`items.${index}.item_id`}
            placeholder="Search product..."
            fetchFn={handleGetAllProducts}
            queryKeyPrefix="products"
            // onCreateNew={(search) => handleCreateProduct(search, index)}
            // createLabel="Create New Product"
          />
        </div>
      )
    },
    {
      title: "Description / Specs",
      render: (_, __, index) => (
        <div className="min-w-[150px]">
          <Input 
            {...register(`items.${index}.specifications`)} 
            placeholder="Specs" 
             className="bg-input-bg border-none min-h-[50px] rounded-md"
          />
        </div>
      )
    },
    {
      title: "Qty",
      width: "100px",
      render: (_, __, index) => (
        <div className="min-w-[80px]">
          <Input 
            type="number" 
            {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
            className="bg-input-bg border-none min-h-[50px] rounded-md text-center"
          />
        </div>
      )
    },
    {
      title: "UoM",
      width: "150px",
      render: (_, __, index) => (
        <div className="min-w-[150px] text-left">
          <SearchableAsyncSelect
            control={control}
            name={`items.${index}.unit_id`}
            placeholder="Unit"
            fetchFn={handleGetAllUnits}
            queryKeyPrefix="units"
          />
        </div>
      )
    },
    {
      title: "Target Price",
      width: "120px",
      render: (_, __, index) => (
        <div className="min-w-[100px]">
          <Input 
            type="number" 
            {...register(`items.${index}.target_price`, { valueAsNumber: true })} 
            className="bg-input-bg border-none min-h-[50px] rounded-md text-center"
            placeholder="Price"
          />
        </div>
      )
    },
    {
      title: "Notes",
      render: (_, __, index) => (
        <div className="min-w-[150px]">
           <Input 
            {...register(`items.${index}.notes`)} 
            placeholder="Notes" 
            className="bg-input-bg border-none min-h-[50px] rounded-md"
          />
        </div>
      )
    },
    {
      title: "",
      width: "50px",
      render: (_, __, index) => (
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => remove(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )
    }
  ]

  return (
    <div className='flex flex-col gap-4'>
      <CustomTable 
        columns={columns}
        dataSource={fields}
        rowKey="id"
        className='border-0 border-none p-0'
        emptyProps={{
           title: "No Products Added",
           description: "Click the add button below to insert new product lines."
        }}
      />

      <div className='px-10 pb-5 pt-2'>
        <Button 
          type="button"
          variant='default' 
          className="ms-auto flex items-center justify-center gap-2"
          onClick={() => append({ 
            item_id: "", 
            quantity: 1, 
            unit_id: "", 
            target_price: "", 
            specifications: "", 
            notes: "" 
          })}
        >
          <Plus className="w-4 h-4" />
          <span>Add Product Line</span>
        </Button>
      </div>

      <CreateProductModal 
        open={isProductModalOpen} 
        onOpenChange={setIsProductModalOpen}
        initialName={newProductName}
      />
    </div>
  )
}
