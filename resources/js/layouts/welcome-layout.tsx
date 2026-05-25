import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-border/40 bg-background/80 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Creative Hub
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Masuk</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                            <Link href="/register">Daftar</Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Creative Hub — Platform jasa kreatif digital
            </footer>
        </div>
    );
}
