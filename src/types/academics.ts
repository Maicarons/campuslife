// Academics types
export interface Course {
  id: number
  user_id: number
  name: string
  teacher: string
  credits: number
  classroom: string
  day_of_week: number
  start_period: number
  end_period: number
  semester: string
  week_range: string
  color: string
  status: string
  created_at: string
}

export interface GradeRecord {
  id: number
  user_id: number
  course_name: string
  score: number
  grade_point: number
  credits: number
  semester: string
  exam_type: string
  created_at: string
}

export interface Assignment {
  id: number
  user_id: number
  title: string
  description: string
  course_name: string
  deadline: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'done'
  created_at: string
}

export interface Exam {
  id: number
  user_id: number
  course_name: string
  exam_type: string
  exam_time: string | null
  location: string
  seat_number: string
  notes: string
  status: string
  created_at: string
}

export interface Note {
  id: number
  user_id: number
  title: string
  content: string
  tags: string[]
  course_name: string
  is_public: boolean
  created_at: string
}
