import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Clock } from 'lucide-react'

export default function PurchaseDetailsTimeline({ pr }) {
  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">PR Date:</span>
          <span className="font-medium">{new Date(pr.pr_date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Submitted:</span>
          <span className="font-medium">
            {pr.submitted_at ? new Date(pr.submitted_at).toLocaleDateString() : 'Not submitted'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Required:</span>
          <span className="font-medium text-orange-600">
            {new Date(pr.required_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Last Updated:</span>
          <span className="font-medium">{new Date(pr.updated_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
