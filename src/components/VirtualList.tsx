import React, { useRef } from 'react'
import React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

type VirtualListProps<T> = {
  items: T[]
  height?: number
  estimatedItemSize?: number
  renderItem: (item: T, index: number) => React.ReactNode
  enableVirtualization?: boolean
}

export default function VirtualList<T extends { id?: string | number }>({
  items,
  height = 400,
  estimatedItemSize = 88,
  renderItem,
  enableVirtualization = true,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null)

  const shouldVirtualize = enableVirtualization && items.length > 40

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemSize,
    overscan: 5,
  })

  if (!shouldVirtualize) {
    return (
      <div style={{ maxHeight: height, overflow: 'auto' }}>
        {items.map((item, idx) => (
          <div key={item.id ?? idx} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
    )
  }

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <div
      ref={parentRef}
      style={{
        height,
        overflow: 'auto',
        width: '100%',
        borderRadius: 6,
        border: '1px solid #ddd',
      }}
    >
      <div style={{ height: totalSize, width: '100%', position: 'relative' }}>
        {virtualItems.map(virtualRow => {
          const item = items[virtualRow.index]
          return (
            <div
              key={item.id ?? virtualRow.index}
              style={{
                position: 'absolute',
                transform: `translateY(${virtualRow.start}px)`,
                top: 0,
                left: 0,
                width: '100%',
                boxSizing: 'border-box',
                padding: 12,
                borderBottom: '1px solid #eee',
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
