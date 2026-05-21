import { Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    stats: Record<string, number>;
    recentReports: Array<{ id: number; subject: string; type: string; status: string; reporter: string; created_at: string }>;
    growth: { users_this_month: number; commissions_this_month: number };
};

export default function AdminDashboard() {
    const { stats, recentReports, growth } = usePage<Props>().props;

    return (
        <div className="p-8">
            <h1 className="mb-2 text-3xl font-bold">Dashboard Admin</h1>
            <p className="mb-8 text-muted-foreground">Pantau perkembangan platform, pengguna, dan laporan.</p>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    ['Total Pengguna', stats.total_users],
                    ['Pembeli', stats.buyers],
                    ['Penjual (Kreator)', stats.creators],
                    ['Laporan Terbuka', stats.open_reports],
                ].map(([label, value]) => (
                    <Card key={String(label)}>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{value}</p>
                            <p className="text-sm text-muted-foreground">{label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Komisi</CardTitle></CardHeader>
                    <CardContent>
                        <p>Aktif: <strong>{stats.active_commissions}</strong></p>
                        <p>Selesai: <strong>{stats.completed_commissions}</strong></p>
                        <p className="mt-2 text-sm text-muted-foreground">Bulan ini: {growth.commissions_this_month} komisi baru</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Pertumbuhan</CardTitle></CardHeader>
                    <CardContent>
                        <p>Pengguna baru bulan ini: <strong>{growth.users_this_month}</strong></p>
                        <p>Pesan hari ini: <strong>{stats.messages_today}</strong></p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle>Laporan Terbaru</CardTitle>
                    <Link href="/admin/reports" className="text-sm text-primary">Kelola semua</Link>
                </CardHeader>
                <CardContent className="space-y-3">
                    {recentReports.map((r) => (
                        <div key={r.id} className="flex justify-between rounded-lg border p-3">
                            <div>
                                <p className="font-medium">{r.subject}</p>
                                <p className="text-sm text-muted-foreground">{r.reporter} · {r.type}</p>
                            </div>
                            <span className="text-xs uppercase text-muted-foreground">{r.status}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
