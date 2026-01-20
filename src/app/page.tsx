import { Navbar } from "@/components/landing/navbar";
import { NewHeroSection } from "@/components/landing/new-hero-section";
import { FeaturesGridSection } from "@/components/landing/features-grid-section";
import { InvestmentShowcaseSection } from "@/components/landing/investment-showcase-section";
import { NewPricingSection } from "@/components/landing/new-pricing-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { CtaFooter } from "@/components/landing/cta-footer";

export default function LandingPage() {
  return (
    <main id="inicio" className="min-h-screen bg-background text-foreground selection:bg-green-500/30">
      <Navbar />
      <NewHeroSection />
      <FeaturesGridSection />
      <InvestmentShowcaseSection />
      <NewPricingSection />
      <CtaFooter />
    </main>
  );
}