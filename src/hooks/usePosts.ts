import { useEffect, useRef, useState, useCallback } from 'react'

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type UsePostsOptions = {
  url?: string
  retry?: number
  timeoutMs?: number
  cacheTTL?: number
}

type State = {
  data: Post[] | null
  error: Error | null
  isLoading: boolean
  isFetching: boolean
  lastFetchedAt: number | null
}

const DEFAULTS: Required<UsePostsOptions> = {
  url: 'https://jsonplaceholder.typicode.com/posts',
  retry: 2,
  timeoutMs: 15_000,
  cacheTTL: 60_000,
}

const inMemoryCache: { [key: string]: { ts: number; data: Post[] } } = {}

export function usePosts(opts?: UsePostsOptions) {
  const { url, retry, timeoutMs, cacheTTL } = { ...DEFAULTS, ...(opts ?? {}) }
  const [state, setState] = useState<State>({
    data: null,
    error: null,
    isLoading: true,
    isFetching: false,
    lastFetchedAt: null,
  })

  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  const fetchOnce = useCallback(
    async (signal: AbortSignal) => {
      const controller = new AbortController()
      const mergedSignal = signal
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const res = await fetch(url, { signal: mergedSignal || controller.signal })
        clearTimeout(timer)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as Post[]
        return json
      } finally {
        clearTimeout(timer)
      }
    },
    [url, timeoutMs]
  )

  const fetchWithRetry = useCallback(
    async (attempts = retry) => {
      const cacheEntry = inMemoryCache[url]
      const now = Date.now()
      if (cacheEntry && now - cacheEntry.ts < cacheTTL) {
        return cacheEntry.data
      }

      let lastErr: unknown = null
      for (let i = 0; i <= attempts; i++) {
        if (!mountedRef.current) throw new Error('Component unmounted')
        const controller = new AbortController()
        abortRef.current = controller
        try {
          const data = await fetchOnce(controller.signal)
          inMemoryCache[url] = { ts: Date.now(), data }
          return data
        } catch (err: unknown) {
          lastErr = err
          if (
            err instanceof Error &&
            (err.name === 'AbortError' || err.message === 'Component unmounted')
          ) {
            throw err
          }
          const backoff = 200 * Math.pow(2, i)
          await new Promise(r => setTimeout(r, backoff))
        }
      }
      throw lastErr
    },
    [fetchOnce, url, retry, cacheTTL]
  )

  const refetch = useCallback(async () => {
    setState(s => ({ ...s, isFetching: true, error: null }))
    try {
      const data = await fetchWithRetry()
      if (!mountedRef.current) return
      setState({
        data,
        error: null,
        isLoading: false,
        isFetching: false,
        lastFetchedAt: Date.now(),
      })
      return data
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      if (!mountedRef.current) return
      setState(s => ({
        ...s,
        error: err instanceof Error ? err : new Error(String(err)),
        isLoading: false,
        isFetching: false,
      }))
      throw err
    }
  }, [fetchWithRetry])

  useEffect(() => {
    let cancelled = false
    setState(s => ({ ...s, isLoading: true, error: null }))
    const controller = new AbortController()
    abortRef.current = controller

    fetchWithRetry()
      .then(data => {
        if (cancelled || !mountedRef.current) return
        setState({
          data,
          error: null,
          isLoading: false,
          isFetching: false,
          lastFetchedAt: Date.now(),
        })
      })
      .catch(err => {
        if (err && err.name === 'AbortError') return
        if (!mountedRef.current) return
        setState({
          data: null,
          error: err,
          isLoading: false,
          isFetching: false,
          lastFetchedAt: null,
        })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fetchWithRetry])

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    lastFetchedAt: state.lastFetchedAt,
    refetch,
  }
}
