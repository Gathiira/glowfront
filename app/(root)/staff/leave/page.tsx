import { redirect } from "next/navigation"

/** Leave now lives under Services → Requests, with advances. */
export default function Leave() {
  return redirect("/staff/services?view=requests")
}
