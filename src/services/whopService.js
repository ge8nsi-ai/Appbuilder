import { createWhopCourse, createWhopProduct } from '../types/index.js'

class WhopService {
  constructor() {
    this.apiKey = import.meta.env.VITE_WHOP_API_KEY
    this.companyId = import.meta.env.VITE_WHOP_COMPANY_ID
    this.appId = import.meta.env.VITE_WHOP_APP_ID
    this.agentUserId = import.meta.env.VITE_WHOP_AGENT_USER_ID
    this.baseUrl = 'https://api.whop.com/api/v2'
    this.isInitialized = false
    this.isMock = !this.apiKey
  }

  async initialize() {
    if (this.isMock) {
      console.warn('Whop API key not found. Using mock service for development.')
      this.isInitialized = true
      return true
    }

    try {
      // Test API connection
      const response = await fetch(`${this.baseUrl}/companies/${this.companyId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API connection failed: ${response.status}`)
      }

      this.isInitialized = true
      console.log('Whop service initialized successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize Whop service:', error)
      this.isMock = true
      this.isInitialized = true
      return true
    }
  }

  async createCourse(courseData) {
    if (!this.isInitialized) {
      throw new Error('Whop service not initialized')
    }

    if (this.isMock) {
      return this.createMockCourse(courseData)
    }

    try {
      const response = await fetch(`${this.baseUrl}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          company_id: this.companyId,
          status: 'draft'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create course: ${response.status}`)
      }

      const course = await response.json()
      return createWhopCourse(course)
    } catch (error) {
      console.error('Error creating course:', error)
      return this.createMockCourse(courseData)
    }
  }

  async createProduct(productData) {
    if (!this.isInitialized) {
      throw new Error('Whop service not initialized')
    }

    if (this.isMock) {
      return this.createMockProduct(productData)
    }

    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          company_id: this.companyId,
          status: 'active'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status}`)
      }

      const product = await response.json()
      return createWhopProduct(product)
    } catch (error) {
      console.error('Error creating product:', error)
      return this.createMockProduct(productData)
    }
  }

  async createChapter(courseId, chapterData) {
    if (!this.isInitialized) {
      throw new Error('Whop service not initialized')
    }

    if (this.isMock) {
      return this.createMockChapter(courseId, chapterData)
    }

    try {
      const response = await fetch(`${this.baseUrl}/courses/${courseId}/chapters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: chapterData.title,
          description: chapterData.description,
          order: chapterData.order
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create chapter: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating chapter:', error)
      return this.createMockChapter(courseId, chapterData)
    }
  }

  async createLesson(chapterId, lessonData) {
    if (!this.isInitialized) {
      throw new Error('Whop service not initialized')
    }

    if (this.isMock) {
      return this.createMockLesson(chapterId, lessonData)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chapters/${chapterId}/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: lessonData.title,
          content: lessonData.content,
          order: lessonData.order,
          type: lessonData.type || 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create lesson: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating lesson:', error)
      return this.createMockLesson(chapterId, lessonData)
    }
  }

  async linkCourseToProduct(courseId, productId) {
    if (!this.isInitialized) {
      throw new Error('Whop service not initialized')
    }

    if (this.isMock) {
      return this.createMockLink(courseId, productId)
    }

    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: courseId
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to link course to product: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error linking course to product:', error)
      return this.createMockLink(courseId, productId)
    }
  }

  // Mock implementations for development
  createMockCourse(courseData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createWhopCourse({
          id: `course_${Date.now()}`,
          title: courseData.title,
          description: courseData.description,
          status: 'draft',
          url: `https://whop.com/courses/${Date.now()}`
        }))
      }, 1000)
    })
  }

  createMockProduct(productData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createWhopProduct({
          id: `product_${Date.now()}`,
          name: productData.name,
          price: productData.price,
          description: productData.description,
          status: 'active',
          url: `https://whop.com/products/${Date.now()}`
        }))
      }, 1000)
    })
  }

  createMockChapter(courseId, chapterData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `chapter_${Date.now()}`,
          course_id: courseId,
          title: chapterData.title,
          description: chapterData.description,
          order: chapterData.order
        })
      }, 500)
    })
  }

  createMockLesson(chapterId, lessonData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `lesson_${Date.now()}`,
          chapter_id: chapterId,
          title: lessonData.title,
          content: lessonData.content,
          order: lessonData.order,
          type: lessonData.type || 'text'
        })
      }, 500)
    })
  }

  createMockLink(courseId, productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `link_${Date.now()}`,
          course_id: courseId,
          product_id: productId
        })
      }, 500)
    })
  }
}

export default new WhopService()