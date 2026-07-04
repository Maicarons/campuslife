import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAcademicsStore } from '@/stores/academics'

// Mock API
vi.mock('@/api', () => ({
  academicsApi: {
    getCourses: vi.fn().mockResolvedValue({ data: [] }),
    getGrades: vi.fn().mockResolvedValue({ data: [] }),
    getAssignments: vi.fn().mockResolvedValue({ data: [] }),
    getExams: vi.fn().mockResolvedValue({ data: [] }),
    getNotes: vi.fn().mockResolvedValue({ data: [] }),
    createCourse: vi.fn().mockResolvedValue({
      data: { id: 1, user_id: 1, name: '数学', teacher: '张老师', credits: 3, classroom: 'A101', day_of_week: 1, start_period: 1, end_period: 2, semester: '2026春季', week_range: '1-16', color: '#409EFF', status: 'approved', created_at: '2026-01-01' },
    }),
    deleteCourse: vi.fn().mockResolvedValue({}),
    createAssignment: vi.fn().mockResolvedValue({
      data: { id: 1, user_id: 1, title: '作业1', description: '', course_name: '数学', deadline: null, priority: 'medium', status: 'pending', created_at: '2026-01-01' },
    }),
    createNote: vi.fn().mockResolvedValue({
      data: { id: 1, user_id: 1, title: '笔记1', content: '内容', tags: ['数学'], course_name: '数学', is_public: false, created_at: '2026-01-01' },
    }),
    deleteNote: vi.fn().mockResolvedValue({}),
  },
}))

describe('Academics Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty arrays', () => {
    const store = useAcademicsStore()
    expect(store.courses).toEqual([])
    expect(store.grades).toEqual([])
    expect(store.assignments).toEqual([])
    expect(store.exams).toEqual([])
    expect(store.notes).toEqual([])
  })

  it('should fetch courses', async () => {
    const store = useAcademicsStore()
    await store.fetchCourses()
    expect(store.courses).toEqual([])
  })

  it('should add a course', async () => {
    const store = useAcademicsStore()
    const course = await store.addCourse({ name: '数学', day_of_week: 1, start_period: 1, end_period: 2 })
    expect(store.courses).toHaveLength(1)
    expect(store.courses[0].name).toBe('数学')
  })

  it('should remove a course', async () => {
    const store = useAcademicsStore()
    await store.addCourse({ name: '数学', day_of_week: 1, start_period: 1, end_period: 2 })
    await store.removeCourse(1)
    expect(store.courses).toHaveLength(0)
  })

  it('should add an assignment', async () => {
    const store = useAcademicsStore()
    const a = await store.addAssignment({ title: '作业1' })
    expect(store.assignments).toHaveLength(1)
    expect(store.assignments[0].title).toBe('作业1')
  })

  it('should update assignment status', async () => {
    const store = useAcademicsStore()
    await store.addAssignment({ title: '作业1' })
    await store.updateAssignmentStatus(1, 'done')
    expect(store.assignments[0].status).toBe('done')
  })

  it('should add a note', async () => {
    const store = useAcademicsStore()
    const n = await store.addNote({ title: '笔记1', content: '内容' })
    expect(store.notes).toHaveLength(1)
    expect(store.notes[0].title).toBe('笔记1')
  })

  it('should remove a note', async () => {
    const store = useAcademicsStore()
    await store.addNote({ title: '笔记1' })
    await store.removeNote(1)
    expect(store.notes).toHaveLength(0)
  })

  it('should fetch grades', async () => {
    const store = useAcademicsStore()
    await store.fetchGrades()
    expect(store.grades).toEqual([])
  })

  it('should fetch assignments', async () => {
    const store = useAcademicsStore()
    await store.fetchAssignments()
    expect(store.assignments).toEqual([])
  })

  it('should fetch exams', async () => {
    const store = useAcademicsStore()
    await store.fetchExams()
    expect(store.exams).toEqual([])
  })

  it('should fetch notes', async () => {
    const store = useAcademicsStore()
    await store.fetchNotes()
    expect(store.notes).toEqual([])
  })
})
