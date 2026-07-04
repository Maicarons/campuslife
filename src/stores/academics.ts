import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course, GradeRecord, Assignment, Exam, Note } from '@/types/academics'
import { academicsApi } from '@/api'

export const useAcademicsStore = defineStore('academics', () => {
  const courses = ref<Course[]>([])
  const grades = ref<GradeRecord[]>([])
  const assignments = ref<Assignment[]>([])
  const exams = ref<Exam[]>([])
  const notes = ref<Note[]>([])
  const loading = ref(false)

  async function fetchCourses() {
    loading.value = true
    try {
      const { data } = await academicsApi.getCourses()
      courses.value = data
    } catch { /* use mock */ } finally { loading.value = false }
  }

  async function fetchGrades() {
    try {
      const { data } = await academicsApi.getGrades()
      grades.value = data
    } catch { /* use mock */ }
  }

  async function fetchAssignments() {
    try {
      const { data } = await academicsApi.getAssignments()
      assignments.value = data
    } catch { /* use mock */ }
  }

  async function fetchExams() {
    try {
      const { data } = await academicsApi.getExams()
      exams.value = data
    } catch { /* use mock */ }
  }

  async function fetchNotes() {
    try {
      const { data } = await academicsApi.getNotes()
      notes.value = data
    } catch { /* use mock */ }
  }

  async function addCourse(course: Partial<Course>) {
    const { data } = await academicsApi.createCourse(course)
    courses.value.push(data)
    return data
  }

  async function removeCourse(id: number) {
    await academicsApi.deleteCourse(id)
    courses.value = courses.value.filter(c => c.id !== id)
  }

  async function addAssignment(a: Partial<Assignment>) {
    const { data } = await academicsApi.createAssignment(a)
    assignments.value.push(data)
    return data
  }

  async function updateAssignmentStatus(id: number, status: string) {
    const a = assignments.value.find(a => a.id === id)
    if (a) a.status = status as 'pending' | 'in_progress' | 'done'
  }

  async function addNote(n: Partial<Note>) {
    const { data } = await academicsApi.createNote(n)
    notes.value.push(data)
    return data
  }

  async function removeNote(id: number) {
    await academicsApi.deleteNote(id)
    notes.value = notes.value.filter(n => n.id !== id)
  }

  return {
    courses, grades, assignments, exams, notes, loading,
    fetchCourses, fetchGrades, fetchAssignments, fetchExams, fetchNotes,
    addCourse, removeCourse, addAssignment, updateAssignmentStatus, addNote, removeNote,
  }
})
