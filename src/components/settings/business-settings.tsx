"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { updateOrganization } from "@/actions/settings";

export function BusinessSettings() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const currency = formData.get("currency") as string;

    const res = await updateOrganization({ name, currency });
    setIsSaving(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Business settings saved to database");
    }
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
            <Input name="name" defaultValue="QELVANTA Demo Inc." required />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label>Business Description</Label>
            <Textarea name="description" defaultValue="A premium demonstration of the QELVANTA business operating system." rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input name="email" type="email" defaultValue="hello@qelvanta.example" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input name="phone" type="tel" defaultValue="+1 555 0100" />
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select name="industry" defaultValue="retail">
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="services">Services</option>
              <option value="tech">Technology</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Base Currency</Label>
            <Select name="currency" defaultValue="USD">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </Select>
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