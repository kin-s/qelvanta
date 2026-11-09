import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(198,166,107,0.15),transparent_70%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-32">
        <div>
          <Badge variant="accent" className="mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            New · AI-powered business intelligence
          </Badge>

          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Everything your business needs.
            <br />
            All in one place.
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
            Manage your sales, inventory, customers, finances and team with one intelligent platform built to help your business operate better and grow faster.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#features">Explore Features</a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted">
            No credit card required · Free forever plan available
          </p>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}