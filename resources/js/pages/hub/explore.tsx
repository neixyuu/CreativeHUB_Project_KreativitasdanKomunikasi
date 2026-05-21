import { Link, router, usePage } from '@inertiajs/react';
import { Heart, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    creators: { data: Creator[] };
    favoriteIds: number[];
    filters: { q: string; category: string };
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function ExplorePage() {
    const { creators, favoriteIds, filters } = usePage<Props>().props;
    const [searchQuery, setSearchQuery] = useState(filters.q);
    const [favorites, setFavorites] = useState<number[]>(favoriteIds);

    const list = creators.data ?? [];

    const toggleFavorite = (creatorId: number) => {
        router.post(
            '/favorites/toggle',
            { creator_id: creatorId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFavorites((prev) =>
                        prev.includes(creatorId)
                            ? prev.filter((id) => id !== creatorId)
                            : [...prev, creatorId],
                    );
                },
            },
        );
    };

    const handleSearch = () => {
        router.get('/explore', { q: searchQuery, category: filters.category });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">Jelajahi Kreator</h1>
                <p className="text-muted-foreground">
                    Temukan penjual jasa kreatif. Tamu dapat melihat profil; daftar untuk chat & komisi.
                </p>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama, keahlian..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleSearch}>Cari</Button>
            </div>

            {list.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    Belum ada kreator. Daftar sebagai kreator untuk menawarkan jasa.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((creator) => (
                        <Link key={creator.id} href={`/creator/${creator.username}`}>
                            <Card className="h-full overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
                                <div className="relative aspect-[4/3] bg-muted">
                                    {creator.portfolio && (
                                        <img
                                            src={creator.portfolio}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleFavorite(creator.id);
                                        }}
                                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${favorites.includes(creator.id) ? 'fill-red-500 text-red-500' : ''}`}
                                        />
                                    </button>
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-3 flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={creator.avatar} />
                                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{creator.name}</h3>
                                            <p className="text-sm text-muted-foreground">@{creator.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-primary">{creator.specialty}</span>
                                        {creator.location && (
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                {creator.location}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-1 text-sm">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {creator.rating} ({creator.reviews})
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-4 pt-0">
                                    <span className="font-semibold text-primary">
                                        {formatPrice(creator.starting_price)}
                                    </span>
                                    <Button size="sm">Lihat Profil</Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
