import { useQuery } from '@tanstack/react-query'
import { config } from '../config'
import type { Post } from '../types'

const fetchPosts = async (): Promise<Post[]> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)

  try {
    const response = await fetch(`${config.api.baseUrl}/posts`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: config.cache.staleTime,
  })
}
