import Hero from "../../sections/hero";
import AboutUs from "../../sections/about-us";
import Explore from "../../sections/explore";
import BlogSection from "../../sections/blogs-section";
import ServicesSection from "../../sections/services-section";

export default function WebApp () {
  return (
    <>
      <Hero />
      <div className="relative">
        <AboutUs />
        <div className="gradient-03 z-[0]" />
        <Explore/>
      </div>
      <div className="relative">
        <BlogSection />
        <div className="gradient-03 z-[0]" />
        <ServicesSection />
      </div>
    </>
  );
};
