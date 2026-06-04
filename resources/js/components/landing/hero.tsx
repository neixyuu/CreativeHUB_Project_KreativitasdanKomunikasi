import { Link } from '@inertiajs/react';
import { ArrowRight, Briefcase, Search, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    stats: {
        creators: number;
        projects: number;
        avg_rating: number;
    };
};

export function Hero({ stats }: Props) {
    const showStats =
        stats.creators > 0 || stats.projects > 0 || stats.avg_rating > 0;

    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative container mx-auto px-4 py-20 md:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Platform Kreator Digital
                        </span>
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                        Find Creative Talent &{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Start Commission
                        </span>{' '}
                        Easily
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
                        Platform untuk menemukan kreator digital terbaik. Dari desain
                        grafis hingga ilustrasi, temukan talenta kreatif yang sesuai
                        dengan kebutuhanmu.
                    </p>

                    <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            asChild
                            className="h-12 bg-gradient-to-r from-primary to-secondary px-8 hover:opacity-90"
                        >
                            <Link href="/explore">
                                <Search className="mr-2 h-5 w-5" />
                                Find Creator
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="h-12 px-8">
                            <Link href="/commission/create">
                                Start Commission
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {showStats && (
                        <div className="mx-auto grid max-w-lg grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground md:text-3xl">
                                    <Users className="h-6 w-6 text-primary" />
                                    {stats.creators}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Active Creators
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground md:text-3xl">
                                    <Briefcase className="h-6 w-6 text-secondary" />
                                    {stats.projects}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Projects Done
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground md:text-3xl">
                                    <Star className="h-6 w-6 fill-primary text-primary" />
                                    {stats.avg_rating > 0 ? stats.avg_rating : '—'}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Avg Rating
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
