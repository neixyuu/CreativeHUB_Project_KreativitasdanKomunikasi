import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    username: string;
    is_active: boolean;
    created_at: string;
};

type Props = {
    users: { data: UserRow[] };
    filters: { role: string };
};

export default function AdminUsers() {
    const { users, filters } = usePage<Props>().props;
    const list = users.data ?? [];

    return (
        <div className="p-8">
            <h1 className="mb-6 text-2xl font-bold">Kelola Pengguna</h1>
            <div className="mb-4 flex gap-2">
                {['', 'buyer', 'creator'].map((role) => (
                    <Button
                        key={role || 'all'}
                        variant={filters.role === role ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => router.get('/admin/users', { role: role || undefined })}
                    >
                        {role === '' ? 'Semua' : role === 'buyer' ? 'Pembeli' : 'Kreator'}
                    </Button>
                ))}
            </div>
            <Card>
                <CardHeader><CardTitle>Daftar Pengguna</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {list.map((u) => (
                        <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <p className="font-medium">{u.name} (@{u.username})</p>
                                <p className="text-sm text-muted-foreground">{u.email} · {u.role}</p>
                            </div>
                            <Button
                                size="sm"
                                variant={u.is_active ? 'outline' : 'destructive'}
                                onClick={() => router.patch(`/admin/users/${u.id}/toggle`)}
                            >
                                {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

//end user
