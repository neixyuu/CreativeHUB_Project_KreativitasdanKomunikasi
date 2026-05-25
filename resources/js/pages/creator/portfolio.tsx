import { Form, usePage } from '@inertiajs/react';
import { Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type PortfolioItem = {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
};

type Props = {
    portfolio: PortfolioItem[];
};

export default function PortfolioPage() {
    const { portfolio } = usePage<Props>().props;
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Portfolio</h1>
                    <p className="text-muted-foreground">Tampilkan karya terbaik Anda</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Portfolio</DialogTitle>
                        </DialogHeader>
                        <Form
                            action="/creator/portfolio"
                            method="post"
                            className="grid gap-4"
                            onSuccess={() => setOpen(false)}
                        >
                            <div>
                                <Label>Judul *</Label>
                                <Input name="title" required />
                            </div>
                            <div>
                                <Label>Deskripsi</Label>
                                <Textarea name="description" rows={3} />
                            </div>
                            <div>
                                <Label>URL gambar *</Label>
                                <Input
                                    name="image_url"
                                    type="url"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Simpan</Button>
                            </DialogFooter>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {portfolio.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center py-16 text-center">
                        <Image className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Belum ada item portfolio.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolio.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="aspect-[4/3] w-full object-cover"
                            />
                            <CardContent className="p-4">
                                <h3 className="font-semibold">{item.title}</h3>
                                {item.description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                                <Form
                                    action={`/creator/portfolio/${item.id}`}
                                    method="post"
                                    className="mt-3"
                                >
                                    <input type="hidden" name="_method" value="DELETE" />
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive"
                                    >
                                        <Trash2 className="mr-1 h-4 w-4" />
                                        Hapus
                                    </Button>
                                </Form>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
