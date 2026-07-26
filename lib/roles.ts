export const ROLE_CUSTOMER = "ROLE_CUSTOMER" as const
export const ROLE_PARTNER = "ROLE_PARTNER" as const
export const ROLE_ADMIN = "ROLE_ADMIN" as const

export type Role = typeof ROLE_CUSTOMER | typeof ROLE_PARTNER | typeof ROLE_ADMIN
