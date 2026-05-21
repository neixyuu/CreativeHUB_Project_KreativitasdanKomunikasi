import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Order = {
    id: number;
    title: string;
    client: string;
    status: string;
    progress: number;
    budget: number | null;
    deadline: string | null;
};

type Props = { orders: Order[] };

export default function CreatorOrders() {
    const { orders } = usePage<Props>().props;

    return (
        <div className="p-6 lg:p-8">
            <h1 className="mb-6 text-2xl font-bold">Pesanan Masuk</h1>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p className="text-muted-foreground">Belum ada pesanan dari pembeli.</p>
                ) : (
                    orders.map((o) => (
                        <Card key={o.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{o.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">Pembeli: {o.client}</p>
                            </CardHeader>
                            <CardContent>
                                <p>Status: <strong>{o.status}</strong> · Progress: {o.progress}%</p>
                                {o.budget && <p>Budget: Rp {o.budget.toLocaleString('id-ID')}</p>}
                                {o.deadline && <p>Deadline: {o.deadline}</p>}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
