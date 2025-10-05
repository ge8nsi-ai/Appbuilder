import React, { useState, useEffect } from 'react'
import { Rocket, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-whop-600" />
                Enter Your Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Enter 1-2 keywords to generate 10 course concepts related to your unique value zone.
              </p>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., fitness, productivity, marketing"
                  className="text-lg"
                />
                <Button
                  onClick={handleGenerateConcepts}
                  loading={conceptsLoading}
                  disabled={!keywords.trim() || conceptsLoading}
                  className="w-full"
                >
                  {conceptsLoading ? 'Generating Concepts...' : 'Generate Course Concepts'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-whop-600" />
                Choose Your Course Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Select one of the 10 AI-generated course concepts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="mt-6">
                <Button
                  onClick={handleGenerateContent}
                  loading={contentLoading}
                  disabled={selectedConceptIndex === null || contentLoading}
                  className="w-full"
                >
                  {contentLoading ? 'Generating Content...' : 'Create Course Content'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="h-6 w-6 mr-2 text-whop-600" />
                Course Content Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Your complete course structure has been created:
              </p>
              <CoursePreview courseContent={courseContent} />
              <div className="mt-6">
                <Button
                  onClick={handleCreateCourse}
                  loading={courseLoading || productLoading || linkLoading}
                  disabled={courseLoading || productLoading || linkLoading}
                  className="w-full"
                >
                  {(courseLoading || productLoading || linkLoading) ? 'Creating Course...' : 'Publish to Whop'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Course Published Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Your course has been created and published to Whop:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Course Created</h3>
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Title:</strong> {createdCourse?.course?.title}
                  </p>
                  <a
                    href={createdCourse?.course?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    View Course →
                  </a>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Product Created</h3>
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Name:</strong> {createdCourse?.product?.name}
                  </p>
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Price:</strong> {formatPrice(createdCourse?.product?.price)}
                  </p>
                  <a
                    href={createdCourse?.product?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    View Product →
                  </a>
                </div>
              </div>
              <Button
                onClick={handleGenerateLaunchData}
                className="w-full"
              >
                Get Launch Assets
              </Button>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <LaunchAssets launchData={launchData} />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-whop-50 to-whop-100">
      {/* Header */}
      <header className="glass border-b border-whop-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              🚀 UVZ Course Launchpad Pro
            </h1>
            <p className="text-lg text-gray-600">
              Automate digital product creation from your Unique Value Zone
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => i + 1)}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
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
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={resetApp}
            >
              Create Another Course
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-whop-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>Powered by Gemini AI & Whop Integration</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App