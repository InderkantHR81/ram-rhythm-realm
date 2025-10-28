import { useState } from "react";
import { MemoryBlock, Process, AllocationAlgorithm, MemoryStats } from "@/types/memory";
import { allocateMemory, deallocateMemory, calculateFragmentation } from "@/utils/memoryAlgorithms";
import { MemoryVisualizer } from "@/components/MemoryVisualizer";
import { ProcessControl } from "@/components/ProcessControl";
import { ProcessList } from "@/components/ProcessList";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";
import { MemoryStats as StatsDisplay } from "@/components/MemoryStats";
import { Button } from "@/components/ui/button";
import { RotateCcw, Cpu } from "lucide-react";
import { toast } from "sonner";

const TOTAL_MEMORY = 1024; // KB

const initialBlocks: MemoryBlock[] = [
  { id: "block-1", start: 0, size: 256, isFree: true },
  { id: "block-2", start: 256, size: 512, isFree: true },
  { id: "block-3", start: 768, size: 256, isFree: true },
];

const Index = () => {
  const [blocks, setBlocks] = useState<MemoryBlock[]>(initialBlocks);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<AllocationAlgorithm>("first-fit");

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
          
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
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
