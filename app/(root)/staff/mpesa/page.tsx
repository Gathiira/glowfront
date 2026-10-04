import { redirect } from "next/navigation"

/** M-Pesa payments now sit on the Sale page. */
export default function MpesaPayments() {
  return redirect("/staff/sale")
}
