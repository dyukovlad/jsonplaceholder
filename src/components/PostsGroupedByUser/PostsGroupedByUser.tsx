import { useMemo, useCallback } from 'react'
import VirtualList from '../VirtualList/VirtualList'
import { PostSkeleton } from '../PostSkeleton/PostSkeleton'
import { usePostsQuery } from '../../hooks/usePostsQuery'
import type { Post } from '../../types'
import styles from './PostsGroupedByUser.module.css'

const PostsGroupedByUser = (): JSX.Element => {
  const { data, isLoading, error, refetch } = usePostsQuery()

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  const handleRetryKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleRetry()
      }
    },
    [handleRetry]
  )

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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Посты по пользователям</h1>
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Загрузка...</h2>
          <div>
            {Array.from({ length: 5 }, (_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }
  if (error)
    return (
      <main className={styles.container} role="main">
        <div className={styles.error} role="alert" aria-live="assertive">
          <h2>Произошла ошибка</h2>
          <p>{String(error)}</p>
          <button
            onClick={handleRetry}
            onKeyDown={handleRetryKeyDown}
            className={styles.retryButton}
            aria-label="Повторить загрузку данных"
            type="button"
            tabIndex={0}
          >
            Повторить загрузку
          </button>
        </div>
      </main>
    )

  return (
    <main className={styles.container} role="main" aria-labelledby="posts-heading">
      <h1 id="posts-heading" className={styles.title}>
        Посты по пользователям
      </h1>
      {[...grouped.entries()].map(([userId, posts]) => (
        <section key={userId} className={styles.section} aria-labelledby={`user-${userId}-heading`}>
          <h2 id={`user-${userId}-heading`} className={styles.sectionHeader}>
            Пользователь {userId} — {posts.length} пост
            {posts.length === 1 ? '' : posts.length < 5 ? 'а' : 'ов'}
          </h2>

          <div role="list" aria-label={`Посты пользователя ${userId}`}>
            <VirtualList
              items={posts}
              height={Math.min(400, posts.length * 88)}
              estimatedItemSize={88}
              renderItem={(post: Post) => (
                <article
                  className={styles.postItem}
                  role="listitem"
                  aria-labelledby={`post-${post.id}-title`}
                >
                  <h3 id={`post-${post.id}-title`} className={styles.postTitle}>
                    {post.title}
                  </h3>
                  <p className={styles.postBody} aria-describedby={`post-${post.id}-title`}>
                    {post.body}
                  </p>
                </article>
              )}
            />
          </div>
        </section>
      ))}
    </main>
  )
}

export { PostsGroupedByUser }
