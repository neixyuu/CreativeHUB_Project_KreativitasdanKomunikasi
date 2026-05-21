import { Hero } from '@/components/landing/hero';
import { Categories } from '@/components/landing/categories';
import { FeaturedCreators } from '@/components/landing/featured-creators';

export default function Home() {
    return (
        <>
            <Hero />
            <Categories />
            <FeaturedCreators />
        </>
    );
}
