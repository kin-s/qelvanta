import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border bg-gradient-to-b from-background to-surface">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 sm:py-24">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Run smarter. Grow faster.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted">
          Start free. No credit card. See what one operating system can do for
          your business in under ten minutes.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">
              Start for free
              <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Talk to sales</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}