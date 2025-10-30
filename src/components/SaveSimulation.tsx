import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MemoryBlock, Process, MemoryStats, AllocationAlgorithm } from "@/types/memory";

interface SaveSimulationProps {
  algorithm: AllocationAlgorithm;
  totalMemory: number;
  memoryBlocks: MemoryBlock[];
  processes: Process[];
  stats: MemoryStats;
}

export const SaveSimulation = ({ algorithm, totalMemory, memoryBlocks, processes, stats }: SaveSimulationProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the simulation");
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to save simulations");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("simulations").insert({
      user_id: user.id,
      name: name.trim(),
      algorithm,
      total_memory: totalMemory,
      memory_blocks: memoryBlocks as any,
      processes: processes as any,
      stats: stats as any,
    });

    if (error) {
      toast.error("Failed to save simulation");
      console.error(error);
    } else {
      toast.success("Simulation saved successfully!");
      setName("");
      setOpen(false);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Simulation</DialogTitle>
          <DialogDescription>
            Give your simulation a name to save it for later
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Simulation Name</Label>
            <Input
              id="name"
              placeholder="e.g., First Fit Test"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};