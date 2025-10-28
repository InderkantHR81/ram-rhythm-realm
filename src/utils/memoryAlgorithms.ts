import { MemoryBlock, Process, AllocationAlgorithm } from "@/types/memory";

export const allocateMemory = (
  blocks: MemoryBlock[],
  process: Process,
  algorithm: AllocationAlgorithm
): { success: boolean; blocks: MemoryBlock[] } => {
  const freeBlocks = blocks.filter((b) => b.isFree);

  if (freeBlocks.length === 0) {
    return { success: false, blocks };
  }

  let selectedBlock: MemoryBlock | null = null;

  switch (algorithm) {
    case "first-fit":
      selectedBlock = freeBlocks.find((b) => b.size >= process.size) || null;
      break;

    case "best-fit":
      const suitableBlocks = freeBlocks.filter((b) => b.size >= process.size);
      if (suitableBlocks.length > 0) {
        selectedBlock = suitableBlocks.reduce((prev, curr) =>
          prev.size < curr.size ? prev : curr
        );
      }
      break;

    case "worst-fit":
      const worstBlocks = freeBlocks.filter((b) => b.size >= process.size);
      if (worstBlocks.length > 0) {
        selectedBlock = worstBlocks.reduce((prev, curr) =>
          prev.size > curr.size ? prev : curr
        );
      }
      break;
  }

  if (!selectedBlock) {
    return { success: false, blocks };
  }

  const newBlocks = [...blocks];
  const blockIndex = newBlocks.findIndex((b) => b.id === selectedBlock.id);

  if (selectedBlock.size === process.size) {
    // Exact fit
    newBlocks[blockIndex] = {
      ...selectedBlock,
      isFree: false,
      processId: process.id,
      processName: process.name,
    };
  } else {
    // Split the block
    const allocatedBlock: MemoryBlock = {
      ...selectedBlock,
      size: process.size,
      isFree: false,
      processId: process.id,
      processName: process.name,
    };

    const remainingBlock: MemoryBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      start: selectedBlock.start + process.size,
      size: selectedBlock.size - process.size,
      isFree: true,
    };

    newBlocks.splice(blockIndex, 1, allocatedBlock, remainingBlock);
  }

  return { success: true, blocks: newBlocks };
};

export const deallocateMemory = (
  blocks: MemoryBlock[],
  processId: string
): MemoryBlock[] => {
  const newBlocks = blocks.map((block) =>
    block.processId === processId
      ? { ...block, isFree: true, processId: undefined, processName: undefined }
      : block
  );

  // Merge adjacent free blocks
  return mergeAdjacentBlocks(newBlocks);
};

const mergeAdjacentBlocks = (blocks: MemoryBlock[]): MemoryBlock[] => {
  const sortedBlocks = [...blocks].sort((a, b) => a.start - b.start);
  const merged: MemoryBlock[] = [];

  for (let i = 0; i < sortedBlocks.length; i++) {
    const current = sortedBlocks[i];

    if (merged.length === 0 || !merged[merged.length - 1].isFree || !current.isFree) {
      merged.push({ ...current });
    } else {
      const last = merged[merged.length - 1];
      last.size += current.size;
    }
  }

  return merged;
};

export const calculateFragmentation = (blocks: MemoryBlock[], totalMemory: number) => {
  const freeBlocks = blocks.filter((b) => b.isFree);
  const allocatedBlocks = blocks.filter((b) => !b.isFree);

  // External fragmentation: total free memory that can't be used
  const totalFreeMemory = freeBlocks.reduce((sum, b) => sum + b.size, 0);
  const largestFreeBlock = freeBlocks.length > 0 
    ? Math.max(...freeBlocks.map((b) => b.size))
    : 0;
  const externalFragmentation = totalFreeMemory - largestFreeBlock;

  // Internal fragmentation (would need process actual size vs allocated size)
  const internalFragmentation = 0; // Simplified for this simulation

  return {
    external: externalFragmentation,
    internal: internalFragmentation,
  };
};
