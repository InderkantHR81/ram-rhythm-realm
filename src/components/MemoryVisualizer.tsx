import { MemoryBlock } from "@/types/memory";
import { cn } from "@/lib/utils";

interface MemoryVisualizerProps {
  blocks: MemoryBlock[];
  totalMemory: number;
}

export const MemoryVisualizer = ({ blocks, totalMemory }: MemoryVisualizerProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Memory Layout</h2>
        <span className="text-sm text-muted-foreground">
          Total: {totalMemory} KB
        </span>
      </div>

      <div className="space-y-2">
        {blocks.map((block, index) => {
          const widthPercentage = (block.size / totalMemory) * 100;

          return (
            <div
              key={block.id}
              className="relative group"
            >
              <div
                className={cn(
                  "h-16 rounded-lg border-2 transition-all duration-500 hover:scale-[1.02]",
                  "flex items-center justify-between px-4",
                  block.isFree
                    ? "bg-memory-free/10 border-memory-free glow-effect"
                    : "bg-memory-allocated/10 border-memory-allocated"
                )}
                style={{ width: `${widthPercentage}%` }}
              >
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Block {index + 1}
                  </span>
                  {!block.isFree && (
                    <span className="font-semibold text-sm">
                      {block.processName}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">{block.size} KB</div>
                  <div className={cn(
                    "text-xs font-semibold",
                    block.isFree ? "text-memory-free" : "text-memory-allocated"
                  )}>
                    {block.isFree ? "FREE" : "ALLOCATED"}
                  </div>
                </div>
              </div>

              {/* Address labels */}
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{block.start} KB</span>
                <span>{block.start + block.size} KB</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
