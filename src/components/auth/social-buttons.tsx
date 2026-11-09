"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12.18v3.7h5.27c-.23 1.4-1.68 4.13-5.27 4.13a5.94 5.94 0 1 1 0-11.86 5.36 5.36 0 0 1 3.77 1.46l2.58-2.49A9.5 9.5 0 1 0 12.18 21.5c5.48 0 9.1-3.85 9.1-9.27 0-.62-.06-1.1-.13-1.63Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M16.7 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.4.6-.9.9-1.4 1.4-2.4-3.7-1.4-3.8-5.5-3.8-5.6ZM14.3 5.3c.7-.9 1.2-2 1.1-3.3-1 .1-2.4.7-3.1 1.6-.6.7-1.2 1.9-1.1 3.1 1.2.1 2.4-.6 3.1-1.4Z" />
    </svg>
  );
}

function handleDemo() {
  toast("Social sign-in available at launch", {
    description: "Real OAuth arrives with the backend phase.",
  });
}

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="secondary" onClick={handleDemo}>
        <GoogleIcon /> Google
      </Button>
      <Button type="button" variant="secondary" onClick={handleDemo}>
        <AppleIcon /> Apple
      </Button>
    </div>
  );
}