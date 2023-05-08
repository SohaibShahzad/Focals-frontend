import Hero from "../sections/hero";
import AboutUs from "../sections/about-us";
import Explore from "../sections/explore";
import BlogSection from "../sections/blogs-section";
import ServicesSection from "../sections/services-section";
import ContactSection from "../sections/contactForm";
import TestimonialSection from "../sections/testimonial-section";

export default function WebApp() {
  return (
    <>
      <div className="relative">
        <div className="gradient-03 z-[0]" />
        <Hero />
        <div className="gradient-02 z-[0]" />
      </div>
      <div className="relative">
        <ServicesSection />
        <div className="gradient-02 z-[0]" />
        <Explore />
      </div>
      <div className="relative">
        <BlogSection />
        <div className="gradient-03 z-[0]" />
        <TestimonialSection />
      </div>
      <div>
        <ContactSection />
      </div>
    </>
  );
}
