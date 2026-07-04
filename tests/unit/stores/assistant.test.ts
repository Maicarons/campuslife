import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAssistantStore } from '@/stores/assistant'

describe('useAssistantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty conversations', () => {
    const store = useAssistantStore()
    expect(store.conversations).toEqual([])
    expect(store.currentConversationId).toBeNull()
    expect(store.isGenerating).toBe(false)
  })

  it('should create a conversation', () => {
    const store = useAssistantStore()
    const id = store.createConversation()

    expect(store.conversations).toHaveLength(1)
    expect(store.currentConversationId).toBe(id)
    expect(store.conversations[0].title).toBe('新对话')
  })

  it('should switch conversation', () => {
    const store = useAssistantStore()
    const id1 = store.createConversation()
    const id2 = store.createConversation()

    store.switchConversation(id1)
    expect(store.currentConversationId).toBe(id1)
  })

  it('should delete conversation', () => {
    const store = useAssistantStore()
    const id1 = store.createConversation()
    store.createConversation()

    store.deleteConversation(id1)
    expect(store.conversations).toHaveLength(1)
  })

  it('should handle deleting current conversation', () => {
    const store = useAssistantStore()
    const id1 = store.createConversation()
    store.deleteConversation(id1)

    expect(store.conversations).toHaveLength(0)
    expect(store.currentConversationId).toBeNull()
  })

  it('should clear current conversation', () => {
    const store = useAssistantStore()
    store.createConversation()
    store.clearCurrentConversation()

    expect(store.currentConversation?.messages).toEqual([])
    expect(store.currentConversation?.title).toBe('新对话')
  })

  it('should have quick actions', () => {
    const store = useAssistantStore()
    expect(store.quickActions.length).toBeGreaterThan(0)
  })

  it('should send message and get response', { timeout: 30000 }, async () => {
    const store = useAssistantStore()
    store.createConversation()

    await store.sendMessage('测试消息')

    expect(store.currentMessages).toHaveLength(2)
    expect(store.currentMessages[0].role).toBe('user')
    expect(store.currentMessages[0].content).toBe('测试消息')
    expect(store.currentMessages[1].role).toBe('assistant')
    expect(store.currentMessages[1].content.length).toBeGreaterThan(0)
  })

  it('should update title from first message', { timeout: 30000 }, async () => {
    const store = useAssistantStore()
    store.createConversation()

    await store.sendMessage('你好世界')

    expect(store.currentConversation?.title).toBe('你好世界')
  })
})
