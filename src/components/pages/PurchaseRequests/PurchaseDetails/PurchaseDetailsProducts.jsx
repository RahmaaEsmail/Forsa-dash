import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card'
import { Badge } from '../../../ui/badge'
import CustomTable from '../../../shared/CustomTable'
import { Info } from 'lucide-react'

export default function PurchaseDetailsProducts({ pr, getPurchaseStatusVariant }) {
  return (
    <div>
      {/* Items Table Card */}
      <Card className="shadow-md pt-0 overflow-hidden border-none ring-1 ring-slate-200">
        <CardHeader className="pt-5 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Line Items</CardTitle>
              <CardDescription>Detailed breakdown of products and fulfillment status.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white">
              {pr?.items?.length} {pr?.items?.length === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CustomTable
            className='border-0 shadow-none'
            columns={[
              {
                key: 'item_details',
                title: 'Product Information',
                render: (_, row) => (
                  <div className="py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {row?.item_name || row?.item?.name?.en || 'N/A'}
                      </p>
                      {row?.sku && (
                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-medium">
                          SKU: {row.sku}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-medium">
                        ID: {row?.item?.id || row?.id}
                      </span>
                    </div>
                    <p className="text-xs text-primary font-medium mt-1">
                      {row?.item?.name?.en || row?.item?.name} — {row?.item?.category?.name || 'Uncategorized'}
                    </p>
                    {row?.specifications && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs italic">
                        {row.specifications}
                      </p>
                    )}
                    {row?.notes && (
                      <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{row.notes}</span>
                      </p>
                    )}
                  </div>
                ),
              },
              {
                key: 'inventory_status',
                title: 'Quantity Status',
                render: (_, row) => (
                  <div className="space-y-1.5 py-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Requested:</span>
                      <span className="font-bold">
                        {row?.quantity} {row?.unit?.name?.en || row?.unit?.name || 'units'}
                      </span>
                    </div>
                    {row?.quantity_fulfilled > 0 ? (
                      <>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: `${Math.min((row?.quantity_fulfilled / row?.quantity) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-green-600 font-medium">
                            Fulfilled: {row?.quantity_fulfilled}
                          </span>
                          <span className="text-orange-600 font-medium">
                            Remaining: {row?.remaining_quantity}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground italic pt-1">
                        No fulfillment yet
                      </div>
                    )}
                    {row?.rfq_po_qty > 0 && (
                      <div className="text-[10px] text-blue-600 mt-1">
                        In RFQ/PO: {row.rfq_po_qty}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'pricing',
                title: 'Pricing (SAR)',
                render: (_, row) => (
                  <div className="text-right py-2">
                    {row?.target_price && (
                      <div className="text-xs text-muted-foreground">
                        Target: {Number(row.target_price).toLocaleString()} SAR/unit
                      </div>
                    )}
                    {row?.estimated_total && (
                      <div className="font-bold text-primary text-sm mt-1">
                        Total: {Number(row.estimated_total).toLocaleString()} SAR
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'item_status',
                title: 'Status',
                render: (_, row) => (
                  <Badge
                    className="text-[10px] uppercase font-bold"
                    variant={getPurchaseStatusVariant(row?.purchase_status)}
                  >
                    {row?.purchase_status || 'pending'}
                  </Badge>
                ),
              },
            ]}
            dataSource={pr?.items || []}
            rowKey="id"
          />
        </CardContent>
      </Card>

      {/* Item Notes Section */}
      {pr?.items?.some(item => item?.notes) && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {pr.items.map((item, idx) => (
            item?.notes && (
              <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-blue-900 uppercase">
                    Item Note: {item.item_name || item?.item?.name?.en || `Item ${idx + 1}`}
                  </p>
                  <p className="text-sm text-blue-800">{item.notes}</p>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}