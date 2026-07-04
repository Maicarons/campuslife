import { defineStore } from 'pinia'
import { ref } from 'vue'
import { socialApi } from '@/api'

export interface ForumPost {
  id: number
  user_id: number
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  likes: number
  comment_count: number
  created_at: string
}

export interface ForumComment {
  id: number
  post_id: number
  user_id: number
  content: string
  likes: number
  parent_id: number | null
  created_at: string
}

export const useSocialStore = defineStore('social', () => {
  const posts = ref<ForumPost[]>([])
  const currentPost = ref<ForumPost | null>(null)
  const comments = ref<ForumComment[]>([])
  const loading = ref(false)

  async function fetchPosts() {
    loading.value = true
    try {
      const { data } = await socialApi.getForumPosts()
      posts.value = data
    } catch { /* fallback */ } finally { loading.value = false }
  }

  async function fetchPost(id: number) {
    const { data } = await socialApi.getForumPost(id)
    currentPost.value = data
    return data
  }

  async function fetchComments(postId: number) {
    const { data } = await socialApi.getComments(postId)
    comments.value = data
    return data
  }

  async function createPost(post: Partial<ForumPost>) {
    const { data } = await socialApi.createForumPost(post)
    posts.value.unshift(data)
    return data
  }

  async function createComment(postId: number, content: string) {
    const { data } = await socialApi.createComment(postId, { content })
    comments.value.push(data)
    return data
  }

  return {
    posts, currentPost, comments, loading,
    fetchPosts, fetchPost, fetchComments, createPost, createComment,
  }
})
