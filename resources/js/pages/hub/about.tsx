import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-16">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Tentang Creative Hub</h1>
                    <p className="text-muted-foreground">Marketplace jasa kreatif untuk pembeli & kreator</p>
                </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                    Creative Hub menghubungkan pembeli yang membutuhkan desain, ilustrasi, video, dan layanan
                    kreatif lainnya dengan kreator profesional. Kelola komisi, chat dengan pembaruan otomatis, dan pantau
                    pesanan dalam satu platform.
                </p>
                <p>
                    Pembeli dapat menjelajahi kreator, menyimpan favorit, mengajukan komisi, dan berkomunikasi
                    langsung. Kreator dapat mengelola layanan, portfolio, dan memperbarui status pesanan.
                    Chat diperbarui otomatis setiap beberapa detik (tanpa perlu server WebSocket terpisah).
                </p>
            </div>
            <div className="mt-10 flex gap-3">
                <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                    <Link href="/explore">Jelajahi Kreator</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/contact">Hubungi kami</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/register">Daftar</Link>
                </Button>
            </div>
        </div>
    );
}
