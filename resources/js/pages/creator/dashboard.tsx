import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    DollarSign,
    ShoppingBag,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    stats: {
        active_orders: number;
        completed: number;
        earnings: number;
        rating: number;
    };
    orders: Array<{
        id: number;
        title: string;
        client: string;
        status: string;
        budget: number | null;
        deadline: string | null;
    }>;
    creator: {
        name: string;
        specialty: string | null;
    };
};

function formatPrice(price: number | null) {
    if (price == null) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function statusLabel(status: string) {
    return status
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default function CreatorDashboardPage() {
    const { stats, orders, creator } = usePage<Props>().props;

    const statCards = [
        {
            label: 'Active Orders',
            value: stats.active_orders,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            label: 'Total Earnings',
            value: formatPrice(stats.earnings),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            label: 'Rating',
            value: stats.rating > 0 ? stats.rating.toFixed(1) : '—',
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">
                    Creator Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Selamat datang, {creator.name}
                    {creator.specialty ? ` — ${creator.specialty}` : ''}
                </p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-4 lg:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
                                >
                                    <stat.icon
                                        className={`h-6 w-6 ${stat.color}`}
                                    />
                                </div>
                            </div>
                            <p className="text-2xl font-bold lg:text-3xl">
                                {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {stat.label}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Permintaan komisi terbaru
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/creator/orders">
                            View All <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-start gap-4 rounded-lg bg-muted/50 p-4"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                                    {order.client.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate font-medium">
                                        {order.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {order.client}
                                    </p>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                            {statusLabel(order.status)}
                                        </span>
                                        {order.deadline && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                Due: {order.deadline}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-primary">
                                    {formatPrice(order.budget)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="py-8 text-center text-muted-foreground">
                            Belum ada pesanan. Pesanan akan muncul setelah pembeli
                            mengajukan komisi.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
