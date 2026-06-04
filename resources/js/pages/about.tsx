import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function About() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-16">
            <Head title="About" />
            <h1 className="mb-4 text-3xl font-bold">Tentang Creative Hub</h1>
            <p className="mb-6 text-muted-foreground">
                Creative Hub menghubungkan pembeli dengan kreator digital di
                Indonesia — dari desain grafis hingga ilustrasi dan layanan
                kreatif lainnya.
            </p>
            <Button asChild>
                <Link href="/explore">Jelajahi Kreator</Link>
            </Button>
        </div>
    );
}
