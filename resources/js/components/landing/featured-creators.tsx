import { Link } from '@inertiajs/react';
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type Creator = {
    id: number;
    name: string;
    username: string;
    avatar: string;
    specialty: string;
    location: string | null;
    rating: number;
    reviews: number;
    starting_price: number;
    skills: string[];
    portfolio: string | null;
};

type Props = {
    creators: Creator[];
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function FeaturedCreators({ creators }: Props) {
    const [favorites, setFavorites] = useState<number[]>([]);

    const toggleFavorite = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
        );
    };

    if (creators.length === 0) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Featured{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Creators
                        </span>
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                        Belum ada kreator terdaftar. Jadilah yang pertama atau
                        jelajahi halaman explore.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/explore">
                            Jelajahi Kreator
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Featured{' '}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Creators
                            </span>
                        </h2>
                        <p className="max-w-xl text-muted-foreground">
                            Kreator terpilih dengan rating tinggi. Siap membantu
                            mewujudkan idemu.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/explore">
                            View All Creators
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {creators.map((creator) => (
                        <Link
                            key={creator.id}
                            href={`/creator/${creator.username}`}
                        >
                            <Card className="group h-full cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    {creator.portfolio ? (
                                        <img
                                            src={creator.portfolio}
                                            alt={`${creator.name}'s portfolio`}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                            Belum ada portfolio
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            toggleFavorite(e, creator.id)
                                        }
                                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white"
                                    >
                                        <Heart
                                            className={`h-4 w-4 transition-colors ${
                                                favorites.includes(creator.id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-muted-foreground hover:text-red-500'
                                            }`}
                                        />
                                    </button>
                                    {creator.rating > 0 && (
                                        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {creator.rating} ({creator.reviews})
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-4">
                                    <div className="mb-3 flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-background">
                                            <AvatarImage
                                                src={creator.avatar}
                                                alt={creator.name}
                                            />
                                            <AvatarFallback>
                                                {creator.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold">
                                                {creator.name}
                                            </h3>
                                            <p className="truncate text-sm text-muted-foreground">
                                                @{creator.username}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-3 flex items-center justify-between text-sm">
                                        <span className="font-medium text-primary">
                                            {creator.specialty}
                                        </span>
                                        {creator.location && (
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                {creator.location}
                                            </span>
                                        )}
                                    </div>

                                    {creator.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {creator.skills
                                                .slice(0, 2)
                                                .map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            {creator.skills.length > 2 && (
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                    +{creator.skills.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex items-center justify-between p-4 pt-0">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Starting from
                                        </p>
                                        <p className="font-semibold text-primary">
                                            {formatPrice(
                                                creator.starting_price,
                                            )}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                    >
                                        Commission
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
