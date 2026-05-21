import { Form, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ReportRow = {
    id: number;
    subject: string;
    message: string;
    type: string;
    status: string;
    admin_notes: string | null;
    reporter: string;
    reported_user: string | null;
    created_at: string;
};

type Props = {
    reports: { data: ReportRow[] };
    filters: { status: string };
};

export default function AdminReports() {
    const { reports } = usePage<Props>().props;
    const list = reports.data ?? [];

    return (
        <div className="p-8">
            <h1 className="mb-6 text-2xl font-bold">Laporan & Feedback</h1>
            <div className="space-y-4">
                {list.map((r) => (
                    <Card key={r.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{r.subject}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {r.reporter} → {r.reported_user ?? 'Platform'} · {r.created_at}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm">{r.message}</p>
                            <Form method="patch" action={`/admin/reports/${r.id}`} className="space-y-3">
                                <div>
                                    <Label>Status</Label>
                                    <select name="status" defaultValue={r.status} className="w-full rounded-md border px-3 py-2">
                                        <option value="open">Terbuka</option>
                                        <option value="in_review">Ditinjau</option>
                                        <option value="resolved">Selesai</option>
                                        <option value="dismissed">Ditolak</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Catatan Admin</Label>
                                    <Textarea name="admin_notes" defaultValue={r.admin_notes ?? ''} rows={2} />
                                </div>
                                <Button type="submit" size="sm">Simpan</Button>
                            </Form>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
