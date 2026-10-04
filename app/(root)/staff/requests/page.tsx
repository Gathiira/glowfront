import { redirect } from "next/navigation"

/** Requests now sit under the Services tab. */
export default function Requests() {
  return redirect("/staff/services?view=requests")
}
