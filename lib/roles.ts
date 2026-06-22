export const ROLE_CUSTOMER = "ROLE_CUSTOMER" as const
export const ROLE_PARTNER = "ROLE_PARTNER" as const

export type Role = typeof ROLE_CUSTOMER | typeof ROLE_PARTNER

export function isRole(value: unknown): value is Role {
  return value === ROLE_CUSTOMER || value === ROLE_PARTNER
}
