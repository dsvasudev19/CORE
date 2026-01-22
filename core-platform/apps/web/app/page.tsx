import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { IntegrationsSection } from "@/components/integrations-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingSection } from "@/components/pricing-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <StatsSection />
        <section id="integrations">
          <IntegrationsSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
