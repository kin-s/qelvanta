"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, UploadCloud, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function DataManagement() {
  const [deleteConfirm, setDeleteConfirm] = useState("");

  function handleExport() {
    toast.success("Data export initiated (simulated)", {
      description: "A ZIP file would download in production.",
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-lg font-semibold">Data Management</h2>
        <p className="text-sm text-muted">Export, import, or delete your workspace data.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Download className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-medium">Export Data</h3>
          <p className="text-xs text-muted mt-1 mb-4">Download all your business data in JSON format.</p>
          <Button variant="secondary" size="sm" onClick={handleExport}>Export JSON</Button>
        </div>

        <div className="rounded-lg border border-border p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-info/10 text-info">
            <UploadCloud className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-medium">Import Preview</h3>
          <p className="text-xs text-muted mt-1 mb-4">Upload a previous backup to preview changes.</p>
          <Button variant="secondary" size="sm" onClick={() => toast("Import validation runs in backend phase")}>Select File</Button>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-danger">Danger Zone</h3>
              <p className="text-xs text-muted mt-1 mb-4">
                Permanently delete this workspace and all associated data. 
                This action cannot be undone.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Delete Workspace</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your workspace, including all inventory, sales, customers, and financial records.
                      Please type <strong>DELETE</strong> to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-2">
                    <Input 
                      value={deleteConfirm} 
                      onChange={(e) => setDeleteConfirm(e.target.value)} 
                      placeholder="Type DELETE to confirm" 
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      disabled={deleteConfirm !== "DELETE"}
                      onClick={() => toast.error("Workspace deletion is disabled in the demo")}
                      className="bg-danger hover:bg-danger/90 text-white"
                    >
                      Delete Workspace
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}