import { Form, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    creators: Array<{ id: number; name: string; username: string | null }>;
    services: Array<{ id: number; title: string; price: number }>;
    categories: string[];
    prefill: { creator_id: number | null; service_id: number | null };
};

export default function CreateCommissionPage() {
    const { creators, services, categories, prefill } = usePage<Props>().props;

    return (
        <div className="mx-auto max-w-3xl p-6 lg:p-8">
            <Link
                href="/explore"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Explore
            </Link>

            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">Buat Komisi</h1>
                <p className="text-muted-foreground">
                    Jelaskan proyek Anda dan ajukan pesanan ke kreator.
                </p>
            </div>

            <Form action="/commission/create" method="post" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Proyek</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div>
                            <Label htmlFor="creator_id">Kreator *</Label>
                            <select
                                id="creator_id"
                                name="creator_id"
                                required
                                defaultValue={prefill.creator_id ?? ''}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="" disabled>
                                    Pilih kreator
                                </option>
                                {creators.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                        {c.username ? ` (@${c.username})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {services.length > 0 && (
                            <div>
                                <Label htmlFor="service_id">Layanan (opsional)</Label>
                                <select
                                    id="service_id"
                                    name="service_id"
                                    defaultValue={prefill.service_id ?? ''}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Tanpa layanan spesifik</option>
                                    {services.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.title} — Rp {s.price.toLocaleString('id-ID')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="title">Judul proyek *</Label>
                            <Input id="title" name="title" required />
                        </div>

                        <div>
                            <Label htmlFor="category">Kategori *</Label>
                            <select
                                id="category"
                                name="category"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="" disabled>
                                    Pilih kategori
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="description">Deskripsi *</Label>
                            <Textarea id="description" name="description" rows={5} required />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="budget">Budget (IDR)</Label>
                                <Input id="budget" name="budget" type="number" min={0} />
                            </div>
                            <div>
                                <Label htmlFor="deadline">Tenggat</Label>
                                <Input id="deadline" name="deadline" type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary sm:w-auto"
                >
                    Kirim Komisi
                </Button>
            </Form>
        </div>
    );
}
