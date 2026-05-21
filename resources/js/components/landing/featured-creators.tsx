
import { useState } from "react"
import { Link } from '@inertiajs/react'
import { Star, Heart, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const featuredCreators = [
  {
    id: 1,
    name: "Sarah Wijaya",
    username: "sarahdesigns",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    specialty: "Graphic Designer",
    location: "Jakarta",
    rating: 4.9,
    reviews: 234,
    startingPrice: 150000,
    tags: ["Logo Design", "Branding", "Social Media"],
    portfolio: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Andi Pratama",
    username: "andiart",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialty: "Illustrator",
    location: "Bandung",
    rating: 5.0,
    reviews: 189,
    startingPrice: 200000,
    tags: ["Character Design", "Digital Art", "Comics"],
    portfolio: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Maya Putri",
    username: "mayaui",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialty: "UI/UX Designer",
    location: "Surabaya",
    rating: 4.8,
    reviews: 156,
    startingPrice: 300000,
    tags: ["Mobile App", "Web Design", "Prototype"],
    portfolio: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Rizky Hakim",
    username: "rizkymotion",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    specialty: "Video Editor",
    location: "Yogyakarta",
    rating: 4.9,
    reviews: 98,
    startingPrice: 250000,
    tags: ["Motion Graphics", "YouTube", "Ads"],
    portfolio: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop"
  }
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export function FeaturedCreators() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Creators</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Kreator terpilih dengan rating tinggi dan portfolio menakjubkan. Siap membantu mewujudkan idemu.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/explore">
              View All Creators
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCreators.map((creator) => (
            <Link key={creator.id} href={`/creator/${creator.username}`}>
              <Card className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full">
                {/* Portfolio Preview */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={creator.portfolio}
                    alt={`${creator.name}'s portfolio`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    onClick={(e) => toggleFavorite(e, creator.id)}
                    className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors"
                  >
                    <Heart className={`h-4 w-4 transition-colors ${
                      favorites.includes(creator.id) 
                        ? "text-red-500 fill-red-500" 
                        : "text-muted-foreground hover:text-red-500"
                    }`} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {creator.rating} ({creator.reviews})
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Creator Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">@{creator.username}</p>
                    </div>
                  </div>

                  {/* Specialty & Location */}
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-primary font-medium">{creator.specialty}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {creator.location}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {creator.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                    {creator.tags.length > 2 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        +{creator.tags.length - 2}
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="font-semibold text-primary">{formatPrice(creator.startingPrice)}</p>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Commission
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
