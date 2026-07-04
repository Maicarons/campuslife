// ============================================
// CampusLife Type Definitions
// ============================================

// AI Assistant
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export interface QuickAction {
  id: string
  icon: string
  label: string
  prompt: string
  category: string
}

// Lost & Found
export type ItemStatus = 'lost' | 'found' | 'claimed'
export type ItemCategory = 'electronics' | 'cards' | 'clothing' | 'accessories' | 'books' | 'keys' | 'other'

export interface LostFoundItem {
  id: string
  title: string
  description: string
  category: ItemCategory
  status: ItemStatus
  location: string
  contact: string
  images: string[]
  createdAt: number
  updatedAt: number
  userId: string
}

// Marketplace
export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair'
export type ProductStatus = 'available' | 'reserved' | 'sold'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  condition: ProductCondition
  status: ProductStatus
  images: string[]
  contact: string
  createdAt: number
  updatedAt: number
  userId: string
}

// Q&A
export interface Question {
  id: string
  title: string
  content: string
  tags: string[]
  author: string
  answers: Answer[]
  views: number
  votes: number
  createdAt: number
  isResolved: boolean
  resolved?: boolean
}

export interface Answer {
  id: string
  content: string
  author: string
  votes: number
  isAccepted: boolean
  createdAt: number
}

// Campus Info
export type InfoCategory = 'academic' | 'events' | 'dining' | 'facilities' | 'transport' | 'emergency'

export interface CampusInfo {
  id: string
  title: string
  content: string
  category: InfoCategory
  icon: string
  tags: string[]
  isPinned: boolean
  createdAt: number
}

// Volunteer
export type ActivityStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export interface VolunteerActivity {
  id: string
  title: string
  description: string
  location: string
  startTime: number
  endTime: number
  maxParticipants: number
  currentParticipants: number
  status: ActivityStatus
  contact: string
  tags: string[]
  createdAt: number
}

export interface VolunteerRegistration {
  id: string
  activityId: string
  userId: string
  name: string
  phone: string
  studentId: string
  registeredAt: number
}

// Social - Club
export interface Club {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  president: string
  avatar: string
  tags: string[]
  isJoined: boolean
  createdAt: number
}

// Social - Contact
export interface Contact {
  id: string
  name: string
  avatar: string
  department: string
  grade: string
  phone: string
  email: string
  group: string
  isOnline: boolean
  lastSeen?: number
}

// Social - Message
export interface ChatConversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastTime: number
  unreadCount: number
  isGroup: boolean
  members?: string[]
}

export interface ChatMessageItem {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: number
  isOwn: boolean
}

// Points
export interface PointRecord {
  id: string
  action: string
  points: number
  description: string
  createdAt: number
}

export interface UserPoints {
  total: number
  level: number
  levelName: string
  nextLevelPoints: number
  records: PointRecord[]
}

// Free Classroom
export interface Classroom {
  id: string
  building: string
  roomNumber: string
  capacity: number
  hasProjector: boolean
  hasAC: boolean
  availableSlots: TimeSlot[]
}

export interface TimeSlot {
  start: string
  end: string
  period: string
}

// Common
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface FilterOption {
  label: string
  value: string
}
