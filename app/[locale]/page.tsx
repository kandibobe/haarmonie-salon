import { HeroSection } from '@components/sections/HeroSection';
import { StatsSection } from '@components/sections/StatsSection';
import { ServicesSection } from '@components/sections/ServicesSection';
import { AboutSection } from '@components/sections/AboutSection';
import { ProcessSection } from '@components/sections/ProcessSection';
import { ProjectsSection } from '@components/sections/ProjectsSection';
import { TestimonialsSection } from '@components/sections/TestimonialsSection';
import { BookingSection } from '@components/sections/BookingSection';
import { ContactSection } from '@components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <ProjectsSection teaser />
      <TestimonialsSection />
      <BookingSection />
      <ContactSection />
    </>
  );
}
