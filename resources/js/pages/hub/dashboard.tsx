import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Clock, FileText, Heart, MessageSquare, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    stats: { active: number; completed: number; favorites: number; messages: number };
    activeCommissions: Array<{
        id: number;
        title: string;
        status_label: string;
        deadline: string | null;
        progress: number;
        creator: { name: string; avatar: string };
    }>;
    recentMessages: Array<{
        id: number;
        sender: { name: string; avatar: string };
        message: string;
        time: string;
    }>;
    userName: string;
};

export default function BuyerDashboard() {
    const { stats, activeCommissions, recentMessages, userName } = usePage<Props>().props;

    const statCards = [
        { label: 'Komisi Aktif', value: stats.active, icon: FileText, href: '/dashboard/commissions?status=in_progress' },
        { label: 'Selesai', value: stats.completed, icon: FileText, href: '/dashboard/commissions?status=completed' },
        { label: 'Favorit', value: stats.favorites, icon: Heart, href: '/dashboard/favorites' },
        { label: 'Pesan', value: stats.messages, icon: MessageSquare, href: '/dashboard/messages' },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">Halo, {userName}!</h1>
                <p className="text-muted-foreground">Dashboard pembeli jasa — kelola komisi & chat dengan penjual.</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <Card className="cursor-pointer hover:shadow-md">
                            <CardContent className="flex items-center gap-4 p-4">
                                <stat.icon className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Komisi Aktif</CardTitle>
                            <CardDescription>Pesanan jasa Anda</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/commissions">Semua <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeCommissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada komisi. <Link href="/explore" className="text-primary">Cari kreator</Link></p>
                        ) : (
                            activeCommissions.map((c) => (
                                <div key={c.id} className="flex gap-4 rounded-lg bg-muted/50 p-4">
                                    <Avatar>
                                        <AvatarImage src={c.creator.avatar} />
                                        <AvatarFallback>{c.creator.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{c.title}</h4>
                                        <p className="text-sm text-muted-foreground">{c.creator.name}</p>
                                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{c.status_label}</span>
                                        {c.deadline && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" /> {c.deadline}
                                            </p>
                                        )}
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${c.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pesan Terbaru</CardTitle>
                            <CardDescription>Chat dengan penjual</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/messages">Semua <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentMessages.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada pesan.</p>
                        ) : (
                            recentMessages.map((msg) => (
                            <Link key={msg.id} href={`/dashboard/messages?conversation=${msg.id}`} className="flex gap-4 rounded-lg p-2 hover:bg-muted/50">
                                <Avatar>
                                    <AvatarImage src={msg.sender.avatar} />
                                    <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{msg.sender.name}</p>
                                    <p className="truncate text-sm text-muted-foreground">{msg.message}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </Link>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader><CardTitle>Aksi Cepat</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                    <Button variant="outline" asChild><Link href="/commission/create"><FileText className="mr-2 h-4 w-4" />Buat Komisi</Link></Button>
                    <Button variant="outline" asChild><Link href="/explore"><Star className="mr-2 h-4 w-4" />Cari Kreator</Link></Button>
                    <Button variant="outline" asChild><Link href="/dashboard/profile">Profil Saya</Link></Button>
                </CardContent>
            </Card>
        </div>
    );
}
