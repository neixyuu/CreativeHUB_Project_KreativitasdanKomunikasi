
import { useState } from "react"
import { Link } from '@inertiajs/react'
import { Star, Heart, MapPin, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const initialFavorites = [
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
    id: 5,
    name: "Dian Sari",
    username: "dianweb",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    specialty: "Web Designer",
    location: "Bali",
    rating: 4.7,
    reviews: 121,
    startingPrice: 350000,
    tags: ["Landing Page", "E-commerce", "WordPress"],
    portfolio: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Lisa Anggraini",
    username: "lisadesign",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    specialty: "Graphic Designer",
    location: "Semarang",
    rating: 4.9,
    reviews: 203,
    startingPrice: 180000,
    tags: ["Logo Design", "Packaging", "Illustration"],
    portfolio: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop"
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites)

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(creator => creator.id !== id))
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Favorite Creators</h1>
        <p className="text-muted-foreground">Creators you&apos;ve saved for later</p>
      </div>

      {/* Favorites Count */}
      <p className="text-sm text-muted-foreground mb-6">
        {favorites.length} favorite creator{favorites.length !== 1 && "s"}
      </p>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((creator) => (
            <Card key={creator.id} className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              {/* Portfolio Preview */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={creator.portfolio}
                  alt={`${creator.name}'s portfolio`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur hover:bg-red-50 transition-colors">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {creator.name} from your favorites? You can always add them back later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => removeFavorite(creator.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                <Button size="sm" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Link href={`/creator/${creator.username}`}>
                    Commission
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring creators and save your favorites to find them easily later.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary">
            <Link href="/explore">Explore Creators</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
