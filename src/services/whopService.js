// Mock WhopAPI for development - will be replaced with real @whop/api in production
const WhopAPI = class {
  constructor(config) {
    this.config = config;
  }
  
  async courses() {
    return {
      create: async (data) => {
        console.log('Creating course:', data);
        return {
          id: `course_${Date.now()}`,
          title: data.title,
          experience_id: data.experience_id,
          status: 'draft',
          created_at: new Date().toISOString(),
          url: `https://whop.com/courses/${Date.now()}`
        };
      },
      chapters: {
        create: async (data) => {
          console.log('Creating chapter:', data);
          return {
            id: `chapter_${Date.now()}`,
            course_id: data.course_id,
            title: data.title,
            order: data.order || 1,
            created_at: new Date().toISOString()
          };
        }
      },
      lessons: {
        create: async (data) => {
          console.log('Creating lesson:', data);
          return {
            id: `lesson_${Date.now()}`,
            chapter_id: data.chapter_id,
            title: data.title,
            content: data.content,
            lesson_type: data.lesson_type || 'text',
            order: data.order || 1,
            created_at: new Date().toISOString()
          };
        }
      }
    };
  }
  
  async products() {
    return {
      create: async (data) => {
        console.log('Creating product:', data);
        return {
          id: `product_${Date.now()}`,
          name: data.name,
          price: data.price,
          description: data.description,
          delivery_type: data.delivery_type,
          experience_id: data.experience_id,
          status: 'active',
          created_at: new Date().toISOString(),
          url: `https://whop.com/products/${Date.now()}`
        };
      },
      linkCourse: async (data) => {
        console.log('Linking course to product:', data);
        return {
          id: `link_${Date.now()}`,
          product_id: data.product_id,
          course_id: data.course_id,
          created_at: new Date().toISOString()
        };
      }
    };
  }
};

class WhopService {
  constructor() {
    this.isInitialized = false;
    this.userExperienceId = null;
    this.api = null;
    this.whopContext = null;
  }

  async initialize(whopContext = null) {
    try {
      // Initialize Whop API with context
      this.whopContext = whopContext;
      
      if (whopContext) {
        this.api = new WhopAPI({
          token: whopContext.token,
          experienceId: whopContext.experienceId
        });
        this.userExperienceId = whopContext.experienceId;
      } else {
        // Fallback for development/testing
        this.api = new WhopAPI({
          token: import.meta.env.WHOP_API_KEY || 'dev_token',
          appId: import.meta.env.NEXT_PUBLIC_WHOP_APP_ID,
          companyId: import.meta.env.NEXT_PUBLIC_WHOP_COMPANY_ID
        });
        this.userExperienceId = import.meta.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
      }
      
      this.isInitialized = true;
      console.log('Whop SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Whop SDK:', error);
      throw new Error('Failed to initialize Whop SDK');
    }
  }

  async createCourse(courseData) {
    if (!this.isInitialized || !this.api) {
      throw new Error('Whop SDK not initialized');
    }

    try {
      const course = await this.api.courses.create({
        title: courseData.title,
        experience_id: this.userExperienceId,
        description: courseData.description || '',
        status: 'draft'
      });
      
      console.log('Course created successfully:', course);
      return course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error(`Failed to create course: ${error.message}`);
    }
  }

  async createChapter(chapterData) {
    if (!this.isInitialized || !this.api) {
      throw new Error('Whop SDK not initialized');
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
      throw new Error(`Failed to create chapter: ${error.message}`);
    }
  }

  async createLesson(lessonData) {
    if (!this.isInitialized || !this.api) {
      throw new Error('Whop SDK not initialized');
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
      throw new Error(`Failed to create lesson: ${error.message}`);
    }
  }

  async createProduct(productData) {
    if (!this.isInitialized || !this.api) {
      throw new Error('Whop SDK not initialized');
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
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async linkCourseToProduct(courseId, productId) {
    if (!this.isInitialized || !this.api) {
      throw new Error('Whop SDK not initialized');
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
      throw new Error(`Failed to link course to product: ${error.message}`);
    }
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