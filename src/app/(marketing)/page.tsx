import { Hero } from "@/components/marketing/hero";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { ProductWalkthrough } from "@/components/marketing/product-walkthrough";
import { Industries } from "@/components/marketing/industries";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { FaqPreview } from "@/components/marketing/faq-preview";
import { FinalCta } from "@/components/marketing/final-cta";

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ProblemSolution />
      <FeatureShowcase />
      <ProductWalkthrough />
      <Industries />
      <PricingPreview />
      <FaqPreview />
      <FinalCta />
    </>
  );
}