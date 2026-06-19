import { api, extractError } from "./client"
import type {
  CustomerAccountData,
  PartnerAccountData,
  PartnerBusinessData,
} from "@/lib/types"

export { useCategories, fetchCategories } from "./swr"

export async function registerCustomer(
  data: CustomerAccountData
): Promise<{ success: boolean; userId: string }> {
  try {
    return await api
      .url("/customer/register")
      .post({ account: data })
      .json()
  } catch (error) {
    throw await extractError(error)
  }
}

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
