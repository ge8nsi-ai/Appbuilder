import React, { useState, useEffect } from 'react';
import StepIndicator from './components/StepIndicator';
import InputTextarea from './components/InputTextarea';
import CardSelector from './components/CardSelector';
import Alert from './components/Alert';
import DownloadButton from './components/DownloadButton';
import geminiService from './services/geminiService';
import whopService from './services/whopService';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Step 1: UVZ Input Data
  const [uvzData, setUvzData] = useState({
    skills: '',
    passions: '',
    results: ''
  });
  
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
        await whopService.initialize();
      } catch (error) {
        console.error('Failed to initialize Whop SDK:', error);
        setError('Failed to initialize Whop SDK. Please refresh the page.');
      }
    };
    
    initializeWhop();
  }, []);

  const handleStep1Next = async () => {
    // Validate inputs
    if (!uvzData.skills.trim() || !uvzData.passions.trim() || !uvzData.results.trim()) {
      setError('Please fill in all fields before proceeding.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const concepts = await geminiService.generateCourseConcepts(uvzData);
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
      <h2>Define Your Unique Value Zone (UVZ)</h2>
      <p>Tell us about your expertise, passions, and proven results to create the perfect course concept.</p>
      
      <InputTextarea
        label="Skills & Expertise"
        placeholder="Example: Python Programming, E-commerce Marketing, High-Ticket Sales, Digital Marketing, Fitness Training"
        value={uvzData.skills}
        onChange={(value) => setUvzData(prev => ({ ...prev, skills: value }))}
        required
      />
      
      <InputTextarea
        label="Passions & Interests"
        placeholder="Example: Fitness & Health, Cryptocurrency Trading, Personal Finance, Sustainable Living, Technology"
        value={uvzData.passions}
        onChange={(value) => setUvzData(prev => ({ ...prev, passions: value }))}
        required
      />
      
      <InputTextarea
        label="Proven Results/Solutions"
        placeholder="Example: Helped 10 clients reach $10k/month revenue, Lost 50 lbs in 90 days, Generated $100k in sales, Built 5 successful online businesses"
        value={uvzData.results}
        onChange={(value) => setUvzData(prev => ({ ...prev, results: value }))}
        required
      />
      
      <div style={{ textAlign: 'right', marginTop: '30px' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleStep1Next}
          disabled={loading}
        >
          {loading ? 'Analyzing Your UVZ...' : 'Generate Course Concepts →'}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="fade-in">
      <h2>Choose Your Course Concept</h2>
      <p>Based on your UVZ, we've generated three high-demand course concepts. Select the one that resonates most with you.</p>
      
      <CardSelector
        label="Select Your UVZ Course Concept"
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
            setUvzData({ skills: '', passions: '', results: '' });
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