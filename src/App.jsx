import React, { useState, useEffect } from 'react';
import StepIndicator from './components/StepIndicator';
import InputTextarea from './components/InputTextarea';
import CardSelector from './components/CardSelector';
import Alert from './components/Alert';
import DownloadButton from './components/DownloadButton';
import geminiService from './services/geminiService';
import whopService from './services/whopService';

// Mock Whop hooks for development - will be replaced with real @whop/react in production
const useWhop = () => ({
  token: import.meta.env.VITE_WHOP_API_KEY || 'fUaz0J7H-ixhluIyo7FpGhhDSBa_50_5Cw6xlA48E38',
  experienceId: import.meta.env.VITE_WHOP_COMPANY_ID || 'biz_qBykJdUrk3W1wv',
  appId: import.meta.env.VITE_WHOP_APP_ID || 'app_1CSGwlh2Of6r50'
});

const App = () => {
  const whop = useWhop();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug logging
  console.log('App component rendering, currentStep:', currentStep);
  
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
    // Initialize Whop SDK when app loads
    const initializeWhop = async () => {
      try {
        await whopService.initialize(whop);
      } catch (error) {
        console.error('Failed to initialize Whop SDK:', error);
        setError('Failed to initialize Whop SDK. Please refresh the page.');
      }
    };
    
    if (whop) {
      initializeWhop();
    }
  }, [whop]);

  const handleStep1Next = async () => {
    // Validate input
    if (!keywords.trim()) {
      setError('Please enter at least 1-2 keywords before proceeding.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const concepts = await geminiService.generateCourseConcepts(keywords.trim());
      setCourseConcepts(concepts);
      setCurrentStep(2);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (selectedConceptIndex === null) {
      setError('Please select a course concept before proceeding.');
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Next = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedConcept = courseConcepts[selectedConceptIndex];
      const courseData = await whopService.createCompleteCourse(courseContent, selectedConcept);
      setCreatedCourse(courseData);
      
      // Prepare launch data
      setLaunchData({
        courseUrl: courseData.courseUrl,
        productUrl: courseData.productUrl,
        salesPageCopy: courseContent.sales_page_copy,
        emailNurture: courseContent.email_nurture
      });
      
      setCurrentStep(4);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Next = () => {
    setCurrentStep(5);
  };

  const renderStep1 = () => (
    <div className="fade-in">
      <h2>Enter Your Keywords</h2>
      <p>Simply enter 1-2 keywords related to your expertise or interests. Our AI will generate 10 profitable course concepts for you!</p>
      
      <div className="form-group">
        <label className="form-label">
          Keywords <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>
        </label>
        <input
          className="form-textarea"
          type="text"
          placeholder="Example: fitness, cryptocurrency, e-commerce, python, marketing, sales, health, finance, technology, business"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
          style={{ minHeight: '60px', padding: '15px' }}
        />
        <small style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>
          💡 Tip: Use 1-2 keywords like "fitness", "cryptocurrency", "e-commerce", "python", "marketing", etc.
        </small>
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '30px' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleStep1Next}
          disabled={loading}
        >
          {loading ? 'Generating 10 Course Concepts...' : 'Generate 10 Course Concepts →'}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="fade-in">
      <h2>Choose Your Course Concept</h2>
      <p>Based on your keywords "{keywords}", we've generated 10 high-demand course concepts. Select the one that resonates most with you.</p>
      
      <CardSelector
        label="Select Your Course Concept"
        options={courseConcepts}
        selectedValue={selectedConceptIndex}
        onSelect={setSelectedConceptIndex}
        loading={loading}
      />
      
      <div style={{ textAlign: 'right', marginTop: '30px' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleStep2Next}
          disabled={loading || selectedConceptIndex === null}
        >
          {loading ? 'Generating Course Content...' : 'Create Full Course →'}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="fade-in">
      <h2>Course Content Generated!</h2>
      <p>Your complete course structure has been created with 5 chapters and 15 lessons.</p>
      
      <div className="alert alert-success">
        ✅ Course Structure Created Successfully!
        <br />
        📚 {courseContent.chapters.length} Chapters
        <br />
        📖 {courseContent.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)} Lessons
        <br />
        📧 5-Part Email Nurture Sequence
        <br />
        📄 High-Converting Sales Page Copy
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '30px' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleStep3Next}
          disabled={loading}
        >
          {loading ? 'Creating Course on Whop...' : 'Publish to Whop →'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="fade-in">
      <h2>Course Published Successfully!</h2>
      <p>Your course has been created and is now live on Whop.</p>
      
      <div className="alert alert-success">
        🎉 Your course is LIVE and ready to sell on Whop!
        <br />
        <br />
        <strong>Course:</strong> {createdCourse.course.title}
        <br />
        <strong>Product:</strong> {createdCourse.product.name}
        <br />
        <strong>Price:</strong> ${createdCourse.product.price}
        <br />
        <strong>Status:</strong> Active
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '30px' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleStep4Next}
        >
          View Launch Assets →
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="fade-in">
      <h2>Launch Checklist & Marketing Assets</h2>
      <p>Your course is ready! Download your marketing materials and start promoting.</p>
      
      <Alert type="success" message="🎉 Your course is LIVE and ready to sell on Whop!" />
      
      <div style={{ marginBottom: '30px' }}>
        <h3>📥 Download Marketing Assets</h3>
        <DownloadButton
          label="Download Full Sales Script (VSL)"
          data={launchData.salesPageCopy}
          filename="sales_script_vsl.txt"
        />
        <DownloadButton
          label="Download 5-Part Email Nurture Sequence"
          data={launchData.emailNurture}
          filename="email_nurture_sequence.txt"
        />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>🔗 Quick Links</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <a 
            href={launchData.courseUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            📚 View Live Whop Course
          </a>
          <a 
            href={launchData.productUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            🛒 View Product Page
          </a>
        </div>
      </div>
      
      <div className="alert alert-info">
        <h4>🚀 Next Steps:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Share your course on social media</li>
          <li>Send the email nurture sequence to your list</li>
          <li>Use the VSL script for sales pages</li>
          <li>Monitor your Whop dashboard for sales</li>
          <li>Engage with students in the course community</li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            // Reset the app for a new course
            setCurrentStep(1);
            setKeywords('');
            setCourseConcepts([]);
            setSelectedConceptIndex(null);
            setCourseContent(null);
            setCreatedCourse(null);
            setLaunchData(null);
            setError(null);
          }}
        >
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
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">UVZ Course Launchpad AI</h1>
        <p className="app-subtitle">Transform your expertise into profitable digital courses</p>
      </div>
      
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="main-content">
        {error && (
          <Alert type="error" message={error} />
        )}
        
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default App;