// Core domain types for Woningpaspoort

// User & Authentication
export type UserRole = 'homeowner' | 'builder' | 'architect' | 'engineer' | 'municipality' | 'admin'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: Date
}

// Project (Woning)
export type ProjectStatus = 'planning' | 'design' | 'permit' | 'construction' | 'inspection' | 'completed'

export interface Project {
  id: string
  name: string
  address?: string
  city?: string
  postalCode?: string
  status: ProjectStatus
  progress: number
  createdAt: Date
  updatedAt: Date
}

// Construction Phases
export type PhaseStatus = 'pending' | 'in_progress' | 'completed' | 'delayed'

export interface Phase {
  id: string
  name: string
  description?: string
  order: number
  status: PhaseStatus
  startDate?: Date
  endDate?: Date
  projectId: string
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  description?: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  dueDate?: Date
  completedAt?: Date
  phaseId: string
}

// Documents
export type DocumentType = 'photo' | 'video' | 'blueprint' | 'permit' | 'contract' | 'invoice' | 'report' | 'certificate' | 'other'

export interface Document {
  id: string
  name: string
  type: DocumentType
  url: string
  hash?: string // Cryptographic verification
  metadata?: Record<string, unknown>
  createdAt: Date
  projectId: string
  phaseId?: string
  uploadedById: string
}

// Specifications (Materials, finishes, etc.)
export interface Specification {
  id: string
  category: string
  name: string
  value: string
  metadata?: Record<string, unknown>
  projectId: string
}

// Wizard types
export interface WizardState {
  currentStep: number
  data: HousePreferences
  isComplete: boolean
}

export interface HousePreferences {
  // Style
  style?: 'modern' | 'traditional' | 'minimalist' | 'industrial' | 'rural'

  // Size
  livingArea?: number // m²
  plotSize?: number // m²
  floors?: number

  // Rooms
  bedrooms?: number
  bathrooms?: number
  hasGarage?: boolean
  hasBasement?: boolean

  // Energy & Sustainability
  energyLabel?: 'A++++' | 'A+++' | 'A++' | 'A+' | 'A' | 'B' | 'C'
  solarPanels?: boolean
  heatPump?: boolean

  // Features
  features?: string[]

  // Budget
  budgetMin?: number
  budgetMax?: number

  // Location
  city?: string
  province?: string

  // Contact
  email?: string
  phone?: string
  name?: string
}

// Dashboard types
export interface ProjectSummary {
  id: string
  name: string
  address?: string
  status: ProjectStatus
  progress: number
  lastActivity?: Date
  nextMilestone?: string
}

export interface ActivityItem {
  id: string
  action: string
  description?: string
  timestamp: Date
  userId?: string
  userName?: string
}

// Consumentendossier (Wkb requirement)
export interface ConsumentendossierSection {
  id: string
  title: string
  description: string
  required: boolean
  completed: boolean
  documents: Document[]
}

export interface Consumentendossier {
  projectId: string
  sections: ConsumentendossierSection[]
  completionPercentage: number
  isComplete: boolean
  generatedAt?: Date
}
