"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { updateOrganization } from "@/actions/settings";
import { uploadImage } from "@/actions/upload";
import { Loader2, Upload } from "lucide-react";

export function BusinessSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImage(formData);
    setIsUploading(false);

    if (res.error) {
      toast.error(res.error);
    } else if (res.url) {
      setLogoUrl(res.url);
      toast.success("Image uploaded to Cloudflare R2!");
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const currency = formData.get("currency") as string;

    const res = await updateOrganization({ name, currency, logoUrl: logoUrl || undefined });
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
            <Label>Business Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-border bg-surface text-muted">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-cover rounded-md" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>
              <div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                <p className="mt-1 text-xs text-muted">
                  {isUploading ? "Uploading to R2..." : "Upload a PNG or JPG (Max 2MB)"}
                </p>
              </div>
            </div>
          </div>

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
          <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : null}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}