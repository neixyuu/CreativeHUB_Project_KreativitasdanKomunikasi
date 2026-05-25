import { Form, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
    const [editingId, setEditingId] = useState<number | null>(null);

    const deleteService = (id: number) => {
        if (window.confirm('Hapus layanan ini?')) {
            router.delete(`/creator/services/${id}`);
        }
    };

    const toggleActive = (service: Service) => {
        router.patch(`/creator/services/${service.id}`, {
            ...service,
            is_active: !service.is_active,
        });
    };

    return (
        <div className="p-6 lg:p-8">
            <h1 className="mb-2 text-2xl font-bold">Layanan Saya</h1>
            <p className="mb-6 text-muted-foreground">Kelola jasa yang Anda tawarkan ke pembeli.</p>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Tambah Layanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action="/creator/services" method="post" className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Judul</Label>
                            <Input name="title" required />
                        </div>
                        <div>
                            <Label>Kategori</Label>
                            <Input name="category" required />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Deskripsi</Label>
                            <Textarea name="description" required rows={3} />
                        </div>
                        <div>
                            <Label>Harga (IDR)</Label>
                            <Input name="price" type="number" required />
                        </div>
                        <div>
                            <Label>Hari pengerjaan</Label>
                            <Input name="delivery_days" type="number" defaultValue={5} required />
                        </div>
                        <div>
                            <Label>Revisi</Label>
                            <Input name="revisions" type="number" defaultValue={2} required />
                        </div>
                        <Button type="submit">Simpan Layanan</Button>
                    </Form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {services.length === 0 && (
                    <p className="text-center text-muted-foreground">Belum ada layanan. Tambahkan yang pertama.</p>
                )}
                {services.map((s) => (
                    <Card key={s.id}>
                        <CardContent className="pt-6">
                            {editingId === s.id ? (
                                <Form
                                    action={`/creator/services/${s.id}`}
                                    method="post"
                                    className="grid gap-4 md:grid-cols-2"
                                    onSuccess={() => setEditingId(null)}
                                >
                                    <input type="hidden" name="_method" value="patch" />
                                    <div>
                                        <Label>Judul</Label>
                                        <Input name="title" defaultValue={s.title} required />
                                    </div>
                                    <div>
                                        <Label>Kategori</Label>
                                        <Input name="category" defaultValue={s.category} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label>Deskripsi</Label>
                                        <Textarea
                                            name="description"
                                            defaultValue={s.description}
                                            required
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label>Harga (IDR)</Label>
                                        <Input
                                            name="price"
                                            type="number"
                                            defaultValue={s.price}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Hari pengerjaan</Label>
                                        <Input
                                            name="delivery_days"
                                            type="number"
                                            defaultValue={s.delivery_days}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Revisi</Label>
                                        <Input
                                            name="revisions"
                                            type="number"
                                            defaultValue={s.revisions}
                                            required
                                        />
                                    </div>
                                    <input type="hidden" name="is_active" value={s.is_active ? '1' : '0'} />
                                    <div className="flex gap-2 md:col-span-2">
                                        <Button type="submit">Simpan</Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div>
                                        <h3 className="font-semibold">{s.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {s.category} · Rp {s.price.toLocaleString('id-ID')}
                                        </p>
                                        <p className="mt-1 text-sm">{s.description}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {s.delivery_days} hari · {s.revisions} revisi
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`text-xs ${s.is_active ? 'text-green-600' : 'text-muted-foreground'}`}
                                        >
                                            {s.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleActive(s)}
                                        >
                                            {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingId(s.id)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive"
                                            onClick={() => deleteService(s.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
