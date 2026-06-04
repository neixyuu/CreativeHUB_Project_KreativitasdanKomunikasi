import { Link, router, usePage } from '@inertiajs/react';
import { Heart, MapPin, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';

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
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function FavoritesPage() {
    const { creators } = usePage<Props>().props;
    const favorites = creators.data ?? [];

    const removeFavorite = (creatorId: number) => {
        router.post(
            '/favorites/toggle',
            { creator_id: creatorId },
            { preserveScroll: true },
        );
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">
                    Favorite Creators
                </h1>
                <p className="text-muted-foreground">
                    Kreator yang Anda simpan
                </p>
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
                {favorites.length} favorite creator
                {favorites.length !== 1 && 's'}
            </p>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((creator) => (
                        <Card
                            key={creator.id}
                            className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                        >
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
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-red-50"
                                        >
                                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Hapus dari favorit?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {creator.name} akan dihapus dari
                                                daftar favorit Anda.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Batal
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    removeFavorite(creator.id)
                                                }
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex items-center justify-between p-4 pt-0">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Starting from
                                    </p>
                                    <p className="font-semibold text-primary">
                                        {formatPrice(creator.starting_price)}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    asChild
                                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                >
                                    <Link href={`/creator/${creator.username}`}>
                                        Commission
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center">
                    <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-xl font-semibold">
                        Belum ada favorit
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                        Jelajahi kreator dan simpan favorit Anda untuk akses
                        cepat nanti.
                    </p>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-primary to-secondary"
                    >
                        <Link href="/explore">Explore Creators</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
