"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Activity,
  Settings,
  LogOut,
  Radio,
  BarChart3,
  Cpu,
  Globe,
  FileText,
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "CHRONOS Organisms", href: "/dashboard/quantum", icon: Cpu },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Queue", href: "/dashboard/queue", icon: Activity },
  { name: "Monitoring", href: "/dashboard/monitoring", icon: BarChart3 },
  { name: "Community", href: "/community", icon: Globe },
  { name: "Research Papers", href: "/papers", icon: FileText },
  { name: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout, hasRole } = useAuth()

  const filteredNav = navigation.filter((item) => !item.adminOnly || hasRole(["admin"]))

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground font-mono font-bold text-sm">ΛΦ</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">PCR Dashboard</h1>
          <p className="text-xs text-muted-foreground font-mono">v2.0.0-ΛΦ</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Radio className="h-4 w-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.full_name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
