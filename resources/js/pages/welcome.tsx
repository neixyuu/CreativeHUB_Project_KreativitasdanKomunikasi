import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    MessageSquare,
    Palette,
    Shield,
    Sparkles,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
    {
        icon: Users,
        title: 'Temukan Kreator',
        description: 'Jelajahi desainer, ilustrator, dan kreator digital profesional sesuai kebutuhan proyek Anda.',
    },
    {
        icon: Palette,
        title: 'Ajukan Komisi',
        description: 'Buat pesanan jasa dengan detail jelas, budget, dan tenggat waktu yang transparan.',
    },
    {
        icon: MessageSquare,
        title: 'Chat Terintegrasi',
        description: 'Komunikasi langsung dengan kreator — pesan diperbarui otomatis untuk diskusi brief dan progress.',
    },
    {
        icon: Shield,
        title: 'Aman & Terkelola',
        description: 'Kelola pesanan, favorit, dan laporan dalam satu platform yang rapi.',
    },
];

const steps = [
    { step: '1', text: 'Daftar akun pembeli atau kreator' },
    { step: '2', text: 'Masuk ke platform setelah verifikasi email' },
    { step: '3', text: 'Jelajahi, chat, dan mulai komisi kreatif Anda' },
];

export default function WelcomePage() {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />

            <div className="container relative mx-auto px-4 py-16 md:py-24">
                <section className="mx-auto max-w-3xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Selamat datang di Creative Hub
                        </span>
                    </div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        Platform{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Jasa Kreatif Digital
                        </span>{' '}
                        untuk Anda
                    </h1>
                    <p className="mb-10 text-lg text-muted-foreground md:text-xl">
                        Creative Hub menghubungkan pembeli dan kreator profesional. Untuk
                        melanjutkan dan menggunakan seluruh fitur website, silakan masuk
                        dengan akun Anda atau daftar terlebih dahulu jika belum memiliki akun.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            asChild
                            className="h-12 bg-gradient-to-r from-primary to-secondary px-8 hover:opacity-90"
                        >
                            <Link href="/login">
                                Masuk ke Website
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="h-12 px-8">
                            <Link href="/register">Buat Akun Baru</Link>
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        Belum punya akun? Daftar gratis sebagai pembeli atau kreator.
                    </p>
                </section>

                <section className="mx-auto mt-20 max-w-4xl">
                    <h2 className="mb-8 text-center text-2xl font-bold">Cara memulai</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        {steps.map((item) => (
                            <Card key={item.step} className="border-border/60 text-center">
                                <CardContent className="pt-6">
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                        {item.step}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mx-auto mt-20 max-w-5xl">
                    <h2 className="mb-8 text-center text-2xl font-bold">Apa yang Anda dapatkan?</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {features.map((f) => (
                            <Card key={f.title} className="border-border/60">
                                <CardContent className="flex gap-4 pt-6">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                        <f.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold">{f.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {f.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mx-auto mt-20 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
                    <h2 className="mb-3 text-xl font-bold">Siap memulai?</h2>
                    <p className="mb-6 text-muted-foreground">
                        Login untuk membuka beranda, jelajahi kreator, dan kelola komisi Anda.
                    </p>
                    <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                        <Link href="/login">Lanjutkan dengan Login</Link>
                    </Button>
                </section>
            </div>
        </div>
    );
}
