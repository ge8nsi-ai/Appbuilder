# 🚀 UVZ Course Launchpad Pro

A production-ready application for creating and launching digital courses using AI-powered content generation and Whop integration.

## ✨ Features

- **AI-Powered Course Generation**: Uses Google Gemini AI to generate course concepts and content
- **Whop Integration**: Seamlessly creates courses and products on Whop platform
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS and glass morphism effects
- **Step-by-Step Workflow**: Intuitive 5-step process for course creation
- **Production Ready**: Optimized for 60-70 concurrent users on Vercel hobby plan
- **Error Handling**: Comprehensive error handling and loading states
- **Mock Mode**: Works in development without API keys

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **AI**: Google Gemini AI
- **Platform**: Whop API
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Styling**: Custom CSS with Tailwind utilities

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## 📋 Environment Variables

Create a `.env.local` file with:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_WHOP_API_KEY=your_whop_api_key
VITE_WHOP_APP_ID=your_whop_app_id
VITE_WHOP_AGENT_USER_ID=your_whop_agent_user_id
VITE_WHOP_COMPANY_ID=your_whop_company_id
```

## 🎯 How It Works

1. **Keywords Input**: Enter 1-2 keywords to generate course concepts
2. **Concept Selection**: Choose from 10 AI-generated course ideas
3. **Content Generation**: AI creates complete course structure with lessons
4. **Whop Publishing**: Automatically creates course and product on Whop
5. **Launch Assets**: Download VSL scripts and email sequences

## 🏗️ Architecture

### Components
- **UI Components**: Reusable components with consistent styling
- **Step Components**: Individual step implementations
- **Service Layer**: API integrations for Gemini and Whop
- **Hooks**: Custom React hooks for async operations
- **Utils**: Helper functions and utilities

### Performance Optimizations
- **Code Splitting**: Automatic chunk splitting for optimal loading
- **Lazy Loading**: Components loaded on demand
- **Error Boundaries**: Graceful error handling
- **Loading States**: Smooth user experience during API calls
- **Mock Mode**: Development without external dependencies

## 🚀 Deployment

The app is configured for Vercel deployment with:
- Static build optimization
- Environment variable configuration
- Proper routing for SPA
- Production-ready build settings

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible design patterns

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # Type definitions
└── App.jsx             # Main application
```

### Key Features
- **Error Handling**: Comprehensive error states and recovery
- **Loading States**: Smooth loading indicators
- **Form Validation**: Input validation and error messages
- **Responsive Design**: Works on all device sizes
- **Accessibility**: WCAG compliant components

## 🎨 Design System

- **Colors**: Whop brand colors with custom palette
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable, composable components
- **Animations**: Smooth transitions and micro-interactions

## 📊 Performance

- **Bundle Size**: Optimized for fast loading
- **Code Splitting**: Automatic chunk optimization
- **Caching**: Efficient caching strategies
- **CDN**: Global content delivery
- **Monitoring**: Built-in performance tracking

## 🔒 Security

- **Environment Variables**: Secure API key management
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages
- **HTTPS**: Secure connections only

## 📈 Scalability

- **Concurrent Users**: Supports 60-70 users simultaneously
- **API Rate Limiting**: Respects API limits
- **Caching**: Reduces API calls
- **Error Recovery**: Graceful degradation
- **Monitoring**: Real-time performance tracking

## 🚀 Production URL

Once deployed to Vercel, you'll get a production URL that you can use in your Whop app configuration.

## 📞 Support

For issues or questions, please check the error messages in the application or review the console logs for debugging information.

---

Built with ❤️ for the Whop ecosystem