import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSocialStore } from '@/stores/social'

vi.mock('@/api', () => ({
  socialApi: {
    getForumPosts: vi.fn().mockResolvedValue({ data: [] }),
    createForumPost: vi.fn().mockResolvedValue({
      data: { id: 1, user_id: 1, title: '测试帖子', content: '内容', category: '综合', tags: [], views: 0, likes: 0, comment_count: 0, created_at: '2026-01-01' },
    }),
    getForumPost: vi.fn().mockResolvedValue({
      data: { id: 1, user_id: 1, title: '测试帖子', content: '内容', category: '综合', tags: [], views: 1, likes: 0, comment_count: 0, created_at: '2026-01-01' },
    }),
    getComments: vi.fn().mockResolvedValue({ data: [] }),
    createComment: vi.fn().mockResolvedValue({
      data: { id: 1, post_id: 1, user_id: 1, content: '好帖子', likes: 0, parent_id: null, created_at: '2026-01-01' },
    }),
  },
}))

describe('Social Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty data', () => {
    const store = useSocialStore()
    expect(store.posts).toEqual([])
    expect(store.currentPost).toBeNull()
    expect(store.comments).toEqual([])
  })

  it('should fetch posts', async () => {
    const store = useSocialStore()
    await store.fetchPosts()
    expect(store.posts).toEqual([])
  })

  it('should create a post', async () => {
    const store = useSocialStore()
    await store.createPost({ title: '测试帖子', content: '内容' })
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].title).toBe('测试帖子')
  })

  it('should fetch a post detail', async () => {
    const store = useSocialStore()
    const post = await store.fetchPost(1)
    expect(store.currentPost?.title).toBe('测试帖子')
  })

  it('should fetch comments', async () => {
    const store = useSocialStore()
    await store.fetchComments(1)
    expect(store.comments).toEqual([])
  })

  it('should create a comment', async () => {
    const store = useSocialStore()
    await store.createComment(1, '好帖子')
    expect(store.comments).toHaveLength(1)
    expect(store.comments[0].content).toBe('好帖子')
  })
})
