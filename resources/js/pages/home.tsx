import { usePage } from '@inertiajs/react';
import { Categories } from '@/components/landing/categories';
import { FeaturedCreators } from '@/components/landing/featured-creators';
import { Hero } from '@/components/landing/hero';

type Creator = {
    id: number;
    name: string;
    username: string;
    avatar: string;
    specialty: string;
    location: string | null;
    rating: number;
    reviews: number;
    starting_price: number;
    skills: string[];
    portfolio: string | null;
};

type Props = {
    featuredCreators: { data: Creator[] };
    stats: {
        creators: number;
        projects: number;
        avg_rating: number;
    };
};

export default function Home() {
    const { featuredCreators, stats } = usePage<Props>().props;

    return (
        <>
            <Hero stats={stats} />
            <Categories />
            <FeaturedCreators creators={featuredCreators.data ?? []} />
        </>
    );
}
