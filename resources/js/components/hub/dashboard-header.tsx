
import { Link, router, usePage } from '@inertiajs/react'
import type { Auth } from '@/types'
import {
  Bell,
  User,
  LayoutDashboard,
  FileText,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const { auth } = usePage<{ auth: Auth }>().props
  const currentUser = auth.user

  if (!currentUser) return null

  const isBuyer = !currentUser.is_creator && !currentUser.is_admin
  const messagesHref = currentUser.is_creator ? '/creator/messages' : '/dashboard/messages'
  const dashboardHref = currentUser.is_admin
    ? '/admin'
    : currentUser.is_creator
      ? '/creator/dashboard'
      : '/dashboard'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="hidden md:flex flex-1 max-w-md">
        <form action="/explore" method="get" className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Cari kreator di Explore..."
            className="pl-10 bg-muted/50"
          />
        </form>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-2">
        {isBuyer && (
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
        )}

        <Button variant="ghost" size="icon" asChild>
          <Link href={messagesHref}>
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isBuyer ? (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
            ) : null}
            {isBuyer ? (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/commissions" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Komisi Saya
                </Link>
              </DropdownMenuItem>
            ) : null}
            {isBuyer ? (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/favorites" className="cursor-pointer">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorit
                </Link>
              </DropdownMenuItem>
            ) : null}
            {currentUser.is_creator ? (
              <DropdownMenuItem asChild>
                <Link href="/creator/marketplace-profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil Marketplace
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem asChild>
              <Link href={dashboardHref} className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => router.post('/logout')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
