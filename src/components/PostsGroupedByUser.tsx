import React, { useMemo } from 'react'
import VirtualList from './VirtualList'
import { usePosts, Post } from '../hooks/usePosts' // предполагаем, что такой хук есть

const PostsGroupedByUser = (): JSX.Element => {
  const { data, isLoading, error, refetch } = usePosts()

  const grouped = useMemo(() => {
    const map = new Map<number, Post[]>()
    if (!data) return map
    for (const p of data) {
      const arr = map.get(p.userId) ?? []
      arr.push(p)
      map.set(p.userId, arr)
    }
    return map
  }, [data])

  if (isLoading) return <div style={{ padding: 16 }}>Загрузка...</div>
  if (error)
    return (
      <div style={{ padding: 16 }}>
        <div style={{ color: 'crimson' }}>Ошибка: {String(error)}</div>
        <button onClick={() => refetch()}>Повторить</button>
      </div>
    )

  return (
    <div style={{ padding: 16, maxWidth: 980, margin: '0 auto' }}>
      <h1>Посты по пользователям</h1>
      {[...grouped.entries()].map(([userId, posts]) => (
        <section key={userId} style={{ marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 8px 0' }}>
            User ID: {userId} — {posts.length} пост(ов)
          </h2>

          <VirtualList
            items={posts}
            height={Math.min(400, posts.length * 88)}
            estimatedItemSize={88}
            renderItem={(post: Post) => (
              <div>
                <h4 style={{ margin: 0 }}>{post.title}</h4>
                <p style={{ margin: '6px 0 0 0', color: '#444' }}>{post.body}</p>
              </div>
            )}
          />
        </section>
      ))}
    </div>
  )
}

export { PostsGroupedByUser }
