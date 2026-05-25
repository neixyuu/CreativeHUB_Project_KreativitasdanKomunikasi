import { Form, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

const statuses = [
    { value: 'pending', label: 'Menunggu' },
    { value: 'in_progress', label: 'Berjalan' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

export default function CreatorOrders() {
    const { orders } = usePage<Props>().props;

    return (
        <div className="p-6 lg:p-8">
            <h1 className="mb-6 text-2xl font-bold">Pesanan Masuk</h1>
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <p className="text-muted-foreground">Belum ada pesanan dari pembeli.</p>
                ) : (
                    orders.map((o) => (
                        <Card key={o.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{o.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">Pembeli: {o.client}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    Status:{' '}
                                    <strong className="capitalize">
                                        {o.status.replace('_', ' ')}
                                    </strong>{' '}
                                    · Progress: {o.progress}%
                                </p>
                                {o.budget != null && (
                                    <p>Budget: Rp {o.budget.toLocaleString('id-ID')}</p>
                                )}
                                {o.deadline && <p>Tenggat: {o.deadline}</p>}

                                <Form
                                    action={`/creator/orders/${o.id}`}
                                    method="post"
                                    className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3"
                                >
                                    <input type="hidden" name="_method" value="PATCH" />
                                    <div>
                                        <Label htmlFor={`status-${o.id}`}>Status</Label>
                                        <select
                                            id={`status-${o.id}`}
                                            name="status"
                                            defaultValue={o.status}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            {statuses.map((s) => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`progress-${o.id}`}>Progress (%)</Label>
                                        <Input
                                            id={`progress-${o.id}`}
                                            name="progress"
                                            type="number"
                                            min={0}
                                            max={100}
                                            defaultValue={o.progress}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button type="submit" className="w-full">
                                            Perbarui
                                        </Button>
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
