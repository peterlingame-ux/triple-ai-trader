import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight?: number;
  columns?: number;
  gap?: number;
  className?: string;
  overscan?: number;
}

export const VirtualizedGrid = memo(<T extends any>({
  items,
  renderItem,
  itemHeight,
  containerHeight = 400,
  columns = 3,
  gap = 16,
  className,
  overscan = 3,
}: VirtualizedGridProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(items.length / columns);
  const totalHeight = rowCount * (itemHeight + gap) - gap;

  const visibleRows = useMemo(() => {
    const visibleRowCount = Math.ceil(containerHeight / (itemHeight + gap));
    const startRow = Math.floor(scrollTop / (itemHeight + gap));
    const endRow = Math.min(rowCount - 1, startRow + visibleRowCount + overscan);
    const adjustedStartRow = Math.max(0, startRow - overscan);

    const rows = [];
    for (let rowIndex = adjustedStartRow; rowIndex <= endRow; rowIndex++) {
      const startIndex = rowIndex * columns;
      const endIndex = Math.min(items.length - 1, startIndex + columns - 1);
      const rowItems = items.slice(startIndex, endIndex + 1);
      
      if (rowItems.length > 0) {
        rows.push({
          index: rowIndex,
          items: rowItems,
          startIndex,
          top: rowIndex * (itemHeight + gap),
        });
      }
    }
    return rows;
  }, [items, scrollTop, containerHeight, itemHeight, gap, columns, rowCount, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleRows.map((row) => (
          <div
            key={row.index}
            style={{
              position: 'absolute',
              top: row.top,
              left: 0,
              right: 0,
              height: itemHeight,
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {row.items.map((item, itemIndex) => 
              renderItem(item, row.startIndex + itemIndex)
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualizedGrid.displayName = 'VirtualizedGrid';