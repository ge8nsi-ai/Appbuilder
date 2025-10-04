import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Using mock responses for development.');
      this.isMock = true;
      return;
    }
    this.isMock = false;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async generateCourseConcepts(keywords) {
    // Return mock data for development if API key is not available
    if (this.isMock) {
      console.log('Using mock course concepts for development');
      return this.getMockCourseConcepts(keywords);
    }

    const prompt = `
You are an Expert Digital Product Strategist with 10+ years of experience in creating high-converting digital courses.

Based on these keywords: "${keywords}"

Generate exactly 10 distinct, high-demand digital course ideas that:
1. Are directly related to the keywords provided
2. Address real market needs and pain points
3. Have clear, compelling promises
4. Target specific, identifiable audiences
5. Are priced at $97 or higher
6. Can be taught through text-based lessons

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
  },
  {
    "course_name": "Fourth Course Name",
    "core_promise": "Fourth promise",
    "target_audience": "Fourth audience",
    "price_usd": 497
  },
  {
    "course_name": "Fifth Course Name",
    "core_promise": "Fifth promise",
    "target_audience": "Fifth audience",
    "price_usd": 597
  },
  {
    "course_name": "Sixth Course Name",
    "core_promise": "Sixth promise",
    "target_audience": "Sixth audience",
    "price_usd": 697
  },
  {
    "course_name": "Seventh Course Name",
    "core_promise": "Seventh promise",
    "target_audience": "Seventh audience",
    "price_usd": 797
  },
  {
    "course_name": "Eighth Course Name",
    "core_promise": "Eighth promise",
    "target_audience": "Eighth audience",
    "price_usd": 897
  },
  {
    "course_name": "Ninth Course Name",
    "core_promise": "Ninth promise",
    "target_audience": "Ninth audience",
    "price_usd": 997
  },
  {
    "course_name": "Tenth Course Name",
    "core_promise": "Tenth promise",
    "target_audience": "Tenth audience",
    "price_usd": 197
  }
]

Focus on courses that have proven market demand and can generate significant revenue.
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
      if (!Array.isArray(courseConcepts) || courseConcepts.length !== 10) {
        throw new Error('AI response does not contain exactly 10 course concepts');
      }
      
      return courseConcepts;
    } catch (error) {
      console.error('Error generating course concepts:', error);
      // Fallback to mock data if API fails
      return this.getMockCourseConcepts(keywords);
    }
  }

  getMockCourseConcepts(keywords) {
    const baseConcepts = [
      {
        course_name: `${keywords} Mastery Program`,
        core_promise: `Master ${keywords} from beginner to expert level`,
        target_audience: `Beginners wanting to learn ${keywords}`,
        price_usd: 197
      },
      {
        course_name: `${keywords} Business Blueprint`,
        core_promise: `Build a profitable ${keywords} business from scratch`,
        target_audience: `Entrepreneurs interested in ${keywords}`,
        price_usd: 297
      },
      {
        course_name: `Advanced ${keywords} Strategies`,
        core_promise: `Advanced techniques for ${keywords} professionals`,
        target_audience: `Experienced ${keywords} practitioners`,
        price_usd: 397
      },
      {
        course_name: `${keywords} for Beginners`,
        core_promise: `Complete beginner's guide to ${keywords}`,
        target_audience: `Complete beginners in ${keywords}`,
        price_usd: 197
      },
      {
        course_name: `${keywords} Certification Course`,
        core_promise: `Get certified in ${keywords} with industry recognition`,
        target_audience: `Professionals seeking ${keywords} certification`,
        price_usd: 497
      },
      {
        course_name: `${keywords} Marketing Mastery`,
        core_promise: `Learn to market ${keywords} effectively`,
        target_audience: `Marketers focusing on ${keywords}`,
        price_usd: 297
      },
      {
        course_name: `${keywords} Automation Secrets`,
        core_promise: `Automate your ${keywords} processes for efficiency`,
        target_audience: `Professionals wanting to automate ${keywords}`,
        price_usd: 397
      },
      {
        course_name: `${keywords} Success Formula`,
        core_promise: `Proven formula for ${keywords} success`,
        target_audience: `Individuals seeking ${keywords} success`,
        price_usd: 597
      },
      {
        course_name: `${keywords} Expert Training`,
        core_promise: `Become an expert in ${keywords} field`,
        target_audience: `Serious learners of ${keywords}`,
        price_usd: 697
      },
      {
        course_name: `${keywords} Complete System`,
        core_promise: `Complete system for mastering ${keywords}`,
        target_audience: `Comprehensive ${keywords} learners`,
        price_usd: 797
      }
    ];

    return baseConcepts;
  }

  async generateCourseContent(selectedConcept) {
    // Return mock data for development if API key is not available
    if (this.isMock) {
      console.log('Using mock course content for development');
      return this.getMockCourseContent(selectedConcept);
    }

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
      // Fallback to mock data if API fails
      return this.getMockCourseContent(selectedConcept);
    }
  }

  getMockCourseContent(selectedConcept) {
    return {
      course_title: selectedConcept.course_name,
      chapters: [
        {
          chapter_title: "Introduction & Foundation",
          lessons: [
            {
              lesson_title: "Welcome to Your Journey",
              content: "# Welcome to Your Journey\n\nWelcome to this comprehensive course! In this lesson, you'll learn the fundamentals and get ready for your transformation.\n\n## What You'll Learn\n- Key concepts and principles\n- How to get the most out of this course\n- Setting up your learning environment\n\n## Action Steps\n1. Complete the pre-course assessment\n2. Set up your workspace\n3. Join the community forum\n\nLet's begin your journey to mastery!"
            },
            {
              lesson_title: "Understanding the Basics",
              content: "# Understanding the Basics\n\nIn this lesson, we'll cover the essential concepts you need to know.\n\n## Core Concepts\n- Fundamental principles\n- Key terminology\n- Common misconceptions\n\n## Practical Application\n- Real-world examples\n- Case studies\n- Hands-on exercises\n\nBy the end of this lesson, you'll have a solid foundation to build upon."
            },
            {
              lesson_title: "Setting Your Goals",
              content: "# Setting Your Goals\n\nGoal setting is crucial for your success. Let's create a clear roadmap.\n\n## SMART Goals Framework\n- Specific\n- Measurable\n- Achievable\n- Relevant\n- Time-bound\n\n## Creating Your Action Plan\n- Short-term goals\n- Long-term vision\n- Milestone tracking\n\nYou'll leave this lesson with a clear plan for your journey."
            }
          ]
        },
        {
          chapter_title: "Core Skills Development",
          lessons: [
            {
              lesson_title: "Essential Skills Overview",
              content: "# Essential Skills Overview\n\nThis lesson covers the core skills you need to master.\n\n## Key Skills\n- Technical skills\n- Soft skills\n- Industry-specific knowledge\n\n## Skill Development Strategy\n- Learning methods\n- Practice techniques\n- Progress tracking\n\nMaster these skills and you'll be unstoppable!"
            },
            {
              lesson_title: "Hands-On Practice",
              content: "# Hands-On Practice\n\nPractice makes perfect! Let's apply what you've learned.\n\n## Practical Exercises\n- Step-by-step tutorials\n- Real-world projects\n- Problem-solving challenges\n\n## Getting Feedback\n- Self-assessment\n- Peer review\n- Expert guidance\n\nPractice regularly and watch your skills improve rapidly."
            },
            {
              lesson_title: "Advanced Techniques",
              content: "# Advanced Techniques\n\nNow let's explore advanced methods and strategies.\n\n## Advanced Concepts\n- Complex techniques\n- Industry secrets\n- Expert-level strategies\n\n## Implementation\n- How to apply advanced techniques\n- Common pitfalls to avoid\n- Scaling your approach\n\nThese advanced techniques will set you apart from the competition."
            }
          ]
        },
        {
          chapter_title: "Implementation & Strategy",
          lessons: [
            {
              lesson_title: "Strategic Planning",
              content: "# Strategic Planning\n\nLearn how to create and execute effective strategies.\n\n## Strategy Framework\n- Analysis and planning\n- Resource allocation\n- Risk management\n\n## Execution\n- Implementation timeline\n- Monitoring progress\n- Adjusting course\n\nA solid strategy is the foundation of success."
            },
            {
              lesson_title: "Building Systems",
              content: "# Building Systems\n\nSystems are the key to sustainable success.\n\n## System Design\n- Creating efficient workflows\n- Automation opportunities\n- Quality control measures\n\n## Optimization\n- Continuous improvement\n- Performance metrics\n- Scaling systems\n\nBuild systems that work for you, not against you."
            },
            {
              lesson_title: "Measuring Success",
              content: "# Measuring Success\n\nHow do you know if you're succeeding? Let's define and track success.\n\n## Success Metrics\n- Key performance indicators\n- Progress tracking\n- Milestone celebrations\n\n## Continuous Improvement\n- Regular reviews\n- Feedback loops\n- Adaptation strategies\n\nSuccess is a journey, not a destination."
            }
          ]
        },
        {
          chapter_title: "Advanced Applications",
          lessons: [
            {
              lesson_title: "Real-World Applications",
              content: "# Real-World Applications\n\nSee how to apply your knowledge in real situations.\n\n## Case Studies\n- Success stories\n- Common challenges\n- Solutions and strategies\n\n## Practical Implementation\n- Step-by-step guides\n- Best practices\n- Common mistakes to avoid\n\nReal-world application is where theory meets practice."
            },
            {
              lesson_title: "Scaling Your Approach",
              content: "# Scaling Your Approach\n\nLearn how to scale your efforts for maximum impact.\n\n## Scaling Strategies\n- Growth planning\n- Resource management\n- Team building\n\n## Challenges and Solutions\n- Common scaling issues\n- Problem-solving approaches\n- Maintaining quality\n\nScale smart, not just fast."
            },
            {
              lesson_title: "Industry Insights",
              content: "# Industry Insights\n\nGet insider knowledge from industry experts.\n\n## Market Trends\n- Current industry trends\n- Future predictions\n- Opportunity identification\n\n## Expert Perspectives\n- Industry leader insights\n- Best practices\n- Innovation opportunities\n\nStay ahead of the curve with these insights."
            }
          ]
        },
        {
          chapter_title: "Mastery & Beyond",
          lessons: [
            {
              lesson_title: "Achieving Mastery",
              content: "# Achieving Mastery\n\nMastery is a journey, not a destination. Let's explore what it means.\n\n## Mastery Mindset\n- Continuous learning\n- Humility and growth\n- Teaching others\n\n## Mastery Practices\n- Deliberate practice\n- Feedback seeking\n- Knowledge sharing\n\nTrue mastery comes from helping others succeed."
            },
            {
              lesson_title: "Building Your Legacy",
              content: "# Building Your Legacy\n\nWhat will you leave behind? Let's create lasting impact.\n\n## Legacy Building\n- Impact measurement\n- Knowledge transfer\n- Mentorship\n\n## Long-term Vision\n- Future planning\n- Succession planning\n- Community building\n\nBuild a legacy that inspires others."
            },
            {
              lesson_title: "Next Steps & Resources",
              content: "# Next Steps & Resources\n\nYour journey continues! Here's how to keep growing.\n\n## Continued Learning\n- Advanced resources\n- Community engagement\n- Ongoing education\n\n## Support Network\n- Mentorship opportunities\n- Peer connections\n- Expert access\n\nRemember: learning never stops, and neither should you!"
            }
          ]
        }
      ],
      sales_page_copy: `# ${selectedConcept.course_name} - Sales Page

## Transform Your Life with ${selectedConcept.course_name}

Are you ready to ${selectedConcept.core_promise.toLowerCase()}?

This comprehensive course is designed specifically for ${selectedConcept.target_audience.toLowerCase()}.

## What You'll Get:

✅ **5 Complete Chapters** with 15 detailed lessons
✅ **Step-by-step guidance** from beginner to expert
✅ **Real-world applications** and case studies
✅ **Lifetime access** to all course materials
✅ **Community support** and expert guidance

## Special Launch Price: $${selectedConcept.price_usd}

*Regular price: $${selectedConcept.price_usd * 2}*

## Limited Time Offer - Act Now!

Don't miss this opportunity to transform your skills and achieve your goals.

[GET INSTANT ACCESS NOW]`,

      email_nurture: [
        {
          subject: `Welcome to ${selectedConcept.course_name}!`,
          body: `# Welcome to Your Journey!\n\nCongratulations on taking the first step towards ${selectedConcept.core_promise.toLowerCase()}!\n\nIn this course, you'll learn everything you need to know to succeed.\n\n## What's Next?\n1. Complete the introduction module\n2. Join our community forum\n3. Start with the first lesson\n\nWe're excited to be part of your journey!\n\nBest regards,\nThe Course Team`
        },
        {
          subject: "Your First Lesson is Ready!",
          body: `# Ready for Your First Lesson?\n\nYou're about to begin an amazing journey!\n\n## Today's Focus\n- Understanding the fundamentals\n- Setting your goals\n- Creating your action plan\n\n## Pro Tip\nTake notes as you go through the lessons. This will help you retain the information better.\n\nReady to start? Let's go!\n\nHappy learning!`
        },
        {
          subject: "How's Your Progress?",
          body: `# Checking In on Your Progress\n\nHow are you finding the course so far?\n\n## Quick Check\n- Are you following along with the lessons?\n- Do you have any questions?\n- What's your biggest takeaway so far?\n\n## Need Help?\nDon't hesitate to reach out if you have any questions. We're here to support you!\n\nKeep up the great work!`
        },
        {
          subject: "Advanced Techniques Coming Up!",
          body: `# Ready for Advanced Techniques?\n\nYou've mastered the basics - now let's level up!\n\n## What's Coming\n- Advanced strategies and techniques\n- Real-world case studies\n- Expert insights and tips\n\n## Preparation\nMake sure you've completed the foundational lessons before moving to advanced topics.\n\nYou're doing great! Keep going!`
        },
        {
          subject: "Congratulations - You're Almost There!",
          body: `# You're Almost at the Finish Line!\n\nAmazing work! You've come so far in this course.\n\n## Final Steps\n- Complete the remaining lessons\n- Review your notes\n- Plan your next steps\n\n## What's Next?\nAfter completing this course, you'll have all the tools you need to ${selectedConcept.core_promise.toLowerCase()}.\n\nWe're proud of your dedication and progress!\n\nCongratulations on your achievement!`
        }
      ]
    };
  }
}

export default new GeminiService();