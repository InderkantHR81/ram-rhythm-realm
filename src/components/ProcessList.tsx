import { Process } from "@/types/memory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessListProps {
  processes: Process[];
  onDeallocate: (processId: string) => void;
}

export const ProcessList = ({ processes, onDeallocate }: ProcessListProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Process Queue</h3>
      
      {processes.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No processes yet. Add a process to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {processes.map((process) => (
            <div
              key={process.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-all",
                process.allocated
                  ? "bg-memory-allocated/10 border-memory-allocated"
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-center gap-3">
                {process.allocated ? (
                  <CheckCircle2 className="h-5 w-5 text-memory-allocated" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-semibold">{process.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {process.size} KB
                  </div>
                </div>
              </div>

              {process.allocated && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeallocate(process.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
