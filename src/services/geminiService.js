import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('Gemini API key is required. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateCourseConcepts(uvzData) {
    const prompt = `
You are an Expert Digital Product Strategist with 10+ years of experience in creating high-converting digital courses.

Analyze the user's input to define their Unique Value Zone (UVZ):
- Skills & Expertise: ${uvzData.skills}
- Passions & Interests: ${uvzData.passions}
- Proven Results/Solutions: ${uvzData.results}

Based on this UVZ, generate exactly 3 distinct, high-demand digital course ideas that:
1. Leverage their unique expertise and passion
2. Address a real market need
3. Have a clear, compelling promise
4. Target a specific, identifiable audience
5. Are priced at $97 or higher

For each course concept, provide:
- A compelling course name (max 60 characters)
- A clear core promise/outcome (max 100 characters)
- A specific target audience description (max 80 characters)
- A suggested price point ($97-$997 range)

Output MUST be a valid JSON array with this exact structure:
[
  {
    "course_name": "Course Name Here",
    "core_promise": "What students will achieve",
    "target_audience": "Who this course is for",
    "price_usd": 197
  },
  {
    "course_name": "Second Course Name",
    "core_promise": "Second promise",
    "target_audience": "Second audience",
    "price_usd": 297
  },
  {
    "course_name": "Third Course Name",
    "core_promise": "Third promise",
    "target_audience": "Third audience",
    "price_usd": 397
  }
]

Focus on courses that can be taught through text-based lessons and have proven market demand.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const courseConcepts = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!Array.isArray(courseConcepts) || courseConcepts.length !== 3) {
        throw new Error('AI response does not contain exactly 3 course concepts');
      }
      
      return courseConcepts;
    } catch (error) {
      console.error('Error generating course concepts:', error);
      throw new Error(`Failed to generate course concepts: ${error.message}`);
    }
  }

  async generateCourseContent(selectedConcept) {
    const prompt = `
You are a Senior Course Designer & Copywriter with expertise in creating comprehensive digital courses and high-converting sales materials.

Based on the selected course concept:
- Course Name: ${selectedConcept.course_name}
- Core Promise: ${selectedConcept.core_promise}
- Target Audience: ${selectedConcept.target_audience}
- Price: $${selectedConcept.price_usd}

Generate a complete course structure with:

1. COURSE STRUCTURE:
   - 5 comprehensive chapters (modules)
   - 3 detailed lessons per chapter (15 total lessons)
   - Each lesson should be 500-1000 words of valuable, actionable content
   - Content should be in markdown format

2. SALES PAGE COPY:
   - High-converting VSL (Video Sales Letter) script format
   - Include compelling headlines, benefits, social proof, urgency, and call-to-action
   - Focus on the transformation and results students will achieve

3. EMAIL NURTURE SEQUENCE:
   - 5-part email sequence for nurturing leads
   - Each email should have a clear subject line and compelling body
   - Build trust, provide value, and guide toward purchase

Output MUST be a valid JSON object with this exact structure:
{
  "course_title": "Full Course Title",
  "chapters": [
    {
      "chapter_title": "Chapter 1 Title",
      "lessons": [
        {
          "lesson_title": "Lesson 1.1 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 1.2 Title", 
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 1.3 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        }
      ]
    },
    {
      "chapter_title": "Chapter 2 Title",
      "lessons": [
        {
          "lesson_title": "Lesson 2.1 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 2.2 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 2.3 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        }
      ]
    },
    {
      "chapter_title": "Chapter 3 Title",
      "lessons": [
        {
          "lesson_title": "Lesson 3.1 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 3.2 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 3.3 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        }
      ]
    },
    {
      "chapter_title": "Chapter 4 Title",
      "lessons": [
        {
          "lesson_title": "Lesson 4.1 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 4.2 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 4.3 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        }
      ]
    },
    {
      "chapter_title": "Chapter 5 Title",
      "lessons": [
        {
          "lesson_title": "Lesson 5.1 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 5.2 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        },
        {
          "lesson_title": "Lesson 5.3 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        }
      ]
    }
  ],
  "sales_page_copy": "# High-Converting Sales Page\n\n## Headline\n\nCompelling headline here...\n\n## Benefits\n\n- Benefit 1\n- Benefit 2\n- Benefit 3\n\n## Social Proof\n\nTestimonials and results...\n\n## Call to Action\n\nStrong CTA here...",
  "email_nurture": [
    {
      "subject": "Email 1 Subject Line",
      "body": "# Email 1 Content\n\nEmail body content in markdown..."
    },
    {
      "subject": "Email 2 Subject Line", 
      "body": "# Email 2 Content\n\nEmail body content in markdown..."
    },
    {
      "subject": "Email 3 Subject Line",
      "body": "# Email 3 Content\n\nEmail body content in markdown..."
    },
    {
      "subject": "Email 4 Subject Line",
      "body": "# Email 4 Content\n\nEmail body content in markdown..."
    },
    {
      "subject": "Email 5 Subject Line",
      "body": "# Email 5 Content\n\nEmail body content in markdown..."
    }
  ]
}

Make sure the content is valuable, actionable, and directly addresses the target audience's pain points and desired outcomes.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const courseContent = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!courseContent.course_title || !courseContent.chapters || !courseContent.sales_page_copy || !courseContent.email_nurture) {
        throw new Error('AI response missing required fields');
      }
      
      if (!Array.isArray(courseContent.chapters) || courseContent.chapters.length !== 5) {
        throw new Error('AI response does not contain exactly 5 chapters');
      }
      
      if (!Array.isArray(courseContent.email_nurture) || courseContent.email_nurture.length !== 5) {
        throw new Error('AI response does not contain exactly 5 email nurture messages');
      }
      
      return courseContent;
    } catch (error) {
      console.error('Error generating course content:', error);
      throw new Error(`Failed to generate course content: ${error.message}`);
    }
  }
}

export default new GeminiService();