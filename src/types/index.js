// Course and product types
export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

export const ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
}

export const StepStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ERROR: 'error'
}

// API response types
export const ApiStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Course concept structure
export const createCourseConcept = (data) => ({
  id: data.id || `concept_${Date.now()}`,
  title: data.title || '',
  description: data.description || '',
  targetAudience: data.targetAudience || '',
  pricePoint: data.pricePoint || 0,
  estimatedDuration: data.estimatedDuration || '2-4 weeks',
  difficulty: data.difficulty || 'beginner',
  tags: data.tags || [],
  createdAt: data.createdAt || new Date().toISOString()
})

// Course content structure
export const createCourseContent = (data) => ({
  id: data.id || `content_${Date.now()}`,
  title: data.title || '',
  description: data.description || '',
  chapters: data.chapters || [],
  salesPage: data.salesPage || '',
  emailSequence: data.emailSequence || [],
  vslScript: data.vslScript || '',
  createdAt: data.createdAt || new Date().toISOString()
})

// Chapter structure
export const createChapter = (data) => ({
  id: data.id || `chapter_${Date.now()}`,
  title: data.title || '',
  description: data.description || '',
  order: data.order || 0,
  lessons: data.lessons || [],
  duration: data.duration || 0,
  createdAt: data.createdAt || new Date().toISOString()
})

// Lesson structure
export const createLesson = (data) => ({
  id: data.id || `lesson_${Date.now()}`,
  title: data.title || '',
  content: data.content || '',
  order: data.order || 0,
  duration: data.duration || 0,
  type: data.type || 'text',
  createdAt: data.createdAt || new Date().toISOString()
})

// Whop API response types
export const createWhopCourse = (data) => ({
  id: data.id || '',
  title: data.title || '',
  description: data.description || '',
  status: data.status || CourseStatus.DRAFT,
  url: data.url || '',
  createdAt: data.created_at || new Date().toISOString()
})

export const createWhopProduct = (data) => ({
  id: data.id || '',
  name: data.name || '',
  price: data.price || 0,
  description: data.description || '',
  status: data.status || ProductStatus.ACTIVE,
  url: data.url || '',
  createdAt: data.created_at || new Date().toISOString()
})