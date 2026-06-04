import { Form, router, usePage } from '@inertiajs/react';
import { Image, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

    const handleDelete = (id: number) => {
        router.delete(`/creator/portfolio/${id}`, { preserveScroll: true });
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold lg:text-3xl">Portfolio</h1>
                <p className="text-muted-foreground">
                    Tampilkan karya terbaik Anda kepada calon klien
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Tambah Karya
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        action="/creator/portfolio"
                        method="post"
                        className="grid gap-4 md:grid-cols-2"
                        resetOnSuccess
                    >
                        <div className="md:col-span-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input id="title" name="title" required />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="image_url">URL Gambar</Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                type="url"
                                placeholder="https://..."
                                required
                            />
                        </div>
                        <Button type="submit">Simpan</Button>
                    </Form>
                </CardContent>
            </Card>

            {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolio.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <div className="relative aspect-[4/3] bg-muted">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Hapus karya?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                &quot;{item.title}&quot; akan
                                                dihapus dari portfolio.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Batal
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold">{item.title}</h3>
                                {item.description && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center">
                    <Image className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-xl font-semibold">
                        Portfolio masih kosong
                    </h3>
                    <p className="mx-auto max-w-md text-muted-foreground">
                        Tambahkan karya pertama Anda menggunakan formulir di
                        atas.
                    </p>
                </div>
            )}
        </div>
    );
}
