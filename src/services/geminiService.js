import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
    this.isMock = !this.apiKey
    
    if (!this.isMock) {
      this.genAI = new GoogleGenerativeAI(this.apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    }
  }

  async generateCourseConcepts(keywords) {
    if (this.isMock) {
      return this.getMockCourseConcepts(keywords)
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
    "title": "Course Name Here",
    "description": "What students will achieve",
    "targetAudience": "Who this course is for",
    "pricePoint": 197
  }
]

Focus on courses that have proven market demand and can generate significant revenue.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI')
      }
      
      const concepts = JSON.parse(jsonMatch[0])
      
      if (!Array.isArray(concepts) || concepts.length !== 10) {
        throw new Error('AI response does not contain exactly 10 course concepts')
      }
      
      return concepts.map((concept, index) => ({
        id: `concept_${index + 1}`,
        title: concept.title,
        description: concept.description,
        targetAudience: concept.targetAudience,
        pricePoint: concept.pricePoint,
        estimatedDuration: '2-4 weeks',
        difficulty: 'beginner',
        tags: keywords.split(',').map(k => k.trim())
      }))
    } catch (error) {
      console.error('Error generating course concepts:', error)
      return this.getMockCourseConcepts(keywords)
    }
  }

  async generateCourseContent(selectedConcept) {
    if (this.isMock) {
      return this.getMockCourseContent(selectedConcept)
    }

    const prompt = `
You are a Senior Course Designer & Copywriter with expertise in creating comprehensive digital courses and high-converting sales materials.

Based on the selected course concept:
- Course Name: ${selectedConcept.title}
- Core Promise: ${selectedConcept.description}
- Target Audience: ${selectedConcept.targetAudience}
- Price: $${selectedConcept.pricePoint}

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
  "title": "Full Course Title",
  "description": "Course description",
  "chapters": [
    {
      "title": "Chapter 1 Title",
      "description": "Chapter description",
      "lessons": [
        {
          "title": "Lesson 1.1 Title",
          "content": "# Lesson Content in Markdown\n\nDetailed lesson content here..."
        }
      ]
    }
  ],
  "salesPage": "# High-Converting Sales Page\n\n## Headline\n\nCompelling headline here...",
  "emailSequence": [
    {
      "subject": "Email 1 Subject Line",
      "body": "# Email 1 Content\n\nEmail body content in markdown..."
    }
  ]
}

Make sure the content is valuable, actionable, and directly addresses the target audience's pain points and desired outcomes.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI')
      }
      
      const content = JSON.parse(jsonMatch[0])
      
      if (!content.title || !content.chapters || !content.salesPage || !content.emailSequence) {
        throw new Error('AI response missing required fields')
      }
      
      return {
        id: `content_${Date.now()}`,
        title: content.title,
        description: content.description || selectedConcept.description,
        chapters: content.chapters.map((chapter, chapterIndex) => ({
          id: `chapter_${chapterIndex + 1}`,
          title: chapter.title,
          description: chapter.description || '',
          order: chapterIndex + 1,
          lessons: chapter.lessons.map((lesson, lessonIndex) => ({
            id: `lesson_${chapterIndex + 1}_${lessonIndex + 1}`,
            title: lesson.title,
            content: lesson.content,
            order: lessonIndex + 1,
            type: 'text'
          }))
        })),
        salesPage: content.salesPage,
        emailSequence: content.emailSequence,
        vslScript: content.salesPage
      }
    } catch (error) {
      console.error('Error generating course content:', error)
      return this.getMockCourseContent(selectedConcept)
    }
  }

  getMockCourseConcepts(keywords) {
    const baseConcepts = [
      {
        id: 'concept_1',
        title: `${keywords} Mastery Program`,
        description: `Master ${keywords} from beginner to expert level`,
        targetAudience: `Beginners wanting to learn ${keywords}`,
        pricePoint: 197,
        estimatedDuration: '2-4 weeks',
        difficulty: 'beginner',
        tags: [keywords]
      },
      {
        id: 'concept_2',
        title: `${keywords} Business Blueprint`,
        description: `Build a profitable ${keywords} business from scratch`,
        targetAudience: `Entrepreneurs interested in ${keywords}`,
        pricePoint: 297,
        estimatedDuration: '3-5 weeks',
        difficulty: 'intermediate',
        tags: [keywords, 'business']
      },
      {
        id: 'concept_3',
        title: `Advanced ${keywords} Strategies`,
        description: `Advanced techniques for ${keywords} professionals`,
        targetAudience: `Experienced ${keywords} practitioners`,
        pricePoint: 397,
        estimatedDuration: '4-6 weeks',
        difficulty: 'advanced',
        tags: [keywords, 'advanced']
      },
      {
        id: 'concept_4',
        title: `${keywords} for Beginners`,
        description: `Complete beginner's guide to ${keywords}`,
        targetAudience: `Complete beginners in ${keywords}`,
        pricePoint: 197,
        estimatedDuration: '2-3 weeks',
        difficulty: 'beginner',
        tags: [keywords, 'beginner']
      },
      {
        id: 'concept_5',
        title: `${keywords} Certification Course`,
        description: `Get certified in ${keywords} with industry recognition`,
        targetAudience: `Professionals seeking ${keywords} certification`,
        pricePoint: 497,
        estimatedDuration: '6-8 weeks',
        difficulty: 'intermediate',
        tags: [keywords, 'certification']
      },
      {
        id: 'concept_6',
        title: `${keywords} Marketing Mastery`,
        description: `Learn to market ${keywords} effectively`,
        targetAudience: `Marketers focusing on ${keywords}`,
        pricePoint: 297,
        estimatedDuration: '3-4 weeks',
        difficulty: 'intermediate',
        tags: [keywords, 'marketing']
      },
      {
        id: 'concept_7',
        title: `${keywords} Automation Secrets`,
        description: `Automate your ${keywords} processes for efficiency`,
        targetAudience: `Professionals wanting to automate ${keywords}`,
        pricePoint: 397,
        estimatedDuration: '4-5 weeks',
        difficulty: 'intermediate',
        tags: [keywords, 'automation']
      },
      {
        id: 'concept_8',
        title: `${keywords} Success Formula`,
        description: `Proven formula for ${keywords} success`,
        targetAudience: `Individuals seeking ${keywords} success`,
        pricePoint: 597,
        estimatedDuration: '5-7 weeks',
        difficulty: 'advanced',
        tags: [keywords, 'success']
      },
      {
        id: 'concept_9',
        title: `${keywords} Expert Training`,
        description: `Become an expert in ${keywords} field`,
        targetAudience: `Serious learners of ${keywords}`,
        pricePoint: 697,
        estimatedDuration: '6-8 weeks',
        difficulty: 'advanced',
        tags: [keywords, 'expert']
      },
      {
        id: 'concept_10',
        title: `${keywords} Complete System`,
        description: `Complete system for mastering ${keywords}`,
        targetAudience: `Comprehensive ${keywords} learners`,
        pricePoint: 797,
        estimatedDuration: '8-10 weeks',
        difficulty: 'advanced',
        tags: [keywords, 'complete']
      }
    ]

    return baseConcepts
  }

  getMockCourseContent(selectedConcept) {
    return {
      id: `content_${Date.now()}`,
      title: selectedConcept.title,
      description: selectedConcept.description,
      chapters: [
        {
          id: 'chapter_1',
          title: 'Introduction & Foundation',
          description: 'Get started with the fundamentals',
          order: 1,
          lessons: [
            {
              id: 'lesson_1_1',
              title: 'Welcome to Your Journey',
              content: '# Welcome to Your Journey\n\nWelcome to this comprehensive course! In this lesson, you\'ll learn the fundamentals and get ready for your transformation.\n\n## What You\'ll Learn\n- Key concepts and principles\n- How to get the most out of this course\n- Setting up your learning environment\n\n## Action Steps\n1. Complete the pre-course assessment\n2. Set up your workspace\n3. Join the community forum\n\nLet\'s begin your journey to mastery!',
              order: 1,
              type: 'text'
            },
            {
              id: 'lesson_1_2',
              title: 'Understanding the Basics',
              content: '# Understanding the Basics\n\nIn this lesson, we\'ll cover the essential concepts you need to know.\n\n## Core Concepts\n- Fundamental principles\n- Key terminology\n- Common misconceptions\n\n## Practical Application\n- Real-world examples\n- Case studies\n- Hands-on exercises\n\nBy the end of this lesson, you\'ll have a solid foundation to build upon.',
              order: 2,
              type: 'text'
            },
            {
              id: 'lesson_1_3',
              title: 'Setting Your Goals',
              content: '# Setting Your Goals\n\nGoal setting is crucial for your success. Let\'s create a clear roadmap.\n\n## SMART Goals Framework\n- Specific\n- Measurable\n- Achievable\n- Relevant\n- Time-bound\n\n## Creating Your Action Plan\n- Short-term goals\n- Long-term vision\n- Milestone tracking\n\nYou\'ll leave this lesson with a clear plan for your journey.',
              order: 3,
              type: 'text'
            }
          ]
        },
        {
          id: 'chapter_2',
          title: 'Core Skills Development',
          description: 'Master the essential skills',
          order: 2,
          lessons: [
            {
              id: 'lesson_2_1',
              title: 'Essential Skills Overview',
              content: '# Essential Skills Overview\n\nThis lesson covers the core skills you need to master.\n\n## Key Skills\n- Technical skills\n- Soft skills\n- Industry-specific knowledge\n\n## Skill Development Strategy\n- Learning methods\n- Practice techniques\n- Progress tracking\n\nMaster these skills and you\'ll be unstoppable!',
              order: 1,
              type: 'text'
            },
            {
              id: 'lesson_2_2',
              title: 'Hands-On Practice',
              content: '# Hands-On Practice\n\nPractice makes perfect! Let\'s apply what you\'ve learned.\n\n## Practical Exercises\n- Step-by-step tutorials\n- Real-world projects\n- Problem-solving challenges\n\n## Getting Feedback\n- Self-assessment\n- Peer review\n- Expert guidance\n\nPractice regularly and watch your skills improve rapidly.',
              order: 2,
              type: 'text'
            },
            {
              id: 'lesson_2_3',
              title: 'Advanced Techniques',
              content: '# Advanced Techniques\n\nNow let\'s explore advanced methods and strategies.\n\n## Advanced Concepts\n- Complex techniques\n- Industry secrets\n- Expert-level strategies\n\n## Implementation\n- How to apply advanced techniques\n- Common pitfalls to avoid\n- Scaling your approach\n\nThese advanced techniques will set you apart from the competition.',
              order: 3,
              type: 'text'
            }
          ]
        },
        {
          id: 'chapter_3',
          title: 'Implementation & Strategy',
          description: 'Put your skills into action',
          order: 3,
          lessons: [
            {
              id: 'lesson_3_1',
              title: 'Strategic Planning',
              content: '# Strategic Planning\n\nLearn how to create and execute effective strategies.\n\n## Strategy Framework\n- Analysis and planning\n- Resource allocation\n- Risk management\n\n## Execution\n- Implementation timeline\n- Monitoring progress\n- Adjusting course\n\nA solid strategy is the foundation of success.',
              order: 1,
              type: 'text'
            },
            {
              id: 'lesson_3_2',
              title: 'Building Systems',
              content: '# Building Systems\n\nSystems are the key to sustainable success.\n\n## System Design\n- Creating efficient workflows\n- Automation opportunities\n- Quality control measures\n\n## Optimization\n- Continuous improvement\n- Performance metrics\n- Scaling systems\n\nBuild systems that work for you, not against you.',
              order: 2,
              type: 'text'
            },
            {
              id: 'lesson_3_3',
              title: 'Measuring Success',
              content: '# Measuring Success\n\nHow do you know if you\'re succeeding? Let\'s define and track success.\n\n## Success Metrics\n- Key performance indicators\n- Progress tracking\n- Milestone celebrations\n\n## Continuous Improvement\n- Regular reviews\n- Feedback loops\n- Adaptation strategies\n\nSuccess is a journey, not a destination.',
              order: 3,
              type: 'text'
            }
          ]
        },
        {
          id: 'chapter_4',
          title: 'Advanced Applications',
          description: 'Take your skills to the next level',
          order: 4,
          lessons: [
            {
              id: 'lesson_4_1',
              title: 'Real-World Applications',
              content: '# Real-World Applications\n\nSee how to apply your knowledge in real situations.\n\n## Case Studies\n- Success stories\n- Common challenges\n- Solutions and strategies\n\n## Practical Implementation\n- Step-by-step guides\n- Best practices\n- Common mistakes to avoid\n\nReal-world application is where theory meets practice.',
              order: 1,
              type: 'text'
            },
            {
              id: 'lesson_4_2',
              title: 'Scaling Your Approach',
              content: '# Scaling Your Approach\n\nLearn how to scale your efforts for maximum impact.\n\n## Scaling Strategies\n- Growth planning\n- Resource management\n- Team building\n\n## Challenges and Solutions\n- Common scaling issues\n- Problem-solving approaches\n- Maintaining quality\n\nScale smart, not just fast.',
              order: 2,
              type: 'text'
            },
            {
              id: 'lesson_4_3',
              title: 'Industry Insights',
              content: '# Industry Insights\n\nGet insider knowledge from industry experts.\n\n## Market Trends\n- Current industry trends\n- Future predictions\n- Opportunity identification\n\n## Expert Perspectives\n- Industry leader insights\n- Best practices\n- Innovation opportunities\n\nStay ahead of the curve with these insights.',
              order: 3,
              type: 'text'
            }
          ]
        },
        {
          id: 'chapter_5',
          title: 'Mastery & Beyond',
          description: 'Achieve mastery and build your legacy',
          order: 5,
          lessons: [
            {
              id: 'lesson_5_1',
              title: 'Achieving Mastery',
              content: '# Achieving Mastery\n\nMastery is a journey, not a destination. Let\'s explore what it means.\n\n## Mastery Mindset\n- Continuous learning\n- Humility and growth\n- Teaching others\n\n## Mastery Practices\n- Deliberate practice\n- Feedback seeking\n- Knowledge sharing\n\nTrue mastery comes from helping others succeed.',
              order: 1,
              type: 'text'
            },
            {
              id: 'lesson_5_2',
              title: 'Building Your Legacy',
              content: '# Building Your Legacy\n\nWhat will you leave behind? Let\'s create lasting impact.\n\n## Legacy Building\n- Impact measurement\n- Knowledge transfer\n- Mentorship\n\n## Long-term Vision\n- Future planning\n- Succession planning\n- Community building\n\nBuild a legacy that inspires others.',
              order: 2,
              type: 'text'
            },
            {
              id: 'lesson_5_3',
              title: 'Next Steps & Resources',
              content: '# Next Steps & Resources\n\nYour journey continues! Here\'s how to keep growing.\n\n## Continued Learning\n- Advanced resources\n- Community engagement\n- Ongoing education\n\n## Support Network\n- Mentorship opportunities\n- Peer connections\n- Expert access\n\nRemember: learning never stops, and neither should you!',
              order: 3,
              type: 'text'
            }
          ]
        }
      ],
      salesPage: `# ${selectedConcept.title} - Sales Page

## Transform Your Life with ${selectedConcept.title}

Are you ready to ${selectedConcept.description.toLowerCase()}?

This comprehensive course is designed specifically for ${selectedConcept.targetAudience.toLowerCase()}.

## What You'll Get:

✅ **5 Complete Chapters** with 15 detailed lessons
✅ **Step-by-step guidance** from beginner to expert
✅ **Real-world applications** and case studies
✅ **Lifetime access** to all course materials
✅ **Community support** and expert guidance

## Special Launch Price: $${selectedConcept.pricePoint}

*Regular price: $${selectedConcept.pricePoint * 2}*

## Limited Time Offer - Act Now!

Don't miss this opportunity to transform your skills and achieve your goals.

[GET INSTANT ACCESS NOW]`,

      emailSequence: [
        {
          subject: `Welcome to ${selectedConcept.title}!`,
          body: `# Welcome to Your Journey!\n\nCongratulations on taking the first step towards ${selectedConcept.description.toLowerCase()}!\n\nIn this course, you'll learn everything you need to know to succeed.\n\n## What's Next?\n1. Complete the introduction module\n2. Join our community forum\n3. Start with the first lesson\n\nWe're excited to be part of your journey!\n\nBest regards,\nThe Course Team`
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
          body: `# You're Almost at the Finish Line!\n\nAmazing work! You've come so far in this course.\n\n## Final Steps\n- Complete the remaining lessons\n- Review your notes\n- Plan your next steps\n\n## What's Next?\nAfter completing this course, you'll have all the tools you need to ${selectedConcept.description.toLowerCase()}.\n\nWe're proud of your dedication and progress!\n\nCongratulations on your achievement!`
        }
      ],
      vslScript: `# ${selectedConcept.title} - Video Sales Letter Script

## Transform Your Life with ${selectedConcept.title}

Are you ready to ${selectedConcept.description.toLowerCase()}?

This comprehensive course is designed specifically for ${selectedConcept.targetAudience.toLowerCase()}.

## What You'll Get:

✅ **5 Complete Chapters** with 15 detailed lessons
✅ **Step-by-step guidance** from beginner to expert
✅ **Real-world applications** and case studies
✅ **Lifetime access** to all course materials
✅ **Community support** and expert guidance

## Special Launch Price: $${selectedConcept.pricePoint}

*Regular price: $${selectedConcept.pricePoint * 2}*

## Limited Time Offer - Act Now!

Don't miss this opportunity to transform your skills and achieve your goals.

[GET INSTANT ACCESS NOW]`
    }
  }
}

export default new GeminiService()