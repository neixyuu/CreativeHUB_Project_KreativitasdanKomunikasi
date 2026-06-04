import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Brush,
    Globe,
    Layout,
    Palette,
    PenTool,
    Video,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
    {
        name: 'Graphic Designer',
        description: 'Logo, branding, marketing materials',
        icon: Palette,
        color: 'from-blue-500 to-indigo-600',
    },
    {
        name: 'Illustrator',
        description: 'Digital art, character design, comics',
        icon: PenTool,
        color: 'from-purple-500 to-pink-600',
    },
    {
        name: 'Video Editor',
        description: 'Video editing, motion graphics',
        icon: Video,
        color: 'from-red-500 to-orange-600',
    },
    {
        name: 'Web Designer',
        description: 'Website design, landing pages',
        icon: Globe,
        color: 'from-emerald-500 to-teal-600',
    },
    {
        name: 'UI/UX Designer',
        description: 'App design, user experience',
        icon: Layout,
        color: 'from-cyan-500 to-blue-600',
    },
    {
        name: 'Digital Artist',
        description: 'Digital paintings, concept art',
        icon: Brush,
        color: 'from-fuchsia-500 to-purple-600',
    },
];

export function Categories() {
    return (
        <section className="bg-muted/30 py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Explore{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Categories
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Temukan kreator berdasarkan keahlian mereka.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            href={`/explore?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            key={category.name}
                        >
                            <Card className="group cursor-pointer border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}
                                        >
                                            <category.icon className="h-7 w-7 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-primary">
                                                {category.name}
                                            </h3>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                {category.description}
                                            </p>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
