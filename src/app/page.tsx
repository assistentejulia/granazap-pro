import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { WebFeatureSection } from "@/components/landing/web-feature-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { TechSection } from "@/components/landing/tech-section";
import { ExpansionSection } from "@/components/landing/expansion-section";
import { SecuritySection } from "@/components/landing/security-section";
import { CtaFooter } from "@/components/landing/cta-footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Navbar />
      <HeroSection />
      <WebFeatureSection />
      <ProblemSection />
      <SolutionSection />
      <TechSection />
      <ExpansionSection />
      <SecuritySection />
      <CtaFooter />
    </main>
  );
}