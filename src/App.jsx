import React, { useState, useEffect } from 'react';
import geminiService from './services/geminiService';
import whopService from './services/whopService';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Step 1: Keywords Input
  const [keywords, setKeywords] = useState('');
  
  // Step 2: AI Generated Concepts
  const [courseConcepts, setCourseConcepts] = useState([]);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(null);
  
  // Step 3: Generated Course Content
  const [courseContent, setCourseContent] = useState(null);
  
  // Step 4: Created Course Data
  const [createdCourse, setCreatedCourse] = useState(null);
  
  // Step 5: Launch Data
  const [launchData, setLaunchData] = useState(null);

  const totalSteps = 5;

  useEffect(() => {
    // Initialize Whop service
    const initializeWhop = async () => {
      try {
        await whopService.initialize();
        console.log('Whop service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Whop service:', error);
        setError('Failed to initialize Whop service. Please refresh the page.');
      }
    };

    initializeWhop();
  }, []);

  const handleStep1Next = async () => {
    if (!keywords.trim()) {
      setError('Please enter at least 1-2 keywords');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const concepts = await geminiService.generateCourseConcepts(keywords);
      setCourseConcepts(concepts);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error generating concepts:', error);
      setError('Failed to generate course concepts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (selectedConceptIndex === null) {
      setError('Please select a course concept');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedConcept = courseConcepts[selectedConceptIndex];
      const content = await geminiService.generateCourseContent(selectedConcept);
      setCourseContent(content);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate course content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Next = async () => {
    if (!courseContent) {
      setError('No course content available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedConcept = courseConcepts[selectedConceptIndex];
      const course = await whopService.createCompleteCourse(courseContent, selectedConcept);
      setCreatedCourse(course);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Next = () => {
    if (!createdCourse) {
      setError('No course created');
      return;
    }

    // Generate launch data
    const launch = {
      courseUrl: createdCourse.course?.url || '#',
      productUrl: createdCourse.product?.url || '#',
      vslScript: courseContent?.vslScript || '',
      emailSequence: courseContent?.emailSequence || []
    };
    
    setLaunchData(launch);
    setCurrentStep(5);
  };

  const resetApp = () => {
    setCurrentStep(1);
    setKeywords('');
    setCourseConcepts([]);
    setSelectedConceptIndex(null);
    setCourseContent(null);
    setCreatedCourse(null);
    setLaunchData(null);
    setError(null);
  };

  const renderStep1 = () => (
    <div className="step-container">
      <h2>Enter Your Keywords</h2>
      <p>Enter 1-2 keywords to generate 10 course concepts related to your unique value zone.</p>
      
      <div className="input-group">
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., fitness, productivity, marketing"
          className="keyword-input"
        />
      </div>
      
      <button 
        onClick={handleStep1Next} 
        disabled={loading || !keywords.trim()}
        className="next-button"
      >
        {loading ? 'Generating...' : 'Generate Course Concepts'}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-container">
      <h2>Choose Your Course Concept</h2>
      <p>Select one of the 10 AI-generated course concepts:</p>
      
      <div className="concepts-grid">
        {courseConcepts.map((concept, index) => (
          <div
            key={index}
            className={`concept-card ${selectedConceptIndex === index ? 'selected' : ''}`}
            onClick={() => setSelectedConceptIndex(index)}
          >
            <h3>{concept.title}</h3>
            <p>{concept.description}</p>
            <div className="concept-meta">
              <span className="target-audience">👥 {concept.targetAudience}</span>
              <span className="price-point">💰 {concept.pricePoint}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleStep2Next} 
        disabled={loading || selectedConceptIndex === null}
        className="next-button"
      >
        {loading ? 'Generating Content...' : 'Create Course Content'}
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-container">
      <h2>Course Content Generated</h2>
      <p>Your complete course structure has been created:</p>
      
      <div className="course-preview">
        <h3>📚 Course Structure</h3>
        <div className="chapters-list">
          {courseContent?.chapters?.map((chapter, index) => (
            <div key={index} className="chapter-item">
              <h4>Chapter {index + 1}: {chapter.title}</h4>
              <div className="lessons-list">
                {chapter.lessons?.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="lesson-item">
                    <span>📖 {lesson.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={handleStep3Next} 
        disabled={loading}
        className="next-button"
      >
        {loading ? 'Creating Course...' : 'Publish to Whop'}
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-container">
      <h2>Course Published Successfully!</h2>
      <p>Your course has been created and published to Whop:</p>
      
      <div className="success-info">
        <div className="success-item">
          <h3>✅ Course Created</h3>
          <p>Title: {createdCourse?.course?.title}</p>
          <a href={createdCourse?.course?.url} target="_blank" rel="noopener noreferrer" className="link-button">
            View Course
          </a>
        </div>
        
        <div className="success-item">
          <h3>✅ Product Created</h3>
          <p>Name: {createdCourse?.product?.name}</p>
          <p>Price: ${createdCourse?.product?.price}</p>
          <a href={createdCourse?.product?.url} target="_blank" rel="noopener noreferrer" className="link-button">
            View Product
          </a>
        </div>
      </div>
      
      <button 
        onClick={handleStep4Next} 
        className="next-button"
      >
        Get Launch Assets
      </button>
    </div>
  );

  const renderStep5 = () => (
    <div className="step-container">
      <h2>Launch Assets Ready!</h2>
      <p>Download your marketing assets and launch your course:</p>
      
      <div className="launch-assets">
        <div className="asset-item">
          <h3>📹 Video Sales Letter Script</h3>
          <p>Complete VSL script for your course launch</p>
          <button 
            onClick={() => {
              const blob = new Blob([launchData?.vslScript || ''], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'vsl-script.txt';
              a.click();
            }}
            className="download-button"
          >
            Download VSL Script
          </button>
        </div>
        
        <div className="asset-item">
          <h3>📧 Email Nurture Sequence</h3>
          <p>7-day email sequence for course promotion</p>
          <button 
            onClick={() => {
              const emails = launchData?.emailSequence?.join('\n\n---\n\n') || '';
              const blob = new Blob([emails], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'email-sequence.txt';
              a.click();
            }}
            className="download-button"
          >
            Download Email Sequence
          </button>
        </div>
      </div>
      
      <div className="final-actions">
        <button onClick={resetApp} className="reset-button">
          Create Another Course
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 UVZ Course Launchpad AI</h1>
        <p>Automate digital product creation from your Unique Value Zone</p>
      </header>

      <div className="step-indicator">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i + 1}
            className={`step ${i + 1 <= currentStep ? 'active' : ''}`}
          >
            <span className="step-number">{i + 1}</span>
            <span className="step-label">
              {i === 0 && 'Keywords'}
              {i === 1 && 'Concepts'}
              {i === 2 && 'Content'}
              {i === 3 && 'Publish'}
              {i === 4 && 'Launch'}
            </span>
          </div>
        ))}
      </div>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        {renderCurrentStep()}
      </main>

      <footer className="app-footer">
        <p>Powered by Gemini AI & Whop Integration</p>
      </footer>
    </div>
  );
};

export default App;