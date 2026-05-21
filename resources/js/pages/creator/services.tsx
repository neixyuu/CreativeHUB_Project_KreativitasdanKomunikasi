import { Form, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Service = {
    id: number;
    title: string;
    category: string;
    description: string;
    price: number;
    delivery_days: number;
    revisions: number;
    is_active: boolean;
};

type Props = { services: Service[] };

export default function CreatorServices() {
    const { services } = usePage<Props>().props;

    return (
        <div className="p-6 lg:p-8">
            <h1 className="mb-2 text-2xl font-bold">Layanan Saya</h1>
            <p className="mb-6 text-muted-foreground">Kelola jasa yang Anda tawarkan ke pembeli.</p>

            <Card className="mb-8">
                <CardHeader><CardTitle>Tambah Layanan</CardTitle></CardHeader>
                <CardContent>
                    <Form action="/creator/services" method="post" className="grid gap-4 md:grid-cols-2">
                        <div><Label>Judul</Label><Input name="title" required /></div>
                        <div><Label>Kategori</Label><Input name="category" required /></div>
                        <div className="md:col-span-2"><Label>Deskripsi</Label><Textarea name="description" required rows={3} /></div>
                        <div><Label>Harga (IDR)</Label><Input name="price" type="number" required /></div>
                        <div><Label>Hari pengerjaan</Label><Input name="delivery_days" type="number" defaultValue={5} required /></div>
                        <div><Label>Revisi</Label><Input name="revisions" type="number" defaultValue={2} required /></div>
                        <Button type="submit">Simpan Layanan</Button>
                    </Form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {services.map((s) => (
                    <Card key={s.id}>
                        <CardContent className="flex justify-between pt-6">
                            <div>
                                <h3 className="font-semibold">{s.title}</h3>
                                <p className="text-sm text-muted-foreground">{s.category} · Rp {s.price.toLocaleString('id-ID')}</p>
                                <p className="mt-1 text-sm">{s.description}</p>
                            </div>
                            <span className={`text-xs ${s.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                {s.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
