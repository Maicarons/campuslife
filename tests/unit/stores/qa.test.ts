import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQAStore } from '@/stores/qa'

describe('useQAStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock questions', () => {
    const store = useQAStore()
    expect(store.questions.length).toBeGreaterThan(0)
  })

  it('should filter by search query', () => {
    const store = useQAStore()
    store.searchQuery = '选课'
    expect(store.filteredQuestions.some((q) => q.title.includes('选课'))).toBe(true)
  })

  it('should filter by tag', () => {
    const store = useQAStore()
    store.filterTag = '图书馆'
    expect(store.filteredQuestions.every((q) => q.tags.includes('图书馆'))).toBe(true)
  })

  it('should sort by latest', () => {
    const store = useQAStore()
    store.sortBy = 'latest'
    const dates = store.filteredQuestions.map((q) => q.createdAt)
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i])
    }
  })

  it('should filter unresolved questions', () => {
    const store = useQAStore()
    store.sortBy = 'unresolved'
    expect(store.filteredQuestions.every((q) => !q.isResolved)).toBe(true)
  })

  it('should add question', () => {
    const store = useQAStore()
    const count = store.questions.length

    store.addQuestion({ title: '测试问题', content: '测试内容', tags: ['测试'] })

    expect(store.questions).toHaveLength(count + 1)
    expect(store.questions[0].title).toBe('测试问题')
  })

  it('should add answer to question', () => {
    const store = useQAStore()
    const qId = store.questions[0].id
    const answerCount = store.questions[0].answers.length

    store.addAnswer(qId, { content: '测试回答' })

    expect(store.questions[0].answers).toHaveLength(answerCount + 1)
  })

  it('should vote question', () => {
    const store = useQAStore()
    const qId = store.questions[0].id
    const votes = store.questions[0].votes

    store.voteQuestion(qId, 1)
    expect(store.questions[0].votes).toBe(votes + 1)
  })

  it('should vote answer', () => {
    const store = useQAStore()
    const qId = store.questions[0].id
    const aId = store.questions[0].answers[0].id
    const votes = store.questions[0].answers[0].votes

    store.voteAnswer(qId, aId, 1)
    expect(store.questions[0].answers[0].votes).toBe(votes + 1)
  })

  it('should accept answer', () => {
    const store = useQAStore()
    const qId = store.questions[0].id
    const aId = store.questions[0].answers[0].id

    store.acceptAnswer(qId, aId)

    expect(store.questions[0].answers[0].isAccepted).toBe(true)
    expect(store.questions[0].isResolved).toBe(true)
  })

  it('should increment views', () => {
    const store = useQAStore()
    const qId = store.questions[0].id
    const views = store.questions[0].views

    store.incrementViews(qId)
    expect(store.questions[0].views).toBe(views + 1)
  })

  it('should compute all tags', () => {
    const store = useQAStore()
    expect(store.allTags.length).toBeGreaterThan(0)
  })
})
