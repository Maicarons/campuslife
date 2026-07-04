import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuslife-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('campuslife-token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data: any) => api.put('/auth/me', data),
}

// Organization API
export const orgApi = {
  getSchools: () => api.get('/org/schools'),
  getColleges: (schoolId: number) => api.get(`/org/schools/${schoolId}/colleges`),
  getMajors: (collegeId: number) => api.get(`/org/colleges/${collegeId}/majors`),
  getGrades: (majorId: number) => api.get(`/org/majors/${majorId}/grades`),
  getClasses: (gradeId: number) => api.get(`/org/grades/${gradeId}/classes`),
}

// Academics API
export const academicsApi = {
  getCourses: () => api.get('/academics/courses'),
  createCourse: (data: any) => api.post('/academics/courses', data),
  updateCourse: (id: number, data: any) => api.put(`/academics/courses/${id}`, data),
  deleteCourse: (id: number) => api.delete(`/academics/courses/${id}`),
  getGrades: () => api.get('/academics/grades'),
  createGrade: (data: any) => api.post('/academics/grades', data),
  getAssignments: () => api.get('/academics/assignments'),
  createAssignment: (data: any) => api.post('/academics/assignments', data),
  updateAssignment: (id: number, data: any) => api.put(`/academics/assignments/${id}`, data),
  deleteAssignment: (id: number) => api.delete(`/academics/assignments/${id}`),
  getExams: () => api.get('/academics/exams'),
  createExam: (data: any) => api.post('/academics/exams', data),
  getNotes: () => api.get('/academics/notes'),
  createNote: (data: any) => api.post('/academics/notes', data),
  updateNote: (id: number, data: any) => api.put(`/academics/notes/${id}`, data),
  deleteNote: (id: number) => api.delete(`/academics/notes/${id}`),
}

// Campus API
export const campusApi = {
  getLostFound: (type?: string) => api.get('/campus/lost-found', { params: { status_filter: type || '' } }),
  createLostFound: (data: any) => api.post('/campus/lost-found', data),
  getEvents: () => api.get('/campus/events'),
  getAnnouncements: () => api.get('/campus/announcements'),
  getDining: (type?: string) => api.get('/campus/dining', { params: { type_filter: type || '' } }),
}

// Finance API
export const financeApi = {
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  deleteTransaction: (id: number) => api.delete(`/finance/transactions/${id}`),
  getScholarships: () => api.get('/finance/scholarships'),
  getJobs: () => api.get('/finance/jobs'),
}

// Health API
export const healthApi = {
  getExerciseLogs: () => api.get('/health/exercise'),
  createExerciseLog: (data: any) => api.post('/health/exercise', data),
  getSleepLogs: () => api.get('/health/sleep'),
  createSleepLog: (data: any) => api.post('/health/sleep', data),
  getMoodLogs: () => api.get('/health/mood'),
  createMoodLog: (data: any) => api.post('/health/mood', data),
}

// Social API
export const socialApi = {
  getForumPosts: () => api.get('/social/forum'),
  createForumPost: (data: any) => api.post('/social/forum', data),
  getForumPost: (id: number) => api.get(`/social/forum/${id}`),
  createComment: (postId: number, data: any) => api.post(`/social/forum/${postId}/comments`, data),
  getComments: (postId: number) => api.get(`/social/forum/${postId}/comments`),
}

// AI API
export const aiApi = {
  getConversations: () => api.get('/ai/conversations'),
  createConversation: (data: any) => api.post('/ai/conversations', data),
  getConversation: (id: number) => api.get(`/ai/conversations/${id}`),
  deleteConversation: (id: number) => api.delete(`/ai/conversations/${id}`),
  chat: (data: any) => api.post('/ai/chat', data),
  getPointHistory: () => api.get('/ai/points/history'),
}

export default api
