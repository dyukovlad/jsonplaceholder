import React, { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

type VirtualListProps<T> = {
  items: T[]
  /** высота контейнера в пикселях — можно вычислять динамически */
  height?: number
  /** приблизительная высота одной строки (px) */
  estimatedItemSize?: number
  /** Рендер айтема: (item, index) => ReactNode */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Когда список короткий — можно отключать виртуализацию (по умолчанию true) */
  enableVirtualization?: boolean
}

/**
 * Generic VirtualList — используй для списков любого размера.
 */
export default function VirtualList<T extends any>({
  items,
  height = 400,
  estimatedItemSize = 88,
  renderItem,
  enableVirtualization = true,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null)

  // Для небольших списков виртуализация иногда не нужна — рендерим обычный map
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
          <div
            key={(item as any).id ?? idx}
            style={{ padding: 12, borderBottom: '1px solid #eee' }}
          >
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
              key={(item as any).id ?? virtualRow.index}
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
