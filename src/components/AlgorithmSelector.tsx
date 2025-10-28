import { AllocationAlgorithm } from "@/types/memory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlgorithmSelectorProps {
  selected: AllocationAlgorithm;
  onSelect: (algorithm: AllocationAlgorithm) => void;
}

const algorithms: { value: AllocationAlgorithm; label: string; description: string }[] = [
  {
    value: "first-fit",
    label: "First Fit",
    description: "Allocate the first block that fits",
  },
  {
    value: "best-fit",
    label: "Best Fit",
    description: "Allocate the smallest block that fits",
  },
  {
    value: "worst-fit",
    label: "Worst Fit",
    description: "Allocate the largest block available",
  },
];

export const AlgorithmSelector = ({ selected, onSelect }: AlgorithmSelectorProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Allocation Algorithm</h3>
      <div className="space-y-2">
        {algorithms.map((algo) => (
          <Button
            key={algo.value}
            variant={selected === algo.value ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-left h-auto py-3",
              selected === algo.value && "glow-effect"
            )}
            onClick={() => onSelect(algo.value)}
          >
            <div>
              <div className="font-semibold">{algo.label}</div>
              <div className="text-xs opacity-80">{algo.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
