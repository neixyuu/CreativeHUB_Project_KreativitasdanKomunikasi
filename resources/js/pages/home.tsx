import { usePage } from '@inertiajs/react';
import { Hero } from '@/components/landing/hero';
import { Categories } from '@/components/landing/categories';
import { FeaturedCreators } from '@/components/landing/featured-creators';

type Props = {
    platformStats: {
        creators: number;
        projects: number;
        avgRating: number;
    };
    categoryCounts: Array<{
        name: string;
        slug: string;
        count: number;
    }>;
};

const defaultStats = { creators: 0, projects: 0, avgRating: 0 };

export default function Home() {
    const { platformStats = defaultStats, categoryCounts = [] } = usePage<Props>().props;

    return (
        <>
            <Hero platformStats={platformStats} />
            <Categories categoryCounts={categoryCounts} />
            <FeaturedCreators />
        </>
    );
}
