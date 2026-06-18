import { api, extractError } from "./client"
import type {
  PartnerAccountData,
  PartnerBusinessData,
} from "@/lib/types"

export { useCategories, fetchCategories } from "./swr"

export async function registerPartner(
  accountData: PartnerAccountData,
  businessData: PartnerBusinessData
): Promise<{ success: boolean; userId: string }> {
  try {
      return await api
      .url("/partner/register")
      .post({ account: accountData, business: businessData })
      .json()
  } catch (error) {
    throw await extractError(error)
  }
}
