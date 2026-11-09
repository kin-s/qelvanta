"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Smartphone, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuditLog } from "./audit-log";

export function SecuritySettings() {
  const [isChanging, setIsChanging] = useState(false);

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setIsChanging(true);
    setTimeout(() => {
      setIsChanging(false);
      toast.success("Password updated (simulated)");
    }, 600);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-lg font-semibold">Security & Audit</h2>
        <p className="text-sm text-muted">Manage account security and view recent activity.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Key className="h-4 w-4 text-muted" /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" variant="secondary" disabled={isChanging}>
            {isChanging ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted" /> Two-Factor Authentication
        </h3>
        <div className="rounded-lg border border-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-medium">2FA is currently disabled</p>
            <p className="text-xs text-muted">Add an extra layer of security to your account.</p>
          </div>
          <Button variant="outline" onClick={() => toast("2FA setup available in backend phase")}>
            Enable 2FA
          </Button>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <AuditLog />
      </div>
    </div>
  );
}