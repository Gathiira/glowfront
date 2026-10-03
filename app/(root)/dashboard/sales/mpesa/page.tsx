"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { MpesaPaymentsPanel } from "@/components/dashboard/mpesa-payments-panel"

export default function MpesaPayments() {
  return (
    <div>
      <PageHeader
        title="M-Pesa payments"
        description="Every payment to your till. Attach unclaimed ones to the sale they paid for; unclaim one that was attached to the wrong sale."
      />
      <Card>
        <CardContent className="pt-6">
          <MpesaPaymentsPanel />
        </CardContent>
      </Card>
    </div>
  )
}
