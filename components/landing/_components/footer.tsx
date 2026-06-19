import Link from "next/link"
import { ExternalLink, MessageCircle, Share2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="mt-8 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-sm font-semibold">Get the app</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="#">About Glowbuddy</Link></li>
              <li><Link href="#">Help and support</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">For business</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="/business">For partners</Link></li>
              <li><Link href="/business#pricing">Pricing</Link></li>
              <li><Link href="#">Support</Link></li>
              <li><Link href="#">Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of service</Link></li>
              <li><Link href="#">Terms of use</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Find us on social</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><MessageCircle className="size-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Share2 className="size-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><ExternalLink className="size-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Globe className="size-4" /></Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="size-3.5" />
            <span>English (US)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Glowbuddy.com SV Ltd
          </p>
        </div>
      </div>
    </footer>
  )
}
