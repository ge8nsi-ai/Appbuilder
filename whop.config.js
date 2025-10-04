module.exports = {
  appId: 'app_1CSGwlh2Of6r50',
  name: 'UVZ Course Launchpad AI',
  description: 'Automate the entire digital product creation and listing process on Whop, starting from a user\'s Unique Value Zone (UVZ), with no required human content creation.',
  version: '1.0.0',
  author: 'UVZ Course Launchpad AI',
  category: 'Education',
  tags: ['ai', 'course-creation', 'digital-products', 'uvz', 'automation'],
  permissions: [
    'courses:create',
    'courses:read',
    'courses:update',
    'products:create',
    'products:read',
    'products:update',
    'experiences:read'
  ],
  settings: {
    geminiApiKey: {
      type: 'string',
      label: 'Gemini API Key',
      description: 'Your Google Gemini API key for AI content generation',
      required: true
    }
  },
  webhook: {
    url: 'https://your-domain.com/webhook',
    events: ['course.created', 'product.created']
  }
};