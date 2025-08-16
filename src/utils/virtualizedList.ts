// Virtual list implementation for better performance with large datasets
import { useMemo, useState, useRef } from 'react';
import React from 'react';

interface VirtualListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside visible area
}

interface VirtualListResult {
  virtualItems: Array<{
    index: number;
    item: any;
    offsetTop: number;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
}

export function useVirtualList({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualListProps): VirtualListResult {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLElement>();

  const { virtualItems, totalHeight } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    
    // Calculate visible range
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    // Apply overscan
    const overscanStartIndex = Math.max(0, startIndex - overscan);
    const overscanEndIndex = Math.min(items.length - 1, endIndex + overscan);

    // Generate virtual items
    const virtualItems = [];
    for (let i = overscanStartIndex; i <= overscanEndIndex; i++) {
      virtualItems.push({
        index: i,
        item: items[i],
        offsetTop: i * itemHeight
      });
    }

    return { virtualItems, totalHeight };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const scrollToIndex = (index: number) => {
    if (scrollElementRef.current) {
      const offset = index * itemHeight;
      scrollElementRef.current.scrollTop = offset;
    }
  };

  return {
    virtualItems,
    totalHeight,
    scrollToIndex
  };
}

// Optimized list component
interface OptimizedListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
  getItemKey?: (item: any, index: number) => string | number;
}

export function OptimizedList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = "",
  getItemKey = (_, index) => index
}: OptimizedListProps) {
  const { virtualItems, totalHeight } = useVirtualList({
    items,
    itemHeight,
    containerHeight
  });

  return React.createElement('div', {
    className: `relative overflow-auto ${className}`,
    style: { height: containerHeight }
  }, React.createElement('div', {
    style: { height: totalHeight, position: 'relative' }
  }, virtualItems.map(({ item, index, offsetTop }) => (
    React.createElement('div', {
      key: getItemKey(item, index),
      style: {
        position: 'absolute',
        top: offsetTop,
        left: 0,
        right: 0,
        height: itemHeight
      }
    }, renderItem(item, index))
  ))));
}

// Memory efficient grid for crypto cards
interface CryptoGridProps {
  items: any[];
  itemHeight: number;
  itemsPerRow: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  gap?: number;
}

export function VirtualizedCryptoGrid({
  items,
  itemHeight,
  itemsPerRow,
  containerHeight,
  renderItem,
  gap = 16
}: CryptoGridProps) {
  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / itemsPerRow);
  
  const { virtualItems: virtualRows, totalHeight } = useVirtualList({
    items: Array.from({ length: totalRows }, (_, rowIndex) => rowIndex),
    itemHeight: rowHeight,
    containerHeight
  });

  return React.createElement('div', {
    className: "relative overflow-auto",
    style: { height: containerHeight }
  }, React.createElement('div', {
    style: { height: totalHeight, position: 'relative' }
  }, virtualRows.map(({ item: rowIndex, offsetTop }) => {
    const startIndex = rowIndex * itemsPerRow;
    const endIndex = Math.min(startIndex + itemsPerRow, items.length);
    
    return React.createElement('div', {
      key: rowIndex,
      style: {
        position: 'absolute',
        top: offsetTop,
        left: 0,
        right: 0,
        height: rowHeight,
        display: 'grid',
        gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
        gap: `${gap}px`
      }
    }, items.slice(startIndex, endIndex).map((item, localIndex) => (
      React.createElement('div', {
        key: startIndex + localIndex
      }, renderItem(item, startIndex + localIndex))
    )));
  })));
}

// Batch operations for better performance
export const batchUpdates = (
  items: any[],
  batchSize: number,
  updateFn: (batch: any[]) => void,
  delay: number = 16 // One frame at 60fps
): Promise<void> => {
  return new Promise((resolve) => {
    let currentIndex = 0;
    
    const processBatch = () => {
      const batch = items.slice(currentIndex, currentIndex + batchSize);
      if (batch.length > 0) {
        updateFn(batch);
        currentIndex += batchSize;
        
        if (currentIndex < items.length) {
          setTimeout(processBatch, delay);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    };
    
    processBatch();
  });
};