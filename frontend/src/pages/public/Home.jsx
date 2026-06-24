import HeroSection from "@/components/home/HeroSection";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedRooms />
      <FacilitiesSection />
      <WhyChooseUsSection />
      <GallerySection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;