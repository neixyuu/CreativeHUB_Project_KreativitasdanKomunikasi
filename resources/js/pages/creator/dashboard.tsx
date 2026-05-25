import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    DollarSign,
    ShoppingBag,
    Star,
    TrendingUp,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type OrderItem = {
    id: number;
    title: string;
    client: { name: string; avatar: string };
    status: string;
    price: number;
    deadline: string;
};

type Props = {
    stats: {
        active_orders: number;
        completed: number;
        earnings: number;
        rating: number;
    };
    orders: OrderItem[];
    creator: { name: string; specialty: string | null };
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function statusClass(status: string) {
    switch (status) {
        case 'review':
            return 'bg-yellow-100 text-yellow-700';
        case 'pending':
            return 'bg-orange-100 text-orange-700';
        case 'completed':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-blue-100 text-blue-700';
    }
}

export default function CreatorDashboardPage() {
    const { stats, orders, creator } = usePage<Props>().props;

    const statCards = [
        {
            label: 'Pesanan Aktif',
            value: String(stats.active_orders),
            icon: ShoppingBag,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Total Pendapatan',
            value: formatPrice(stats.earnings),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            label: 'Menunggu',
            value: String(stats.active_orders),
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            label: 'Selesai',
            value: String(stats.completed),
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">Dashboard Kreator</h1>
                <p className="text-muted-foreground">
                    Selamat datang, {creator.name}! {creator.specialty && `Spesialisasi: ${creator.specialty}`}
                </p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-4 lg:p-6">
                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-bold lg:text-3xl">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pesanan Terbaru</CardTitle>
                            <CardDescription>Permintaan komisi terakhir</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/creator/orders">
                                Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {orders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-start gap-4 rounded-lg bg-muted/50 p-4"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={order.client.avatar} alt={order.client.name} />
                                        <AvatarFallback>{order.client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate font-medium">{order.title}</h4>
                                        <p className="text-sm text-muted-foreground">{order.client.name}</p>
                                        <div className="mt-2 flex items-center gap-4">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs capitalize ${statusClass(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Tenggat: {order.deadline}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-primary">
                                        {formatPrice(order.price)}
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rating Anda</CardTitle>
                        <CardDescription>Ringkasan reputasi di platform</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="mb-2 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-6 w-6 ${i < Math.round(stats.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                />
                            ))}
                        </div>
                        <p className="text-4xl font-bold">{stats.rating.toFixed(1)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {stats.rating > 0
                                ? 'Berdasarkan ulasan pembeli yang sudah menyelesaikan komisi.'
                                : 'Belum ada ulasan. Selesaikan komisi untuk mendapat rating pertama.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
