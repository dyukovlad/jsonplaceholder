import React, { useEffect, useState } from 'react'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

type GroupedPosts = Record<number, Post[]>

const Lists = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', { signal })
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data: Post[] = await res.json()
        setPosts(data)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        setError(err.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    return () => {
      controller.abort()
    }
  }, [])

  const grouped: GroupedPosts = posts.reduce((acc, post) => {
    const key = post.userId
    if (!acc[key]) acc[key] = []
    acc[key].push(post)
    return acc
  }, {} as GroupedPosts)

  if (loading) return <div style={{ padding: 16 }}>Загрузка...</div>
  if (error) return <div style={{ padding: 16, color: 'crimson' }}>Ошибка: {error}</div>

  return (
    <div style={{ padding: 16 }}>
      <h1>Посты по пользователям</h1>
      {Object.keys(grouped).length === 0 && <div>Нет данных</div>}
      {Object.entries(grouped).map(([userId, userPosts]) => (
        <section
          key={userId}
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #e6e6e6',
            background: '#fafafa',
          }}
        >
          <h2 style={{ margin: '0 0 8px 0' }}>
            User ID: {userId} — {userPosts.length} пост(ов)
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {userPosts.map(post => (
              <li
                key={post.id}
                style={{
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 6,
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <h3 style={{ margin: '0 0 6px 0', fontSize: 16 }}>{post.title}</h3>
                <p style={{ margin: 0, color: '#444' }}>{post.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export { Lists }
