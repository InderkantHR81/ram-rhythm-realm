import { MemoryStats as Stats } from "@/types/memory";
import { Card } from "@/components/ui/card";
import { Activity, HardDrive, PieChart } from "lucide-react";

interface MemoryStatsProps {
  stats: Stats;
}

export const MemoryStats = ({ stats }: MemoryStatsProps) => {
  const utilizationPercent = (stats.usedMemory / stats.totalMemory) * 100;
  const externalFragPercent = (stats.externalFragmentation / stats.totalMemory) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        Memory Statistics
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Memory Utilization</span>
            <span className="font-mono font-semibold">{utilizationPercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${utilizationPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              <span>Used Memory</span>
            </div>
            <div className="text-2xl font-bold font-mono">
              {stats.usedMemory} KB
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PieChart className="h-4 w-4" />
              <span>Free Memory</span>
            </div>
            <div className="text-2xl font-bold font-mono text-memory-free">
              {stats.freeMemory} KB
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">External Fragmentation</span>
            <span className="font-mono text-memory-external">
              {stats.externalFragmentation} KB ({externalFragPercent.toFixed(1)}%)
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Allocated Processes</span>
            <span className="font-mono font-semibold">{stats.allocatedProcesses}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
