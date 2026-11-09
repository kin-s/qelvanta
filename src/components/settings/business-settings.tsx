"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function BusinessSettings() {
  const [isSaving, setIsSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Business settings saved");
    }, 600);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-lg font-semibold">Business Details</h2>
        <p className="text-sm text-muted">Update your company information and contact details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Business Name</Label>
            <Input defaultValue="BIZFLOW Demo Inc." />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label>Business Description</Label>
            <Textarea defaultValue="A premium demonstration of the BIZFLOW business operating system." rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" defaultValue="hello@bizflow.example" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input type="tel" defaultValue="+1 555 0100" />
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select defaultValue="retail">
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="services">Services</option>
              <option value="tech">Technology</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input type="url" defaultValue="https://bizflow.example" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Physical Address</Label>
            <Input defaultValue="123 Commerce St, New York, NY 10001" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}