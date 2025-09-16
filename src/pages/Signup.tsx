import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, XCircle, ArrowLeft, Mail, Check } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialLoginButton from '../components/SocialLoginButton';
import { validatePassword, getPasswordValidationMessage } from '../utils/passwordValidation';
import { useAuth } from '../contexts/AuthContext';

type SignupStep = 'initial' | 'form' | 'name' | 'username' | 'profile';

const Signup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('initial');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    emailOrMobile: '',
    password: '',
    confirmPassword: '',
    bio: '',
    location: '',
    interests: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Filter username input to only allow letters, numbers, hyphens, and underscores
    if (field === 'username') {
      value = filterUsername(value);
    }
    
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Real-time password validation
    if (field === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
      
      // Show confirm password field when password is valid
      if (validation.isValid && !showConfirmPassword) {
        setShowConfirmPassword(true);
      } else if (!validation.isValid && showConfirmPassword && !formData.confirmPassword) {
        setShowConfirmPassword(false);
      }
    }
    
    // Real-time username availability checking
    if (field === 'username') {
      checkUsernameAvailability(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Simulate existing usernames database
  const existingUsernames = [
    'admin', 'user', 'test', 'london', 'newyork', 'paris', 'tokyo', 'john', 'jane', 'alex',
    'mike', 'sarah', 'david', 'emma', 'chris', 'anna', 'mark', 'lisa', 'paul', 'mary'
  ];

  const filterUsername = (value: string) => {
    // Only allow letters, numbers, hyphens, and underscores
    return value.replace(/[^a-zA-Z0-9_-]/g, '');
  };

  const generateUsernameSuggestions = (baseUsername: string): string[] => {
    const suggestions = [];
    const cleanBase = baseUsername.toLowerCase();
    
    // Generate various suggestions
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${cleanBase}${i}`);
    }
    
    // Add random suffixes
    const randomSuffixes = ['x', 'pro', '2024', 'official'];
    randomSuffixes.forEach(suffix => {
      suggestions.push(`${cleanBase}_${suffix}`);
      suggestions.push(`${cleanBase}-${suffix}`);
    });
    
    // Generate random alphanumeric suffixes
    for (let i = 0; i < 2; i++) {
      const randomStr = Math.random().toString(36).substring(2, 5);
      suggestions.push(`${cleanBase}-${randomStr}`);
      suggestions.push(`${cleanBase}_${randomStr}`);
    }
    
    // Filter out taken usernames and return first 5 available
    return suggestions
      .filter(suggestion => !existingUsernames.includes(suggestion))
      .slice(0, 5);
  };

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle');
      setUsernameSuggestions([]);
      return;
    }

    setUsernameStatus('checking');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const isAvailable = !existingUsernames.includes(username.toLowerCase());
    
    if (isAvailable) {
      setUsernameStatus('available');
      setUsernameSuggestions([]);
    } else {
      setUsernameStatus('taken');
      const suggestions = generateUsernameSuggestions(username);
      setUsernameSuggestions(suggestions);
    }
  }, [existingUsernames, generateUsernameSuggestions]);

  const validateEmailOrMobile = (value: string) => {
    if (!value.trim()) {
      return { isValid: false, message: 'Email or mobile number is required' };
    }
    
    const hasAtSymbol = value.includes('@');
    
    if (hasAtSymbol) {
      // If @ symbol exists, validate as email
      if (!validateEmail(value)) {
        return { isValid: false, message: 'Please enter a valid email address' };
      }
    } else {
      // If no @ symbol, validate as mobile number (must be exactly 10 digits)
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        return { isValid: false, message: 'Include @ for email/mobile number must be exactly 10 digits' };
      }
    }
    
    return { isValid: true, message: '' };
  };

  const validateFormStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 'form') {
      const emailMobileValidation = validateEmailOrMobile(formData.emailOrMobile);
      if (!emailMobileValidation.isValid) {
        newErrors.emailOrMobile = emailMobileValidation.message;
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!passwordValidation.isValid) {
        newErrors.password = getPasswordValidationMessage(passwordValidation);
      }

      if (showConfirmPassword && !formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (showConfirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 'name') {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
    } else if (currentStep === 'username') {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (usernameStatus === 'taken') {
        newErrors.username = 'Username already registered. Try one of the suggestions below.';
      } else if (usernameStatus === 'checking') {
        newErrors.username = 'Checking username availability...';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueWithEmailPhone = () => {
    setCurrentStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormStep()) return;

    if (currentStep === 'form' && passwordValidation.isValid && formData.password === formData.confirmPassword) {
      setCurrentStep('name');
    } else if (currentStep === 'name') {
      setCurrentStep('username');
    } else if (currentStep === 'username') {
      setCurrentStep('profile');
    } else if (currentStep === 'profile') {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Signup attempt:', formData);
      // In a real app, you would send the data to a backend
      login(); // Set authenticated state
      navigate('/'); // Redirect to main app
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData({ ...formData, username: suggestion });
    checkUsernameAvailability(suggestion);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} signup clicked`);
    alert(`${provider} signup integration would be implemented here`);
  };

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep('initial');
    } else if (currentStep === 'name') {
      setCurrentStep('form');
    } else if (currentStep === 'username') {
      setCurrentStep('name');
    } else if (currentStep === 'profile') {
      setCurrentStep('username');
    }
  };

  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;

    // If all requirements are met, hide the indicator to save space
    if (passwordValidation.isValid) return null;

    // Only show requirements that are NOT met (in red)
    const unmetRequirements = [];
    
    if (!passwordValidation.hasMinLength) {
      unmetRequirements.push({ key: 'length', text: 'At least 8 characters' });
    }
    if (!passwordValidation.hasLowerCase) {
      unmetRequirements.push({ key: 'lower', text: 'One lowercase letter' });
    }
    if (!passwordValidation.hasUpperCase) {
      unmetRequirements.push({ key: 'upper', text: 'One uppercase letter' });
    }
    if (!passwordValidation.hasNumber) {
      unmetRequirements.push({ key: 'number', text: 'One number' });
    }
    if (!passwordValidation.hasSpecialChar) {
      unmetRequirements.push({ key: 'special', text: 'One special character' });
    }

    // If no unmet requirements, don't show anything
    if (unmetRequirements.length === 0) return null;

    return (
      <div className="password-strength">
        <div className="password-requirements">
          {unmetRequirements.map((req) => (
            <div key={req.key} className="requirement unmet">
              <XCircle size={16} />
              <span>{req.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Step 1: Initial signup options
  if (currentStep === 'initial') {
    return (
      <div className="auth-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <div className="auth-icon">
              <Shield size={40} />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the CivicX platform</p>
          </div>

          <div className="signup-options">
            <div className="primary-signup-option">
              <Button
                onClick={handleContinueWithEmailPhone}
                variant="outline"
                size="large"
                fullWidth
              >
                <Mail size={20} />
                Continue with email/phone number
              </Button>
            </div>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-login-section">
              <SocialLoginButton
                provider="google"
                onClick={() => handleSocialLogin('Google')}
              />
              <SocialLoginButton
                provider="facebook"
                onClick={() => handleSocialLogin('Facebook')}
              />
              <SocialLoginButton
                provider="apple"
                onClick={() => handleSocialLogin('Apple')}
              />
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Email/Phone and Password form
  if (currentStep === 'form') {
    return (
      <div className="auth-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="auth-icon">
              <Shield size={40} />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Enter your details to continue</p>
          </div>

          <form onSubmit={handleFormSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            <Input
              label="Email or Mobile Number"
              type="text"
              placeholder="Email/mobile number"
              value={formData.emailOrMobile}
              onChange={handleInputChange('emailOrMobile')}
              error={errors.emailOrMobile}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              required
              showPasswordToggle
            />

            <PasswordStrengthIndicator />

            {showConfirmPassword && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
                showPasswordToggle
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Continue
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Name form
  if (currentStep === 'name') {
    return (
      <div className="auth-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="auth-icon">
              <Shield size={40} />
            </div>
            <h1 className="auth-title">Your Name</h1>
            <p className="auth-subtitle">What should we call you?</p>
          </div>

          <form onSubmit={handleFormSubmit} className="auth-form">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Username form
  if (currentStep === 'username') {
    return (
      <div className="auth-container">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="auth-icon">
              <Shield size={40} />
            </div>
            <h1 className="auth-title">Choose Username</h1>
            <p className="auth-subtitle">This will be your public identity</p>
          </div>

          <form onSubmit={handleFormSubmit} className="auth-form">
            <Input
              label="Username"
              type="text"
              placeholder="Enter a username"
              value={formData.username}
              onChange={handleInputChange('username')}
              error={errors.username}
              required
            />

            {usernameStatus === 'checking' && (
              <div className="username-status checking">
                <div className="spinner"></div>
                Checking availability...
              </div>
            )}

            {usernameStatus === 'available' && (
              <div className="username-status available">
                <Check size={16} />
                Username available
              </div>
            )}

            {usernameStatus === 'taken' && (
              <div className="username-status taken">
                <XCircle size={16} />
                Username taken. Try one of these:
                <div className="username-suggestions">
                  {usernameSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggestion-button"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={usernameStatus === 'checking' || (usernameStatus === 'taken' && !errors.username)}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Step 5: Profile setup
  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="auth-icon">
            <Shield size={40} />
          </div>
          <h1 className="auth-title">Profile Setup</h1>
          <p className="auth-subtitle">Tell us more about yourself</p>
        </div>

        <form onSubmit={handleFormSubmit} className="auth-form">
          <Input
            label="Bio (Optional)"
            type="text"
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChange={handleInputChange('bio')}
          />

          <Input
            label="Location (Optional)"
            type="text"
            placeholder="Where are you based?"
            value={formData.location}
            onChange={handleInputChange('location')}
          />

          <Input
            label="Interests (Optional)"
            type="text"
            placeholder="What are your interests?"
            value={formData.interests}
            onChange={handleInputChange('interests')}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;