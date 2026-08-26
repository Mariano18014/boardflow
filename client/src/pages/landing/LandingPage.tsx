import { CtaSection } from "@/components/modules/landing/CtaSection";
import { FeaturesSection } from "@/components/modules/landing/FeaturesSection";
import { HeroSection } from "@/components/modules/landing/HeroSection";
import { LandingHeader } from "@/components/modules/landing/LandingHeader";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
    </div>
  );
}
