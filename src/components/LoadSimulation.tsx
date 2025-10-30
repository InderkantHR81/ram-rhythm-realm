import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MemoryBlock, Process, MemoryStats, AllocationAlgorithm } from "@/types/memory";

interface Simulation {
  id: string;
  name: string;
  algorithm: AllocationAlgorithm;
  total_memory: number;
  memory_blocks: MemoryBlock[];
  processes: Process[];
  stats: MemoryStats;
  created_at: string;
}

interface LoadSimulationProps {
  onLoad: (simulation: Omit<Simulation, "id" | "created_at">) => void;
}

export const LoadSimulation = ({ onLoad }: LoadSimulationProps) => {
  const [open, setOpen] = useState(false);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSimulations = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to load simulations");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("simulations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load simulations");
      console.error(error);
    } else {
      setSimulations((data as any[]) || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("simulations").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete simulation");
      console.error(error);
    } else {
      toast.success("Simulation deleted");
      fetchSimulations();
    }
  };

  const handleLoad = (simulation: Simulation) => {
    onLoad({
      name: simulation.name,
      algorithm: simulation.algorithm,
      total_memory: simulation.total_memory,
      memory_blocks: simulation.memory_blocks,
      processes: simulation.processes,
      stats: simulation.stats,
    });
    toast.success(`Loaded "${simulation.name}"`);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      fetchSimulations();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Load
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Load Simulation</DialogTitle>
          <DialogDescription>
            Select a saved simulation to load
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : simulations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No saved simulations found
            </div>
          ) : (
            <div className="space-y-2">
              {simulations.map((sim) => (
                <div
                  key={sim.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => handleLoad(sim)}>
                    <h3 className="font-semibold">{sim.name}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      Algorithm: {sim.algorithm} • Memory: {sim.total_memory} KB • Processes: {sim.processes.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(sim.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sim.id);
                    }}
                    className="ml-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};