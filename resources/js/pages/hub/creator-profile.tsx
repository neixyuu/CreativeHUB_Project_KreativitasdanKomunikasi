import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Heart, MapPin, MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type Creator = {
    id: number;
    name: string;
    username: string;
    avatar: string;
    cover_image: string | null;
    specialty: string;
    location: string | null;
    rating: number;
    reviews: number;
    bio: string | null;
    skills: string[];
    services: Array<{ id: number; title: string; price: number; description: string }>;
    portfolio: Array<{ id: number; title: string; image: string }>;
};

type Props = {
    creator: Creator;
    isFavorite: boolean;
    canChat: boolean;
    canCommission: boolean;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function CreatorProfilePage() {
    const { creator, isFavorite, canChat, canCommission } = usePage<Props>().props;
    const [fav, setFav] = useState(isFavorite);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatBody, setChatBody] = useState('');

    const sendChat = () => {
        router.post(
            '/chat/start',
            { user_id: creator.id, body: chatBody.trim() || undefined },
            {
                onFinish: () => {
                    setChatOpen(false);
                    setChatBody('');
                },
            },
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" size="sm" className="mb-4" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>

            <div className="mb-8 overflow-hidden rounded-2xl border bg-card">
                {creator.cover_image && (
                    <img src={creator.cover_image} alt="" className="h-48 w-full object-cover md:h-64" />
                )}
                <div className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={creator.avatar} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{creator.name}</h1>
                            <p className="text-muted-foreground">@{creator.username} · {creator.specialty}</p>
                            {creator.location && (
                                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" /> {creator.location}
                                </p>
                            )}
                            <div className="mt-2 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{creator.rating} ({creator.reviews} ulasan)</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {canCommission && (
                                <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                                    <Link href={`/commission/create?creator=${creator.id}`}>Pesan Jasa</Link>
                                </Button>
                            )}
                            {canChat ? (
                                <Button variant="outline" onClick={() => setChatOpen(true)}>
                                    <MessageSquare className="mr-2 h-4 w-4" /> Chat
                                </Button>
                            ) : (
                                <Button variant="outline" asChild>
                                    <Link href="/login">Login untuk Chat</Link>
                                </Button>
                            )}
                            {canCommission && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.post('/favorites/toggle', { creator_id: creator.id }, { onSuccess: () => setFav(!fav) })}
                                >
                                    <Heart className={`h-4 w-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                                </Button>
                            )}
                        </div>
                    </div>
                    {creator.bio && <p className="mt-4 text-muted-foreground">{creator.bio}</p>}
                </div>
            </div>

            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim pesan ke {creator.name}</DialogTitle>
                        <DialogDescription>
                            Mulai percakapan dengan penjual. Kosongkan pesan jika ingin mengetik di halaman chat.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={chatBody}
                        onChange={(e) => setChatBody(e.target.value)}
                        placeholder="Halo, saya tertarik dengan layanan Anda..."
                        rows={4}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setChatOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={sendChat}>Mulai Chat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Layanan Ditawarkan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {creator.services.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada layanan terdaftar.</p>
                        ) : (
                            creator.services.map((s) => (
                                <div key={s.id} className="rounded-lg border p-4">
                                    <h3 className="font-semibold">{s.title}</h3>
                                    <p className="text-sm text-muted-foreground">{s.description}</p>
                                    <p className="mt-2 font-bold text-primary">{formatPrice(s.price)}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        {creator.portfolio.length === 0 ? (
                            <p className="col-span-2 text-sm text-muted-foreground">Belum ada portfolio.</p>
                        ) : (
                            creator.portfolio.map((p) => (
                                <img key={p.id} src={p.image} alt={p.title} className="aspect-square rounded-lg object-cover" />
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
