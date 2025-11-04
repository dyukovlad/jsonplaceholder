import { useMemo } from 'react'
import VirtualList from './VirtualList'
import { usePosts } from '../hooks/usePosts'
import type { Post } from '../types'
import styles from './PostsGroupedByUser.module.css'

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
    <div className={styles.container}>
      <h1 className={styles.title}>Посты по пользователям</h1>
      {[...grouped.entries()].map(([userId, posts]) => (
        <section key={userId} className={styles.section}>
          <h2 className={styles.sectionHeader}>
            User ID: {userId} — {posts.length} пост(ов)
          </h2>

          <VirtualList
            items={posts}
            height={Math.min(400, posts.length * 88)}
            estimatedItemSize={88}
            renderItem={(post: Post) => (
              <div className={styles.postItem}>
                <h4 className={styles.postTitle}>{post.title}</h4>
                <p className={styles.postBody}>{post.body}</p>
              </div>
            )}
          />
        </section>
      ))}
    </div>
  )
}

export { PostsGroupedByUser }
