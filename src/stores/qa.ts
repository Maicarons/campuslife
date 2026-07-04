import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question, Answer } from '@/types'
import { generateId } from '@/utils/helpers'
import { mockQuestions } from '@/mock/data'

export const useQAStore = defineStore('qa', () => {
  const questions = ref<Question[]>([...mockQuestions])
  const searchQuery = ref('')
  const filterTag = ref('')
  const sortBy = ref<'latest' | 'hot' | 'unresolved'>('latest')

  const filteredQuestions = computed(() => {
    let result = questions.value
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.content.toLowerCase().includes(query) ||
          q.tags.some((t) => t.includes(query))
      )
    }
    if (filterTag.value) {
      result = result.filter((q) => q.tags.includes(filterTag.value))
    }
    switch (sortBy.value) {
      case 'hot':
        result.sort((a, b) => b.views - a.views)
        break
      case 'unresolved':
        result = result.filter((q) => !q.isResolved)
        result.sort((a, b) => b.createdAt - a.createdAt)
        break
      default:
        result.sort((a, b) => b.createdAt - a.createdAt)
    }
    return result
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    questions.value.forEach((q) => q.tags.forEach((t) => tags.add(t)))
    return Array.from(tags)
  })

  function addQuestion(params: { title: string; content: string; tags: string[] }) {
    const question: Question = {
      id: generateId(),
      title: params.title,
      content: params.content,
      tags: params.tags,
      author: '匿名用户',
      answers: [],
      views: 0,
      votes: 0,
      createdAt: Date.now(),
      isResolved: false,
      resolved: false,
    }
    questions.value.unshift(question)
    return question.id
  }

  function addAnswer(questionId: string, params: { content: string }) {
    const question = questions.value.find((q) => q.id === questionId)
    if (question) {
      const answer: Answer = {
        id: generateId(),
        content: params.content,
        author: '匿名用户',
        votes: 0,
        isAccepted: false,
        createdAt: Date.now(),
      }
      question.answers.push(answer)
    }
  }

  function voteQuestion(id: string, delta: number) {
    const question = questions.value.find((q) => q.id === id)
    if (question) {
      question.votes += delta
    }
  }

  function voteAnswer(questionId: string, answerId: string, delta: number) {
    const question = questions.value.find((q) => q.id === questionId)
    if (question) {
      const answer = question.answers.find((a) => a.id === answerId)
      if (answer) {
        answer.votes += delta
      }
    }
  }

  function acceptAnswer(questionId: string, answerId: string) {
    const question = questions.value.find((q) => q.id === questionId)
    if (question) {
      question.answers.forEach((a) => (a.isAccepted = false))
      const answer = question.answers.find((a) => a.id === answerId)
      if (answer) {
        answer.isAccepted = true
        question.isResolved = true
        question.resolved = true
      }
    }
  }

  function incrementViews(id: string) {
    const question = questions.value.find((q) => q.id === id)
    if (question) {
      question.views++
    }
  }

  return {
    questions,
    filteredQuestions,
    searchQuery,
    filterTag,
    sortBy,
    allTags,
    addQuestion,
    addAnswer,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
    incrementViews,
  }
})
