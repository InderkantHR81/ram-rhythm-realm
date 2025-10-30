import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryBlock, Process, AllocationAlgorithm, MemoryStats } from "@/types/memory";
import { allocateMemory, deallocateMemory, calculateFragmentation } from "@/utils/memoryAlgorithms";
import { MemoryVisualizer } from "@/components/MemoryVisualizer";
import { ProcessControl } from "@/components/ProcessControl";
import { ProcessList } from "@/components/ProcessList";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";
import { MemoryStats as StatsDisplay } from "@/components/MemoryStats";
import { SaveSimulation } from "@/components/SaveSimulation";
import { LoadSimulation } from "@/components/LoadSimulation";
import { Button } from "@/components/ui/button";
import { RotateCcw, Cpu, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TOTAL_MEMORY = 1024; // KB

const initialBlocks: MemoryBlock[] = [
  { id: "block-1", start: 0, size: 256, isFree: true },
  { id: "block-2", start: 256, size: 512, isFree: true },
  { id: "block-3", start: 768, size: 256, isFree: true },
];

const Index = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<MemoryBlock[]>(initialBlocks);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<AllocationAlgorithm>("first-fit");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddProcess = (name: string, size: number) => {
    if (size > TOTAL_MEMORY) {
      toast.error("Process size exceeds total memory!");
      return;
    }

    const newProcess: Process = {
      id: `process-${Date.now()}`,
      name,
      size,
      allocated: false,
    };

    const result = allocateMemory(blocks, newProcess, algorithm);

    if (result.success) {
      setBlocks(result.blocks);
      setProcesses([...processes, { ...newProcess, allocated: true }]);
      toast.success(`Process ${name} allocated using ${algorithm}`, {
        description: `Allocated ${size} KB successfully`,
      });
    } else {
      setProcesses([...processes, newProcess]);
      toast.error(`Failed to allocate process ${name}`, {
        description: "No suitable memory block found",
      });
    }
  };

  const handleDeallocate = (processId: string) => {
    const newBlocks = deallocateMemory(blocks, processId);
    setBlocks(newBlocks);
    setProcesses(processes.filter((p) => p.id !== processId));
    toast.info("Process deallocated", {
      description: "Memory has been freed",
    });
  };

  const handleReset = () => {
    setBlocks(initialBlocks);
    setProcesses([]);
    toast.info("Memory reset", {
      description: "All processes cleared",
    });
  };

  const handleLoad = (simulation: any) => {
    setBlocks(simulation.memory_blocks);
    setProcesses(simulation.processes);
    setAlgorithm(simulation.algorithm);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.info("Signed out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Cpu className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const stats: MemoryStats = {
    totalMemory: TOTAL_MEMORY,
    usedMemory: blocks.filter((b) => !b.isFree).reduce((sum, b) => sum + b.size, 0),
    freeMemory: blocks.filter((b) => b.isFree).reduce((sum, b) => sum + b.size, 0),
    internalFragmentation: 0,
    externalFragmentation: calculateFragmentation(blocks, TOTAL_MEMORY).external,
    allocatedProcesses: processes.filter((p) => p.allocated).length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg glow-effect">
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OS Memory Manager
              </h1>
              <p className="text-muted-foreground">
                Visualize memory allocation algorithms in real-time
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {user ? (
              <>
                <SaveSimulation
                  algorithm={algorithm}
                  totalMemory={TOTAL_MEMORY}
                  memoryBlocks={blocks}
                  processes={processes}
                  stats={stats}
                />
                <LoadSimulation onLoad={handleLoad} />
                <Button onClick={handleSignOut} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline">
                Sign In
              </Button>
            )}
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Memory Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <MemoryVisualizer blocks={blocks} totalMemory={TOTAL_MEMORY} />
            </div>
            
            <StatsDisplay stats={stats} />
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            <AlgorithmSelector selected={algorithm} onSelect={setAlgorithm} />
            <ProcessControl onAddProcess={handleAddProcess} />
            <ProcessList processes={processes} onDeallocate={handleDeallocate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
