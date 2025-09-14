import React, { useState, useRef, useEffect } from 'react';
import { Screen } from '../App';
import LocationService, { LocationData } from '../utils/locationUtils';
import '../voice-styles.css';

interface ReportIssueScreenProps {
  onNavigate: (screen: Screen) => void;
  onSubmitReport: (points: number) => void;
}

const ReportIssueScreen: React.FC<ReportIssueScreenProps> = ({ onNavigate, onSubmitReport }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [customIssueText, setCustomIssueText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // Track camera facing mode
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [useVoiceDescription, setUseVoiceDescription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  // Available issue categories - no icons, compact list
  const availableCategories = [
    // Infrastructure Issues
    { id: 'road-damage', name: 'Road Damage', icon: '', description: 'Potholes, cracks, damaged roads' },
    { id: 'streetlight', name: 'Streetlight Issue', icon: '', description: 'Broken or non-functioning streetlights' },
    { id: 'traffic-signs', name: 'Traffic Signs', icon: '', description: 'Missing or damaged traffic signs' },
    { id: 'sidewalk', name: 'Sidewalk Issues', icon: '', description: 'Damaged or blocked sidewalks' },
    { id: 'bridge-issues', name: 'Bridge Problems', icon: '', description: 'Bridge maintenance and safety issues' },
    { id: 'manhole-cover', name: 'Manhole Issues', icon: '', description: 'Missing or damaged manhole covers' },
    
    // Utilities
    { id: 'water-leak', name: 'Water Leak', icon: '', description: 'Water pipe leaks or drainage issues' },
    { id: 'power-outage', name: 'Power Issues', icon: '', description: 'Power outages or electrical problems' },
    { id: 'gas-leak', name: 'Gas Leak', icon: '', description: 'Suspected gas leaks (emergency)' },
    { id: 'internet-down', name: 'Internet/Telecom', icon: '', description: 'Internet or telecommunication issues' },
    { id: 'storm-drain', name: 'Storm Drainage', icon: '', description: 'Blocked or damaged storm drains' },
    
    // Waste Management
    { id: 'garbage', name: 'Garbage Problem', icon: '', description: 'Waste management and cleanliness issues' },
    { id: 'recycling', name: 'Recycling Issues', icon: '', description: 'Recycling collection problems' },
    { id: 'illegal-dumping', name: 'Illegal Dumping', icon: '', description: 'Unauthorized waste disposal' },
    { id: 'overflowing-bins', name: 'Overflowing Bins', icon: '', description: 'Full or overflowing trash bins' },
    
    // Public Spaces
    { id: 'park-maintenance', name: 'Park Maintenance', icon: '', description: 'Public parks and green spaces' },
    { id: 'playground', name: 'Playground Issues', icon: '', description: 'Playground equipment problems' },
    { id: 'graffiti', name: 'Graffiti/Vandalism', icon: '', description: 'Vandalism or unauthorized graffiti' },
    { id: 'public-restrooms', name: 'Public Restrooms', icon: '', description: 'Public restroom maintenance' },
    { id: 'benches', name: 'Public Furniture', icon: '', description: 'Damaged benches or public furniture' },
    
    // Transportation
    { id: 'bus-stop', name: 'Bus Stop Issues', icon: '', description: 'Bus stop maintenance or safety' },
    { id: 'parking-meters', name: 'Parking Issues', icon: '', description: 'Parking meter or zone problems' },
    { id: 'bike-lanes', name: 'Bike Lane Problems', icon: '', description: 'Bicycle lane maintenance issues' },
    { id: 'crosswalk', name: 'Crosswalk Issues', icon: '', description: 'Crosswalk safety or visibility' },
    
    // Safety & Security
    { id: 'public-safety', name: 'Public Safety', icon: '', description: 'Safety concerns and hazards' },
    { id: 'security-lighting', name: 'Security Lighting', icon: '', description: 'Inadequate security lighting' },
    { id: 'fallen-trees', name: 'Fallen Trees', icon: '', description: 'Fallen or dangerous trees' },
    { id: 'fire-hazard', name: 'Fire Hazard', icon: '', description: 'Fire safety concerns' },
    
    // Environmental
    { id: 'air-quality', name: 'Air Quality', icon: '', description: 'Air pollution or quality concerns' },
    { id: 'water-quality', name: 'Water Quality', icon: '', description: 'Water contamination issues' },
    { id: 'pest-control', name: 'Pest Issues', icon: '', description: 'Pest infestations in public areas' },
    { id: 'dead-animals', name: 'Dead Animals', icon: '', description: 'Dead animal removal needed' },
    
    // Noise & Disturbances
    { id: 'noise-pollution', name: 'Noise Pollution', icon: '', description: 'Excessive noise complaints' },
    { id: 'construction-noise', name: 'Construction Noise', icon: '', description: 'Disruptive construction activities' },
    
    // Building & Property
    { id: 'building-issues', name: 'Building Issues', icon: '', description: 'Public building maintenance' },
    { id: 'abandoned-property', name: 'Abandoned Property', icon: '', description: 'Abandoned or derelict buildings' },
    { id: 'signage', name: 'Signage Issues', icon: '', description: 'Missing or damaged public signs' },
    
    // Weather Related
    { id: 'flooding', name: 'Flooding', icon: '', description: 'Flooding or poor drainage' },
    { id: 'storm-damage', name: 'Storm Damage', icon: '', description: 'Weather-related damage' },
    
    // Accessibility
    { id: 'accessibility', name: 'Accessibility Issues', icon: '', description: 'ADA compliance or accessibility problems' },
    { id: 'ramp-issues', name: 'Ramp Problems', icon: '', description: 'Wheelchair ramp issues' },
    
    // Technology
    { id: 'wifi-issues', name: 'Public WiFi', icon: '', description: 'Public WiFi connectivity problems' },
    
    // Additional Common Issues
    { id: 'animal-control', name: 'Animal Control', icon: '', description: 'Stray animals or animal safety issues' },
    { id: 'fence-damage', name: 'Fence Damage', icon: '', description: 'Damaged public fencing' },
    { id: 'lighting-general', name: 'General Lighting', icon: '', description: 'Poor lighting in public areas' },
    { id: 'road-barriers', name: 'Road Barriers', icon: '', description: 'Missing or damaged road barriers' },
    { id: 'public-phones', name: 'Public Phones', icon: '', description: 'Broken public telephone issues' },
    { id: 'statue-monument', name: 'Statue/Monument', icon: '', description: 'Damage to public statues or monuments' },
    { id: 'sports-facilities', name: 'Sports Facilities', icon: '', description: 'Public sports facility issues' },
    { id: 'library-issues', name: 'Library Issues', icon: '', description: 'Public library facility problems' },
    
    // Miscellaneous
    { id: 'custom', name: 'Custom Issue', icon: '', description: 'Type your own issue description' },
    { id: 'other', name: 'Other', icon: '', description: 'Other civic issues not listed above' }
  ];

  const handleCameraClick = async () => {
    try {
      // Clear any previous location data to force fresh fetch
      setLocationData(null);
      setIsLoadingLocation(true);
      setLocationError(null);
      
      // Start fresh location fetch in background
      LocationService.getInstance().getCompleteLocationData()
        .then((location) => {
          setLocationData(location);
          setIsLoadingLocation(false);
          console.log('Fresh high-accuracy location for camera:', location);
          console.log('GPS Accuracy:', location.accuracy + 'm');
        })
        .catch((error) => {
          console.error('Camera location error:', error);
          setLocationError(`Location Error: ${error.message}. Try moving outdoors for better GPS signal.`);
          setIsLoadingLocation(false);
        });
      
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode, // Use current facing mode
          width: { ideal: 1920, min: 1280 }, // Higher resolution for better quality
          height: { ideal: 1080, min: 720 }
        }
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Set up video stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available. Using file picker as fallback.');
      // Fallback to file picker
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(imageData);
        setShowAIPreview(true);
        
        // Simulate AI detection - exclude Other and Custom Issue from random selection
        const mainCategories = availableCategories.filter(cat => 
          cat.name !== 'Other' && cat.name !== 'Custom Issue'
        ).map(cat => cat.name);
        setSuggestedCategory(mainCategories[Math.floor(Math.random() * mainCategories.length)]);
        
        // Close camera
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    // Properly stop video and clean up
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset the video element
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const switchCamera = async () => {
    // Stop current stream first
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Clear the video source to prevent play() interruption
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset the video element
    }
    
    // Toggle facing mode
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    
    try {
      // Add a small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Start new stream with switched camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1920, min: 1280 }, // Higher resolution for better quality
          height: { ideal: 1080, min: 720 }
        }
      });
      
      setStream(mediaStream);
      
      // Set up video stream with proper loading
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for the video to be ready before playing
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(error => {
              console.warn('Video play failed:', error);
            });
          }
        };
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      alert('Unable to switch camera. Please try again.');
      // Revert to previous facing mode if switch fails
      setFacingMode(facingMode);
    }
  };

  // Auto-fetch location when component loads (like GPS cameras)
  useEffect(() => {
    const autoFetchLocation = async () => {
      setIsLoadingLocation(true);
      setLocationError(null);
      
      try {
        const location = await LocationService.getInstance().getCompleteLocationData();
        setLocationData(location);
        console.log('Auto-fetched location on app load:', location);
      } catch (error) {
        console.error('Auto location fetch error:', error);
        setLocationError((error as Error).message);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    // Auto-fetch location when component mounts
    autoFetchLocation();
  }, []);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [stream, audioUrl]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setVoiceTranscript(prev => prev + finalTranscript + ' ');
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
      };
    }
  }, []);

  const handleGalleryClick = () => {
    // Start loading location data when gallery is accessed
    setIsLoadingLocation(true);
    setLocationError(null);
    
    LocationService.getInstance().getCompleteLocationData()
      .then((location) => {
        setLocationData(location);
        setIsLoadingLocation(false);
      })
      .catch((error) => {
        console.error('Location error:', error);
        setLocationError(error.message);
        setIsLoadingLocation(false);
      });
    
    galleryInputRef.current?.click();
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowAIPreview(true);
        setIsImageLoading(false);
        // Simulate AI detection - exclude Other and Custom Issue from random selection
        const mainCategories = availableCategories.filter(cat => 
          cat.name !== 'Other' && cat.name !== 'Custom Issue'
        ).map(cat => cat.name);
        setSuggestedCategory(mainCategories[Math.floor(Math.random() * mainCategories.length)]);
      };
      reader.onerror = () => {
        setIsImageLoading(false);
        alert('Error loading image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const hasTextDescription = description.trim();
    const hasVoiceDescription = useVoiceDescription && (audioBlob || voiceTranscript.trim());
    
    if (!selectedImage || (!hasTextDescription && !hasVoiceDescription)) {
      alert('Please add an image and description (text or voice)');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      onSubmitReport(25); // Award 25 points for submission
      
      setTimeout(() => {
        onNavigate('myReports');
      }, 2000);
    }, 1500);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied or not available.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setVoiceTranscript('');
  };

  const startVoiceToText = () => {
    if (recognitionRef.current) {
      setIsTranscribing(true);
      setVoiceTranscript('');
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopVoiceToText = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsTranscribing(false);
    }
  };

  const useTranscriptAsDescription = () => {
    if (voiceTranscript.trim()) {
      setDescription(voiceTranscript.trim());
      setUseVoiceDescription(false);
    }
  };

  const confirmAICategory = () => {
    setShowAIPreview(false);
  };

  const editCategory = () => {
    setShowCategoryModal(true);
    setShowCustomInput(false);
    setCustomIssueText('');
  };

  const selectCategory = (categoryName: string) => {
    if (categoryName === 'Custom Issue' || categoryName === 'Other') {
      setSelectedCategoryType(categoryName);
      setShowCustomInput(true);
      setShowCategoryModal(false);
      if (categoryName === 'Other') {
        setCustomIssueText(''); // Clear for Other option
      }
    } else {
      setSuggestedCategory(categoryName);
      setShowCategoryModal(false);
      setShowCustomInput(false);
    }
  };

  const confirmCustomIssue = () => {
    if (customIssueText.trim()) {
      setSuggestedCategory(customIssueText.trim());
      setShowCustomInput(false);
    }
  };

  const cancelCustomIssue = () => {
    setShowCustomInput(false);
    setCustomIssueText('');
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategorySearch('');
    setShowSearchSuggestions(false);
  };

  // Filter categories based on search
  const filteredCategories = availableCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    category.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Get search suggestions (top 5 matches)
  const searchSuggestions = categorySearch.length > 0 
    ? filteredCategories.slice(0, 5)
    : [];

  const handleSearchChange = (value: string) => {
    setCategorySearch(value);
    setShowSearchSuggestions(value.length > 0);
  };

  const selectFromSuggestion = (categoryName: string) => {
    selectCategory(categoryName);
    setShowSearchSuggestions(false);
    setCategorySearch('');
  };

  if (showCustomInput) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <button className="back-button" onClick={cancelCustomIssue}>
            ←
          </button>
          <h1>{selectedCategoryType === 'Other' ? 'Other Issue' : 'Custom Issue'}</h1>
          <p>{selectedCategoryType === 'Other' ? 'Describe the issue type' : 'Describe your issue'}</p>
        </div>
        
        <div className="content">
          <div className="form-group">
            <label>Issue Title/Category</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Broken bench in Central Park"
              value={customIssueText}
              onChange={(e) => setCustomIssueText(e.target.value)}
              maxLength={50}
            />
            <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
              {customIssueText.length}/50 characters
            </p>
          </div>
          
          <div className="custom-examples">
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Examples:</h4>
            <div className="example-chips">
              <button 
                className="example-chip"
                onClick={() => setCustomIssueText('Broken bench')}
              >
                Broken bench
              </button>
              <button 
                className="example-chip"
                onClick={() => setCustomIssueText('Missing signage')}
              >
                Missing signage
              </button>
              <button 
                className="example-chip"
                onClick={() => setCustomIssueText('Damaged fence')}
              >
                Damaged fence
              </button>
              <button 
                className="example-chip"
                onClick={() => setCustomIssueText('Unsafe conditions')}
              >
                Unsafe conditions
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <button 
              className="secondary-button"
              onClick={cancelCustomIssue}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              className="primary-button"
              onClick={confirmCustomIssue}
              disabled={!customIssueText.trim()}
              style={{ 
                flex: 1,
                opacity: !customIssueText.trim() ? 0.6 : 1
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCategoryModal) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <button className="back-button" onClick={closeCategoryModal}>
            ←
          </button>
          <h1>Select Category</h1>
          <p>Choose the type of issue</p>
        </div>
        
        <div className="content">
          <div className="category-search">
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => categorySearch.length > 0 && setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            />
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="search-suggestion-item"
                    onClick={() => selectFromSuggestion(suggestion.name)}
                  >
                    <div className="suggestion-name">{suggestion.name}</div>
                    <div className="suggestion-description">{suggestion.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="category-grid">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-item ${
                    suggestedCategory === category.name ? 'selected' : ''
                  }`}
                  onClick={() => selectCategory(category.name)}
                >
                  <div className="category-details">
                    <div className="category-name">{category.name}</div>
                    <div className="category-description">{category.description}</div>
                  </div>
                </button>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7f8c8d' }}>
                <p>No categories found matching "{categorySearch}"</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>Try a different search term</p>
              </div>
            )}
          </div>
          
          <button 
            className="primary-button"
            onClick={closeCategoryModal}
            style={{ marginTop: '20px', width: '100%' }}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    );
  }

  if (showCamera) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <button className="back-button" onClick={closeCamera}>
            ←
          </button>
          <h1>Take Photo</h1>
          <p>Position your camera and capture</p>
          {/* Camera Switch Button */}
          <button 
            className="camera-switch-button"
            onClick={switchCamera}
            title={`Switch to ${facingMode === 'environment' ? 'front' : 'back'} camera`}
          >
            📷↻
          </button>
        </div>
        
        <div className="content">
          <div className="camera-container">
            <video 
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            {/* Camera Switch Button Overlay */}
            <button 
              className="camera-switch-overlay"
              onClick={switchCamera}
              title={`Switch to ${facingMode === 'environment' ? 'front' : 'back'} camera`}
            >
              🔄
            </button>
            
            {/* GPS Brand Indicator - Top Right */}
            <div className="gps-brand">
              <div className="gps-brand-icon">📍</div>
              <span>GPS Map Camera</span>
            </div>
            
            {/* Location Status Overlay - Bottom Right like GPS Map Camera */}
            <div className="location-status-overlay">
              {isLoadingLocation ? (
                <div className="gps-camera-style">
                  <div className="location-info">
                    <div className="location-line">Acquiring GPS signal...</div>
                    <div className="coordinates-line">Please wait for accurate location</div>
                  </div>
                </div>
              ) : locationData ? (
                <div className="gps-camera-style">
                  <div className="location-info">
                    <div className="location-line">
                      {locationData.city}, {locationData.state}, {locationData.country}
                    </div>
                    {locationData.address && (
                      <div className="location-line address">
                        {locationData.address}
                      </div>
                    )}
                    <div className="coordinates-line">
                      {LocationService.getInstance().formatCoordinates(locationData.latitude, locationData.longitude)}
                    </div>
                    <div className="timestamp-line">
                      {LocationService.getInstance().formatTimestamp(locationData.timestamp)}
                    </div>
                    {/* Show accuracy for debugging */}
                    {locationData.accuracy > 50 && (
                      <div className="timestamp-line" style={{color: '#ffaa00'}}>
                        Accuracy: ±{Math.round(locationData.accuracy)}m
                      </div>
                    )}
                  </div>
                </div>
              ) : locationError ? (
                <div className="gps-camera-style">
                  <div className="location-info">
                    <div className="location-line">GPS Signal Weak</div>
                    <div className="coordinates-line">Move outdoors for better signal</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          
          <div className="camera-controls">
            <button 
              className="capture-button"
              onClick={capturePhoto}
            >
              Capture Photo
            </button>
            <button 
              className="cancel-button"
              onClick={closeCamera}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="screen fade-in">
        <div className="header">
          <h1>Report Submitted!</h1>
          <p>Thank you for making your city better</p>
        </div>
        <div className="content">
          <div className="success-message">
            Your report has been submitted successfully!<br/>
            You earned 25 points!<br/>
            You'll get updates on the progress
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ←
        </button>
        <h1>Report an Issue</h1>
        <p>Help improve your community</p>
      </div>
      
      <div className="content">
        {!selectedImage ? (
          <div className="camera-section">
            <button className="camera-button" onClick={handleCameraClick}>
              📷
            </button>
            <p style={{marginBottom: '10px', fontWeight: '600', color: '#2c3e50'}}>
              Take a photo with camera
            </p>
            <p style={{marginBottom: '15px', fontSize: '14px', color: '#7f8c8d'}}>
              Tap to open live camera and capture photo
            </p>
            <button className="gallery-button" onClick={handleGalleryClick}>
              Choose from Gallery
            </button>
          </div>
        ) : (
          <div className="captured-image-section">
            <h3 style={{ 
              textAlign: 'center', 
              color: '#2c3e50', 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Captured Issue Photo
            </h3>
            <div className="captured-image-container">
              <img 
                src={selectedImage} 
                alt="Captured issue" 
                className="captured-image"
              />
              <button 
                className="recapture-button"
                onClick={() => {
                  setSelectedImage(null);
                  setShowAIPreview(false);
                  setSuggestedCategory('');
                }}
              >
                Recapture Photo
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden-input"
          onChange={handleImageSelect}
          name="camera-input"
        />
        
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={handleImageSelect}
        />

        {isImageLoading && (
          <div className="form-group">
            <div className="image-loading">
              <div className="loading-spinner"></div>
              <p>Processing image...</p>
            </div>
          </div>
        )}

        {showAIPreview && (
          <div className="ai-preview slide-up">
            <h3>AI Detection Results</h3>
            <div className="category-suggestion">
              {suggestedCategory}
            </div>
            <p style={{marginBottom: '15px', color: '#6c757d'}}>
              Does this look correct?
            </p>
            <div className="ai-buttons">
              <button className="ai-button confirm" onClick={confirmAICategory}>
                Looks correct
              </button>
              <button className="ai-button edit" onClick={editCategory}>
                Edit Category
              </button>
            </div>
          </div>
        )}

        {suggestedCategory && !showAIPreview && (
          <div className="selected-category-display">
            <div className="category-header">
              <h4 style={{ color: '#2c3e50', margin: '0 0 5px 0', fontSize: '16px' }}>Selected Category:</h4>
              <button 
                className="edit-category-link"
                onClick={editCategory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0'
                }}
              >
                Change
              </button>
            </div>
            <div className="selected-category-badge">
              {suggestedCategory}
            </div>
          </div>
        )}

        <div className="location-section">
          {isLoadingLocation ? (
            <>
              <span className="location-icon">📍</span>
              <span className="location-text">Getting precise GPS location...</span>
              <div className="location-spinner-inline">⏳</div>
            </>
          ) : locationData ? (
            <>
              <span className="location-icon">📍</span>
              <div className="location-details">
                <div className="location-main">
                  {locationData.city}, {locationData.state}, {locationData.country}
                </div>
                {locationData.address && (
                  <div className="location-address">
                    {locationData.address}
                  </div>
                )}
                <div className="location-meta">
                  <span className="coordinates">
                    {LocationService.getInstance().formatCoordinates(locationData.latitude, locationData.longitude)}
                  </span>
                  <span className={`accuracy ${LocationService.getInstance().getLocationQuality(locationData.accuracy).quality}`}>
                    {LocationService.getInstance().getAccuracyDescription(locationData.accuracy)}
                  </span>
                  <span className="timestamp">
                    {LocationService.getInstance().formatTimestamp(locationData.timestamp)}
                  </span>
                </div>
                {locationData.accuracy > 100 && (
                  <div className="location-quality-warning">
                    💡 <strong>Tip:</strong> {LocationService.getInstance().getLocationQuality(locationData.accuracy).recommendation}
                  </div>
                )}
                {locationData.nearbyLandmarks && locationData.nearbyLandmarks.length > 0 && (
                  <div className="nearby-landmarks">
                    <strong>Nearby:</strong> {locationData.nearbyLandmarks.join(', ')}
                  </div>
                )}
              </div>
            </>
          ) : locationError ? (
            <>
              <span className="location-icon error">📍</span>
              <span className="location-text error">Location not available - {locationError}</span>
              <button 
                className="retry-location-btn"
                onClick={() => {
                  setIsLoadingLocation(true);
                  setLocationError(null);
                  LocationService.getInstance().getCompleteLocationData()
                    .then(setLocationData)
                    .catch((error) => setLocationError(error.message))
                    .finally(() => setIsLoadingLocation(false));
                }}
              >
                🔄 Retry
              </button>
            </>
          ) : (
            <>
              <span className="location-icon">📍</span>
              <span className="location-text">GPS location will be detected automatically</span>
            </>
          )}
        </div>

        <div className="form-group">
          <div className="description-header">
            <label>Description</label>
            <div className="description-toggle">
              <button
                type="button"
                className={`toggle-btn ${!useVoiceDescription ? 'active' : ''}`}
                onClick={() => {
                  setUseVoiceDescription(false);
                }}
              >
                ✏️ Text
              </button>
              <button
                type="button"
                className={`toggle-btn ${useVoiceDescription ? 'active' : ''}`}
                onClick={() => {
                  setUseVoiceDescription(true);
                }}
              >
                🎤 Voice
              </button>
            </div>
          </div>
          
          {!useVoiceDescription ? (
            <textarea
              className="form-input form-textarea"
              placeholder="Write a short note about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <div className="voice-input-section">
              {!audioBlob && !voiceTranscript ? (
                <div className="voice-input-options">
                  <div className="voice-option">
                    <h4>Record Audio</h4>
                    <p>Record your voice description</p>
                    <button
                      type="button"
                      className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    >
                      {isRecording ? (
                        <>
                          <span className="recording-indicator">🔴</span>
                          Stop Recording
                        </>
                      ) : (
                        <>
                          🎤 Start Recording
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="voice-divider">OR</div>
                  
                  <div className="voice-option">
                    <h4>Voice to Text</h4>
                    <p>Convert speech to text</p>
                    <button
                      type="button"
                      className={`voice-transcript-btn ${isTranscribing ? 'transcribing' : ''}`}
                      onClick={isTranscribing ? stopVoiceToText : startVoiceToText}
                    >
                      {isTranscribing ? (
                        <>
                          <span className="transcribing-indicator">🎙️</span>
                          Stop Listening
                        </>
                      ) : (
                        <>
                          🎙️ Start Speaking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="voice-result">
                  {audioBlob && (
                    <div className="audio-recording">
                      <h4>Audio Recording</h4>
                      <div className="audio-controls">
                        <button type="button" className="play-btn" onClick={playRecording}>
                          ▶️ Play
                        </button>
                        <button type="button" className="delete-btn" onClick={deleteRecording}>
                          🗑️ Delete
                        </button>
                      </div>
                      <audio ref={audioRef} src={audioUrl || undefined} />
                    </div>
                  )}
                  
                  {voiceTranscript && (
                    <div className="voice-transcript">
                      <h4>Voice Transcript</h4>
                      <div className="transcript-text">
                        {voiceTranscript}
                      </div>
                      <div className="transcript-controls">
                        <button type="button" className="use-transcript-btn" onClick={useTranscriptAsDescription}>
                          📝 Use as Text Description
                        </button>
                        <button type="button" className="delete-btn" onClick={deleteRecording}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {isTranscribing && (
                <div className="transcribing-status">
                  <div className="transcribing-animation">🎙️</div>
                  <p>Listening... Speak now</p>
                  {voiceTranscript && (
                    <div className="live-transcript">
                      {voiceTranscript}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="primary-button"
          onClick={handleSubmit}
          disabled={
            isSubmitting || 
            !selectedImage || 
            (!description.trim() && !useVoiceDescription) ||
            (useVoiceDescription && !audioBlob && !voiceTranscript.trim())
          }
          style={{
            opacity: (
              isSubmitting || 
              !selectedImage || 
              (!description.trim() && !useVoiceDescription) ||
              (useVoiceDescription && !audioBlob && !voiceTranscript.trim())
            ) ? 0.6 : 1,
            cursor: (
              isSubmitting || 
              !selectedImage || 
              (!description.trim() && !useVoiceDescription) ||
              (useVoiceDescription && !audioBlob && !voiceTranscript.trim())
            ) ? 'not-allowed' : 'pointer',
            width: '100%',
            marginTop: '20px'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportIssueScreen;