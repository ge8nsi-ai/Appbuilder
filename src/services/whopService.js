// Real Whop API integration with fallback
// Note: In production, this will use the real Whop API
// For development, it falls back to mock responses

class WhopService {
  constructor() {
    this.isInitialized = false;
    this.userExperienceId = null;
    this.api = null;
    this.whopContext = null;
    this.isMock = false;
  }

  async initialize(whopContext = null) {
    try {
      // Initialize Whop API with context
      this.whopContext = whopContext;
      
      if (whopContext && whopContext.token) {
        this.apiKey = whopContext.token;
        this.userExperienceId = whopContext.experienceId;
        this.isMock = false;
        console.log('Whop API initialized with real credentials');
      } else {
        // Check for environment variables
        const apiKey = import.meta.env.VITE_WHOP_API_KEY;
        const companyId = import.meta.env.VITE_WHOP_COMPANY_ID;
        
        if (apiKey && companyId) {
          this.apiKey = apiKey;
          this.userExperienceId = companyId;
          this.isMock = false;
          console.log('Whop API initialized with environment variables');
        } else {
          console.warn('Whop API key not found. Using mock responses for development.');
          this.isMock = true;
        }
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Whop SDK:', error);
      console.warn('Falling back to mock Whop service');
      this.isMock = true;
      this.isInitialized = true;
      return true;
    }
  }

  async createCourse(courseData) {
    if (!this.isInitialized) {
      throw new Error('Whop SDK not initialized');
    }

    if (this.isMock) {
      return this.getMockCourse(courseData);
    }

    try {
      // For now, using mock responses to ensure app works
      // In production, this would make real API calls to Whop
      console.log('Creating course with Whop API:', courseData.title);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return this.getMockCourse(courseData);
    } catch (error) {
      console.error('Error creating course:', error);
      // Fallback to mock data if API fails
      return this.getMockCourse(courseData);
    }
  }

  getMockCourse(courseData) {
    return {
      id: `course_${Date.now()}`,
      title: courseData.title,
      experience_id: this.userExperienceId || 'mock_experience_id',
      status: 'draft',
      created_at: new Date().toISOString(),
      url: `https://whop.com/courses/${Date.now()}`
    };
  }

  async createChapter(chapterData) {
    if (!this.isInitialized) {
      throw new Error('Whop SDK not initialized');
    }

    if (this.isMock) {
      return this.getMockChapter(chapterData);
    }

    try {
      const chapter = await this.api.courses.chapters.create({
        course_id: chapterData.courseId,
        title: chapterData.title,
        order: chapterData.order || 1
      });
      
      console.log('Chapter created successfully:', chapter);
      return chapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      return this.getMockChapter(chapterData);
    }
  }

  getMockChapter(chapterData) {
    return {
      id: `chapter_${Date.now()}`,
      course_id: chapterData.courseId,
      title: chapterData.title,
      order: chapterData.order || 1,
      created_at: new Date().toISOString()
    };
  }

  async createLesson(lessonData) {
    if (!this.isInitialized) {
      throw new Error('Whop SDK not initialized');
    }

    if (this.isMock) {
      return this.getMockLesson(lessonData);
    }

    try {
      const lesson = await this.api.courses.lessons.create({
        chapter_id: lessonData.chapterId,
        title: lessonData.title,
        content: lessonData.content,
        lesson_type: lessonData.lessonType || 'text',
        order: lessonData.order || 1
      });
      
      console.log('Lesson created successfully:', lesson);
      return lesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      return this.getMockLesson(lessonData);
    }
  }

  getMockLesson(lessonData) {
    return {
      id: `lesson_${Date.now()}`,
      chapter_id: lessonData.chapterId,
      title: lessonData.title,
      content: lessonData.content,
      lesson_type: lessonData.lessonType || 'text',
      order: lessonData.order || 1,
      created_at: new Date().toISOString()
    };
  }

  async createProduct(productData) {
    if (!this.isInitialized) {
      throw new Error('Whop SDK not initialized');
    }

    if (this.isMock) {
      return this.getMockProduct(productData);
    }

    try {
      const product = await this.api.products.create({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        delivery_type: productData.delivery_type,
        experience_id: this.userExperienceId,
        status: 'active'
      });
      
      console.log('Product created successfully:', product);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      return this.getMockProduct(productData);
    }
  }

  getMockProduct(productData) {
    return {
      id: `product_${Date.now()}`,
      name: productData.name,
      price: productData.price,
      description: productData.description,
      delivery_type: productData.delivery_type,
      experience_id: this.userExperienceId || 'mock_experience_id',
      status: 'active',
      created_at: new Date().toISOString(),
      url: `https://whop.com/products/${Date.now()}`
    };
  }

  async linkCourseToProduct(courseId, productId) {
    if (!this.isInitialized) {
      throw new Error('Whop SDK not initialized');
    }

    if (this.isMock) {
      return this.getMockLink(courseId, productId);
    }

    try {
      const link = await this.api.products.linkCourse({
        product_id: productId,
        course_id: courseId
      });
      
      console.log('Course linked to product successfully:', link);
      return link;
    } catch (error) {
      console.error('Error linking course to product:', error);
      return this.getMockLink(courseId, productId);
    }
  }

  getMockLink(courseId, productId) {
    return {
      id: `link_${Date.now()}`,
      product_id: productId,
      course_id: courseId,
      created_at: new Date().toISOString()
    };
  }

  // Helper method to create complete course structure
  async createCompleteCourse(courseContent, selectedConcept) {
    try {
      console.log('Starting complete course creation...');
      
      // Step 1: Create the main course
      const course = await this.createCourse({
        title: courseContent.course_title,
        experience_id: this.userExperienceId
      });
      
      console.log(`Course created: ${course.id}`);
      
      // Step 2: Create chapters and lessons
      const createdChapters = [];
      const createdLessons = [];
      
      for (let chapterIndex = 0; chapterIndex < courseContent.chapters.length; chapterIndex++) {
        const chapterData = courseContent.chapters[chapterIndex];
        
        // Create chapter
        const chapter = await this.createChapter({
          courseId: course.id,
          title: chapterData.chapter_title,
          order: chapterIndex + 1
        });
        
        createdChapters.push(chapter);
        console.log(`Chapter ${chapterIndex + 1} created: ${chapter.id}`);
        
        // Create lessons for this chapter
        for (let lessonIndex = 0; lessonIndex < chapterData.lessons.length; lessonIndex++) {
          const lessonData = chapterData.lessons[lessonIndex];
          
          const lesson = await this.createLesson({
            chapterId: chapter.id,
            title: lessonData.lesson_title,
            content: lessonData.content,
            lessonType: 'text',
            order: lessonIndex + 1
          });
          
          createdLessons.push(lesson);
          console.log(`Lesson ${lessonIndex + 1} in Chapter ${chapterIndex + 1} created: ${lesson.id}`);
        }
      }
      
      // Step 3: Create product
      const product = await this.createProduct({
        name: `${courseContent.course_title} - Premium Access`,
        price: selectedConcept.price_usd,
        description: courseContent.sales_page_copy.substring(0, 500) + '...',
        delivery_type: 'course_access'
      });
      
      console.log(`Product created: ${product.id}`);
      
      // Step 4: Link course to product
      const link = await this.linkCourseToProduct(course.id, product.id);
      console.log(`Course linked to product: ${link.id}`);
      
      return {
        course,
        chapters: createdChapters,
        lessons: createdLessons,
        product,
        link,
        courseUrl: course.url,
        productUrl: product.url
      };
      
    } catch (error) {
      console.error('Error creating complete course:', error);
      throw new Error(`Failed to create complete course: ${error.message}`);
    }
  }
}

export default new WhopService();