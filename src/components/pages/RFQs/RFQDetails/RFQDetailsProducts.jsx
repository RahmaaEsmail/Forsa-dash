import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RFQDetailsProducts({ rfq }) {
  const items = rfq?.items || [];

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Requested Products
          <Badge variant="secondary" className="ml-2 font-normal">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow>
                <TableHead className="font-bold text-slate-700">Product</TableHead>
                <TableHead className="font-bold text-slate-700">Quantity</TableHead>
                <TableHead className="font-bold text-slate-700">UoM</TableHead>
                <TableHead className="font-bold text-slate-700">Target Price</TableHead>
                <TableHead className="font-bold text-slate-700">Unit Price</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-slate-900">{item.item_name}</div>
                    {item.specifications && (
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {item.specifications}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {Number(item.quantity).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal border-slate-200">
                      {item.unit?.name || 'unit'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {item.target_price ? `${Number(item.target_price).toLocaleString()} ${rfq.currency?.code || 'SAR'}` : '—'}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {item.unit_price ? `${Number(item.unit_price).toLocaleString()} ${rfq.currency?.code || 'SAR'}` : 'Pending'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    {item.line_total ? `${Number(item.line_total).toLocaleString()} ${rfq.currency?.code || 'SAR'}` : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                    No products found in this request.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
