import PageLayout from '../components/PageLayout';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import OffersCarousel from '../components/OffersCarousel';
import ProductGrid from '../components/ProductGrid';
import Farmers from '../components/Farmers';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <CategoryGrid />
      <OffersCarousel />
      <ProductGrid />
      <Farmers />
      <Testimonials />
      <Newsletter />
    </PageLayout>
  );
}
