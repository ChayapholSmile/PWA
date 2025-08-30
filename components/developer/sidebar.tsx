"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Plus, BarChart3, FileText, Settings, ArrowLeft } from "lucide-react"

const navigation = [
  {
    name: "แดชบอร์ด",
    href: "/developer",
    icon: LayoutDashboard,
  },
  {
    name: "แอปของฉัน",
    href: "/developer/apps",
    icon: Package,
  },
  {
    name: "เพิ่มแอปใหม่",
    href: "/developer/apps/new",
    icon: Plus,
  },
  {
    name: "สถิติ",
    href: "/developer/analytics",
    icon: BarChart3,
  },
  {
    name: "Changelog",
    href: "/developer/changelogs",
    icon: FileText,
  },
  {
    name: "ตั้งค่า",
    href: "/developer/settings",
    icon: Settings,
  },
]

export function DeveloperSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">DEV</span>
        </div>
        <span className="font-bold text-lg">Developer Portal</span>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับสู่ App Store
          </Link>
        </Button>
      </div>
    </div>
  )
}
