import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type Creator = {
    id: number;
    name: string;
    username: string | null;
    avatar: string;
    specialty: string | null;
    location: string | null;
    rating: number;
    reviews: number;
    starting_price: number;
    skills: string[];
    portfolio: string | null;
};

type PageProps = {
    featuredCreators?: Creator[];
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function FeaturedCreators() {
    const { featuredCreators = [] } = usePage<PageProps>().props;

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Kreator{' '}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Unggulan
                            </span>
                        </h2>
                        <p className="max-w-xl text-muted-foreground">
                            Kreator terpilih dengan rating tinggi. Siap membantu mewujudkan ide Anda.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/explore">
                            Lihat Semua
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {featuredCreators.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        Belum ada kreator. Daftar sebagai kreator untuk mulai menawarkan jasa.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredCreators.map((creator) => (
                            <Link
                                key={creator.id}
                                href={creator.username ? `/creator/${creator.username}` : '/explore'}
                            >
                                <Card className="group h-full cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                        {creator.portfolio ? (
                                            <img
                                                src={creator.portfolio}
                                                alt={`Portfolio ${creator.name}`}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                Portfolio
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {creator.rating} ({creator.reviews})
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-background">
                                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-semibold">{creator.name}</h3>
                                                <p className="truncate text-sm text-muted-foreground">
                                                    @{creator.username}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3 flex items-center justify-between text-sm">
                                            <span className="font-medium text-primary">
                                                {creator.specialty ?? 'Kreator'}
                                            </span>
                                            {creator.location && (
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {creator.location}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {creator.skills.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Mulai dari</p>
                                            <p className="font-semibold text-primary">
                                                {formatPrice(creator.starting_price)}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                        >
                                            Komisi
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
