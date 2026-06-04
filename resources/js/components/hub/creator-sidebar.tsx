
import { Link, router, usePage } from '@inertiajs/react'
import type { Auth } from '@/types/auth'
import { profilePathFor, settingsPathFor } from '@/lib/navigation'
import { logout } from '@/routes'
import { useState } from "react"
import {
  LayoutDashboard,
  ShoppingBag,
  Image,
  MessageSquare,
  DollarSign,
  Star,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useInitials } from '@/hooks/use-initials'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/creator/dashboard" },
  { icon: ShoppingBag, label: "Pesanan Masuk", href: "/creator/orders" },
  { icon: Image, label: "Layanan Saya", href: "/creator/services" },
  { icon: Image, label: "Portfolio", href: "/creator/portfolio" },
  { icon: MessageSquare, label: "Chat Pembeli", href: "/creator/messages" },
]

export function CreatorSidebar() {
  const { auth } = usePage<{ auth: Auth }>().props
  const pathname = usePage().url
  const getInitials = useInitials()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex items-center h-16 px-4 border-b border-sidebar-border",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Creative Hub
                </span>
              </Link>
            )}
            {isCollapsed && (
              <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="h-5 w-5 text-white" />
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors",
                isCollapsed && "rotate-180"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden h-8 w-8 flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Creator Badge */}
          {!isCollapsed && (
            <div className="px-4 py-3 border-b border-sidebar-border">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                Creator Mode
              </span>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/creator/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className={cn(
            "p-4 border-t border-sidebar-border",
            isCollapsed && "flex justify-center"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-2 hover:bg-sidebar-accent",
                    isCollapsed && "w-auto justify-center px-2"
                  )}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                    <AvatarFallback>{getInitials(auth.user?.name ?? '')}</AvatarFallback>
                  </Avatar>
                  {!isCollapsed && auth.user && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{auth.user.name}</span>
                      <span className="text-xs text-muted-foreground">Creator</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={profilePathFor(auth.user)}>View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={settingsPathFor(auth.user)}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => router.post(logout.url())}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  )
}
