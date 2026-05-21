import { Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, Users, Star, Briefcase } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Platform Kreator Digital #1 di Indonesia</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Find Creative Talent &{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Start Commission
            </span>{" "}
            Easily
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Platform untuk menemukan kreator digital terbaik. Dari desain grafis hingga ilustrasi, 
            temukan talenta kreatif yang sesuai dengan kebutuhanmu.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 px-8">
              <Link href="/explore">
                <Search className="mr-2 h-5 w-5" />
                Find Creator
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link href="/commission/create">
                Start Commission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-foreground">
                <Users className="h-6 w-6 text-primary" />
                10K+
              </div>
              <p className="text-sm text-muted-foreground mt-1">Active Creators</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-foreground">
                <Briefcase className="h-6 w-6 text-secondary" />
                50K+
              </div>
              <p className="text-sm text-muted-foreground mt-1">Projects Done</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-foreground">
                <Star className="h-6 w-6 text-primary fill-primary" />
                4.9
              </div>
              <p className="text-sm text-muted-foreground mt-1">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
