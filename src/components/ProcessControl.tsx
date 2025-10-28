import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ProcessControlProps {
  onAddProcess: (name: string, size: number) => void;
}

export const ProcessControl = ({ onAddProcess }: ProcessControlProps) => {
  const [processName, setProcessName] = useState("");
  const [processSize, setProcessSize] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const size = parseInt(processSize);
    
    if (!processName.trim()) {
      toast.error("Please enter a process name");
      return;
    }
    
    if (!size || size <= 0) {
      toast.error("Please enter a valid size");
      return;
    }

    onAddProcess(processName, size);
    setProcessName("");
    setProcessSize("");
  };

  return (
    <Card className="p-6 gradient-border">
      <h3 className="text-xl font-bold mb-4">Add Process</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="process-name">Process Name</Label>
          <Input
            id="process-name"
            placeholder="e.g., P1"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="process-size">Size (KB)</Label>
          <Input
            id="process-size"
            type="number"
            placeholder="e.g., 100"
            value={processSize}
            onChange={(e) => setProcessSize(e.target.value)}
            min="1"
          />
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Process
        </Button>
      </form>
    </Card>
  );
};
