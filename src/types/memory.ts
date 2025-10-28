export type AllocationAlgorithm = "first-fit" | "best-fit" | "worst-fit";

export interface MemoryBlock {
  id: string;
  start: number;
  size: number;
  isFree: boolean;
  processId?: string;
  processName?: string;
}

export interface Process {
  id: string;
  name: string;
  size: number;
  allocated: boolean;
  blockId?: string;
}

export interface MemoryStats {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  internalFragmentation: number;
  externalFragmentation: number;
  allocatedProcesses: number;
}
