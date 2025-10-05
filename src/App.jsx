import React, { useState, useEffect } from 'react'
import { Rocket, Sparkles, CheckCircle, AlertCircle, Brain, Zap, Target, ArrowRight, Star, Users, Clock, DollarSign } from 'lucide-react'
import { useAsync } from './hooks/useAsync.js'
import { StepIndicator, ConceptCard, CoursePreview, LaunchAssets } from './components/index.js'
import { Button, Card, CardContent, CardHeader, CardTitle, Alert, LoadingSpinner, Input } from './components/ui/index.js'
import geminiService from './services/geminiService.js'
import whopService from './services/whopService.js'
import { formatPrice } from './utils/index.js'

const STEPS = [
  'Keywords',
  'Concepts', 
  'Content',
  'Publish',
  'Launch'
]

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState(1)
  const [keywords, setKeywords] = useState('')
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(null)
  const [courseConcepts, setCourseConcepts] = useState([])
  const [courseContent, setCourseContent] = useState(null)
  const [createdCourse, setCreatedCourse] = useState(null)
  const [launchData, setLaunchData] = useState(null)
  const [error, setError] = useState(null)

  // Async operations
  const { execute: generateConcepts, loading: conceptsLoading } = useAsync(geminiService.generateCourseConcepts)
  const { execute: generateContent, loading: contentLoading } = useAsync(geminiService.generateCourseContent)
  const { execute: createCourse, loading: courseLoading } = useAsync(whopService.createCourse)
  const { execute: createProduct, loading: productLoading } = useAsync(whopService.createProduct)
  const { execute: linkCourse, loading: linkLoading } = useAsync(whopService.linkCourseToProduct)

  // Initialize Whop service
  useEffect(() => {
    const initWhop = async () => {
      try {
        await whopService.initialize()
      } catch (error) {
        console.error('Failed to initialize Whop service:', error)
        setError('Failed to initialize Whop service. Please refresh the page.')
      }
    }
    initWhop()
  }, [])

  // Step 1: Generate concepts
  const handleGenerateConcepts = async () => {
    if (!keywords.trim()) {
      setError('Please enter at least 1-2 keywords')
      return
    }

    try {
      setError(null)
      const concepts = await generateConcepts(keywords)
      setCourseConcepts(concepts)
      setCurrentStep(2)
    } catch (error) {
      setError('Failed to generate course concepts. Please try again.')
    }
  }

  // Step 2: Generate content
  const handleGenerateContent = async () => {
    if (selectedConceptIndex === null) {
      setError('Please select a course concept')
      return
    }

    try {
      setError(null)
      const selectedConcept = courseConcepts[selectedConceptIndex]
      const content = await generateContent(selectedConcept)
      setCourseContent(content)
      setCurrentStep(3)
    } catch (error) {
      setError('Failed to generate course content. Please try again.')
    }
  }

  // Step 3: Create course and product
  const handleCreateCourse = async () => {
    if (!courseContent) {
      setError('No course content available')
      return
    }

    try {
      setError(null)
      
      // Create course
      const course = await createCourse({
        title: courseContent.title,
        description: courseContent.description
      })

      // Create product
      const selectedConcept = courseConcepts[selectedConceptIndex]
      const product = await createProduct({
        name: `${courseContent.title} - Premium Access`,
        description: courseContent.description,
        price: selectedConcept.pricePoint
      })

      // Link course to product
      await linkCourse(course.id, product.id)

      setCreatedCourse({ course, product })
      setCurrentStep(4)
    } catch (error) {
      setError('Failed to create course. Please try again.')
    }
  }

  // Step 4: Generate launch data
  const handleGenerateLaunchData = () => {
    if (!createdCourse) {
      setError('No course created')
      return
    }

    const launch = {
      courseUrl: createdCourse.course?.url || '#',
      productUrl: createdCourse.product?.url || '#',
      vslScript: courseContent?.vslScript || '',
      emailSequence: courseContent?.emailSequence || []
    }
    
    setLaunchData(launch)
    setCurrentStep(5)
  }

  // Reset app
  const resetApp = () => {
    setCurrentStep(1)
    setKeywords('')
    setCourseConcepts([])
    setSelectedConceptIndex(null)
    setCourseContent(null)
    setCreatedCourse(null)
    setLaunchData(null)
    setError(null)
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <Card className="relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gradient mb-4">
                    Enter Your Keywords
                  </CardTitle>
                  <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Enter 1-2 keywords to generate 10 unique course concepts related to your unique value zone. Our AI will create compelling course ideas tailored to your expertise.
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., fitness, productivity, marketing, coding, design..."
                      className="text-lg text-center"
                    />
                    <div className="text-center text-sm text-slate-500">
                      💡 Try keywords like "digital marketing", "fitness", "programming", or "entrepreneurship"
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGenerateConcepts}
                    loading={conceptsLoading}
                    disabled={!keywords.trim() || conceptsLoading}
                    className="w-full text-lg py-6"
                  >
                    {conceptsLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="loading-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <span>Generating Concepts...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-5 w-5" />
                        <span>Generate Course Concepts</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="animate-fade-in">
            <Card className="relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-20 -translate-x-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-100 to-cyan-100 rounded-full translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gradient mb-4">
                    Choose Your Course Concept
                  </CardTitle>
                  <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Select one of the 10 AI-generated course concepts. Each concept is tailored to your keywords and includes pricing, target audience, and difficulty level.
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {courseConcepts.map((concept, index) => (
                      <ConceptCard
                        key={concept.id}
                        concept={concept}
                        isSelected={selectedConceptIndex === index}
                        onSelect={setSelectedConceptIndex}
                        index={index}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleGenerateContent}
                    loading={contentLoading}
                    disabled={selectedConceptIndex === null || contentLoading}
                    className="w-full text-lg py-6"
                  >
                    {contentLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="loading-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <span>Generating Content...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5" />
                        <span>Create Course Content</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="animate-fade-in">
            <Card className="relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-100 to-pink-100 rounded-full -translate-y-18 translate-x-18"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full translate-y-14 -translate-x-14"></div>
              
              <div className="relative z-10">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gradient mb-4">
                    Course Content Generated
                  </CardTitle>
                  <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Your complete course structure has been created with detailed lessons, chapters, and marketing materials.
                  </p>
                </CardHeader>
                
                <CardContent>
                  <CoursePreview courseContent={courseContent} />
                  
                  <div className="mt-8">
                    <Button
                      onClick={handleCreateCourse}
                      loading={courseLoading || productLoading || linkLoading}
                      disabled={courseLoading || productLoading || linkLoading}
                      className="w-full text-lg py-6"
                    >
                      {(courseLoading || productLoading || linkLoading) ? (
                        <div className="flex items-center space-x-3">
                          <div className="loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                          <span>Creating Course...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Rocket className="h-5 w-5" />
                          <span>Publish to Whop</span>
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="animate-fade-in">
            <Card className="relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-20 -translate-x-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-100 to-cyan-100 rounded-full translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gradient mb-4">
                    Course Published Successfully!
                  </CardTitle>
                  <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Your course has been created and published to Whop. You can now access it and start selling.
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="card-minimal border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                          <Rocket className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-800">Course Created</h3>
                          <p className="text-green-600">Ready for students</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4">
                        <strong>Title:</strong> {createdCourse?.course?.title}
                      </p>
                      <a
                        href={createdCourse?.course?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 font-medium transition-colors"
                      >
                        <span>View Course</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                    
                    <div className="card-minimal border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-800">Product Created</h3>
                          <p className="text-blue-600">Ready for sales</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-2">
                        <strong>Name:</strong> {createdCourse?.product?.name}
                      </p>
                      <p className="text-slate-700 mb-4">
                        <strong>Price:</strong> {formatPrice(createdCourse?.product?.price)}
                      </p>
                      <a
                        href={createdCourse?.product?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <span>View Product</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGenerateLaunchData}
                    className="w-full text-lg py-6"
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5" />
                      <span>Get Launch Assets</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="animate-fade-in">
            <LaunchAssets launchData={launchData} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl float"></div>
      </div>

      {/* Header */}
      <header className="glass border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gradient text-shadow">
                  UVZ Course Launchpad Pro
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your expertise into profitable digital courses with AI-powered content generation and seamless Whop integration
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Step Indicator */}
        <div className="mb-16">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => i + 1)}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 animate-slide-up">
            <Alert
              variant="error"
              title="Error"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </div>
        )}

        {/* Step Content */}
        <div className="animate-fade-in">
          {renderStepContent()}
        </div>

        {/* Reset Button */}
        {currentStep > 1 && (
          <div className="mt-12 text-center animate-slide-up">
            <Button
              variant="ghost"
              onClick={resetApp}
              className="text-slate-600 hover:text-slate-800"
            >
              <div className="flex items-center space-x-2">
                <span>Create Another Course</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/20 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-slate-600 font-medium">Powered by Gemini AI & Whop Integration</span>
            </div>
            <p className="text-sm text-slate-500">
              Create, publish, and launch your digital courses in minutes, not months
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App