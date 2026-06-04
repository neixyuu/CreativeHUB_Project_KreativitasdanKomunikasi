
import { Link, router, usePage } from '@inertiajs/react'
import { useState } from "react"
import type { Auth } from '@/types'
import { profilePathFor } from '@/lib/navigation'
import { logout } from '@/routes'
import { 
  Menu, 
  X, 
  Sparkles, 
  User, 
  LayoutDashboard, 
  FileText, 
  Heart, 
  MessageSquare,
  Settings, 
  LogOut,
  ShoppingBag,
  Image,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function userMenuItems(user: Auth['user']) {
  if (user?.role === 'creator') {
    return [
      { href: profilePathFor(user), icon: User, label: 'Profil Publik' },
      { href: '/creator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/creator/orders', icon: ShoppingBag, label: 'Pesanan Masuk' },
      { href: '/creator/services', icon: FileText, label: 'Layanan Saya' },
      { href: '/creator/portfolio', icon: Image, label: 'Portfolio' },
      { href: '/creator/messages', icon: MessageSquare, label: 'Chat Pembeli' },
      { href: '/dashboard/settings', icon: Settings, label: 'Pengaturan' },
    ]
  }

  return [
    { href: '/dashboard/profile', icon: User, label: 'Profil Saya' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/commissions', icon: FileText, label: 'Komisi Saya' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Pesan' },
    { href: '/dashboard/favorites', icon: Heart, label: 'Favorit' },
    { href: '/dashboard/settings', icon: Settings, label: 'Pengaturan' },
  ]
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { auth } = usePage<{ auth: Auth }>().props
  const user = auth.user
  const isLoggedIn = !!user
  const isCreator = user?.role === 'creator'
  const menuItems = userMenuItems(user)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Creative Hub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/explore" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Explore
          </Link>
          {!isCreator && (
            <Link href="/commission/create" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Commission
            </Link>
          )}
          <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => router.post(logout.url())}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/explore" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Explore</Link>
            {!isCreator && (
              <Link href="/commission/create" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Commission</Link>
            )}
            <Link href="/about" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            
            {isLoggedIn && user ? (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-2 text-sm py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" /> {item.label}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t border-border">
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.post(logout.url())
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" asChild className="w-full justify-center">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
