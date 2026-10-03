import { Barlow, Barlow_Condensed } from "next/font/google"

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" })
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
})

/** Font variable classes for the staff portal; also applied to portalled dialogs, which render outside the layout. */
export const staffFonts = `${barlow.variable} ${barlowCondensed.variable}`
