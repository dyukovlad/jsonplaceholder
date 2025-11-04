import React, { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import styles from './VirtualList.module.css'

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
      <div className={styles.container} style={{ maxHeight: height }}>
        {items.map((item, idx) => (
          <div key={item.id ?? idx} className={styles.regularItem}>
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
    )
  }

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <div ref={parentRef} className={styles.virtualContainer} style={{ height }}>
      <div className={styles.virtualInner} style={{ height: totalSize }}>
        {virtualItems.map(virtualRow => {
          const item = items[virtualRow.index]
          return (
            <div
              key={item.id ?? virtualRow.index}
              className={styles.virtualItem}
              style={{
                top: `${virtualRow.start}px`,
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
