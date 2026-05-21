
import { Link, usePage } from '@inertiajs/react'
import { useState } from "react"
import type { Auth } from '@/types'
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
  LogOut 
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

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { auth } = usePage<{ auth: Auth }>().props
  const isLoggedIn = !!auth.user
  const currentUser = auth.user
    ? {
        name: auth.user.name,
        email: auth.user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=7c3aed&color=fff`,
      }
    : null

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/explore" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="/commission/create" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Commission
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/commissions" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    My Commissions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/messages" className="cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/favorites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Link href="/login" className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Explore
            </Link>
            <Link href="/commission/create" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Commission
            </Link>
            <Link href="/about" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            
            {isLoggedIn && currentUser ? (
              <>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm py-2" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm py-2" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/commissions" className="flex items-center gap-2 text-sm py-2" onClick={() => setIsMenuOpen(false)}>
                      <FileText className="h-4 w-4" /> My Commissions
                    </Link>
                    <Link href="/dashboard/messages" className="flex items-center gap-2 text-sm py-2" onClick={() => setIsMenuOpen(false)}>
                      <MessageSquare className="h-4 w-4" /> Messages
                    </Link>
                    <Link href="/dashboard/favorites" className="flex items-center gap-2 text-sm py-2" onClick={() => setIsMenuOpen(false)}>
                      <Heart className="h-4 w-4" /> Favorites
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm py-2" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </div>
                  <div className="pt-4 mt-4 border-t border-border">
                    <Button variant="destructive" asChild className="w-full gap-2">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
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
