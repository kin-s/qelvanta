"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function RegionalSettings() {
  const [isSaving, setIsSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Regional preferences updated");
    }, 600);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-lg font-semibold">Regional & Currency</h2>
        <p className="text-sm text-muted">Set your default timezone, currency, and tax rules.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Base Reporting Currency</Label>
            <Select defaultValue="USD">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="America/New_York">
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Africa/Nairobi">Nairobi</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select defaultValue="MM/DD/YYYY">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number Format</Label>
            <Select defaultValue="en-US">
              <option value="en-US">1,234.56</option>
              <option value="de-DE">1.234,56</option>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Default Tax Rate</Label>
            <Select defaultValue="10">
              <option value="0">0% (Tax Exempt)</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="20">20% (VAT)</option>
            </Select>
            <p className="text-[10px] text-muted mt-1">
              Note: Actual tax compliance and jurisdiction-specific logic must be handled by the backend.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}