import React, { useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { useParams } from 'react-router-dom';
import useProductDetails from '../../hooks/products/useProductDetails';
import Loading from '../../components/shared/Loading';

export default function ProductDetails() {
  const { id } = useParams();
  const { mutate: handleGetProductDetails, data, isPending } = useProductDetails();
  
  // Extracting the product object for easier access
  const product = data?.data;

  useEffect(() => {
    if (id) handleGetProductDetails({ id });
  }, [id]);

  if (isPending) return <Loading />;
  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="flex pb-6 flex-col gap-6 p-4">
      <PageHeader
        title={`Product: ${product.name.en}`}
        subTitle={`Model: ${product.model} | Brand: ${product.brand}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-6 rounded-xl shadow-sm">
        {/* Left: Product Image */}
        <div className="flex flex-col gap-4">
          <img 
            src={product.image} 
            alt={product.name.en} 
            className="w-full h-auto rounded-lg border object-cover"
          />
          <div className="flex gap-2">
            {product.attachments?.map((file, index) => (
              <a 
                key={index} 
                href={file} 
                target="_blank" 
                className="text-xs bg-blue-50 text-blue-600 p-2 rounded hover:underline"
              >
                Attachment {index + 1} (PDF)
              </a>
            ))}
          </div>
        </div>

        {/* Middle: Details & Pricing */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">{product.name.en}</h2>
            <p className="text-gray-500">Category: {product.category.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Selling Price</p>
              <p className="text-xl font-bold text-green-600">
                {product.selling_price} {product.currency}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Cost Price</p>
              <p className="text-xl font-semibold text-gray-700">
                {product.cost_price} {product.currency}
              </p>
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="grid grid-cols-3 gap-4 border-t pt-6">
            <div>
              <p className="text-sm text-gray-500">Stock Status</p>
              <span className={`px-2 py-1 rounded text-xs ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Min Stock</p>
              <p className="font-medium">{product.minimum_stock}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Stock</p>
              <p className="font-medium">{product.max_stock}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Available Units</p>
            <div className="flex gap-2">
              {product.units.map((unit) => (
                <span key={unit.id} className="border px-3 py-1 rounded-full text-sm">
                  {unit.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}