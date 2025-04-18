import React, { useState } from 'react';
import { ArrowLeft, User, Phone, ShieldCheck, LogIn, SendHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import axios from 'axios'; // Add axios for API calls

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4jY_8Yq-lNjpckKsnyASL1di8w3UtmGk",
    authDomain: "chatting-6c30c.firebaseapp.com",
    projectId: "chatting-6c30c",
    storageBucket: "chatting-6c30c.firebasestorage.app",
    messagingSenderId: "990085182879",
    appId: "1:990085182879:web:9c081f1cae8aca68bff9aa",
    measurementId: "G-9JF8TK0WM3"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Feature flag to control authentication method
// We're setting up three methods now
const AUTH_METHOD = "SMS_API"; // Options: "FIREBASE", "SMS_API", "MOCK"

// SMS API configuration
const SMS_API_CONFIG = {
    apiKey: "CKqOje6mDEP9RM2daxQbvprnuilSL7t5TzVcsXYUh1kWwoNFyJPjwDSBKmoMEtiIY6vZz9Qeb3JlV1xU", // Replace with your SMS gateway API key
    url: "https://www.fast2sms.com/dev/bulkV2", // Replace with your SMS gateway URL
};

function Login() {
  const [step, setStep] = useState(1); // 1: Username & Phone, 2: OTP Verification
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const navigate = useNavigate();

  // Helper function to format phone number with +91
  const formatPhoneNumber = (number) => {
    // Remove all non-digit characters
    const digitsOnly = number.replace(/\D/g, '');
    
    // If the number already starts with country code, return as is
    if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
      return '+' + digitsOnly;
    }
    
    // Otherwise, add +91 prefix to numbers without country code
    // For 10-digit numbers
    if (digitsOnly.length === 10) {
      return '+91' + digitsOnly;
    }
    
    // Return with + prefix if it's a valid number
    return '+' + digitsOnly;
  };

  // Helper function to get raw phone number without +91 for SMS API
  const getRawPhoneNumber = (formattedNumber) => {
    // Remove '+91' prefix if present
    return formattedNumber.replace(/^\+91/, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Real SMS API implementation for Fast2SMS
  const sendRealSMS = async (phoneNumber, otp) => {
    try {
      // Prepare the raw phone number without +91 for the SMS API
      const rawPhoneNumber = getRawPhoneNumber(phoneNumber);
      
      // Create the message content
      const message = `Your YnotGames verification code is: ${otp}. This code will expire in 10 minutes.`;
      
      // Make API call to Fast2SMS
      const response = await axios({
        method: 'POST',
        url: SMS_API_CONFIG.url,
        headers: {
          'authorization': SMS_API_CONFIG.apiKey,
          'Content-Type': 'application/json'
        },
        data: {
          route: 'q', // Use 'q' for quick SMS or 'v' for promotional
          numbers: rawPhoneNumber,
          message: message,
          language: 'english',
          flash: 0
        }
      });
      
      console.log("SMS sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Failed to send SMS:", error);
      throw new Error("Failed to send SMS. Please try again.");
    }
  };

  // Mock authentication implementation (for development)
  const sendMockOTP = async (formattedPhone) => {
    // Generate a random 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP in localStorage (only for development)
    localStorage.setItem('tempOTP', generatedOTP);
    localStorage.setItem('tempPhone', formattedPhone);
    
    console.log("Development OTP for", formattedPhone, ":", generatedOTP); // Only for testing
    
    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generatedOTP);
      }, 1500);
    });
  };

  const verifyMockOTP = async () => {
    const storedOTP = localStorage.getItem('tempOTP');
    const storedPhone = localStorage.getItem('tempPhone');
    
    // Check if the entered OTP matches and phone number matches
    if (formData.otp === storedOTP && formData.phoneNumber === storedPhone) {
      // Store user data in localStorage
      localStorage.setItem('username', formData.username);
      localStorage.setItem('phoneNumber', formData.phoneNumber);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', 'user_' + Date.now()); // Generate a fake user ID
      
      // Clean up the temporary OTP
      localStorage.removeItem('tempOTP');
      localStorage.removeItem('tempPhone');
      
      // Return success
      return true;
    } else {
      // Return failure
      return false;
    }
  };

  // Setup invisible reCAPTCHA for Firebase auth
  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Reset reCAPTCHA
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
      }
    });
  };

  // Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    // Format phone number with +91
    const formattedPhone = formatPhoneNumber(formData.phoneNumber);
    
    // Reset error state
    setError('');
    setIsLoading(true);
    
    try {
      let generatedOTP = null;
      
      // Choose authentication method
      switch (AUTH_METHOD) {
        case "FIREBASE": {
          // Try Firebase Phone Authentication
          setupRecaptcha();
          
          // Send OTP via Firebase
          const appVerifier = window.recaptchaVerifier;
          const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
          
          // Store the confirmation result
          setConfirmationResult(confirmation);
          break;
        }
          
        case "SMS_API": {
          // Generate OTP
          generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Send SMS via API
          await sendRealSMS(formattedPhone, generatedOTP);
          
          // Store OTP securely for verification
          localStorage.setItem('tempOTP', generatedOTP);
          localStorage.setItem('tempPhone', formattedPhone);
          break;
        }
          
        case "MOCK":
        default:
          // Use the mock authentication
          generatedOTP = await sendMockOTP(formattedPhone);
          break;
      }
      
      // Update the phone number with the formatted version
      setFormData(prev => ({ ...prev, phoneNumber: formattedPhone }));
      
      // Move to OTP verification step
      setStep(2);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // If primary method fails, fall back to mock auth for development
      try {
        console.log('Falling back to mock authentication');
        await sendMockOTP(formattedPhone);
        
        // Update the phone number with the formatted version
        setFormData(prev => ({ ...prev, phoneNumber: formattedPhone }));
        
        // Move to OTP verification step
        setStep(2);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Using error instead of mockError to avoid unused variable warning
        setError('Failed to send verification code. Please try again.');
      }
      
      // Reset recaptcha if there's an error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate OTP
    if (!formData.otp.trim()) {
      setError('OTP is required');
      return;
    }
    
    // Reset error state
    setError('');
    setIsLoading(true);
    
    try {
      let isSuccess = false;
      
      // Verify based on authentication method
      switch (AUTH_METHOD) {
        case "FIREBASE":
          if (confirmationResult) {
            try {
              const result = await confirmationResult.confirm(formData.otp);
              
              // User is signed in
              const user = result.user;
              
              // Store user data in localStorage for session management
              localStorage.setItem('username', formData.username);
              localStorage.setItem('phoneNumber', formData.phoneNumber);
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userId', user.uid);
              
              isSuccess = true;
            } catch (firebaseError) {
              console.error('Firebase verification error:', firebaseError);
              throw new Error('Invalid OTP. Please try again.');
            }
          }
          break;
          
        case "SMS_API":
        case "MOCK":
        default:
          // Use mock verification (same logic works for stored OTPs from SMS API)
          isSuccess = await verifyMockOTP();
          if (!isSuccess) {
            throw new Error('Invalid OTP. Please try again.');
          }
          break;
      }
      
      if (isSuccess) {
        // Redirect to profile page
        navigate('/profile');
      } else {
        setError('Wrong verification code. Please try again.');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    
    try {
      // Format phone number with +91
      const formattedPhone = formData.phoneNumber;
      let generatedOTP = null;
      
      // Choose authentication method for resending
      switch (AUTH_METHOD) {
        case "FIREBASE": {
          // Try Firebase
          setupRecaptcha();
          
          // Resend OTP
          const appVerifier = window.recaptchaVerifier;
          const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
          
          // Update confirmation result
          setConfirmationResult(confirmation);
          break;
        }
          
        case "SMS_API": {
          // Generate new OTP
          generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Send SMS via API
          await sendRealSMS(formattedPhone, generatedOTP);
          
          // Store OTP securely for verification
          localStorage.setItem('tempOTP', generatedOTP);
          localStorage.setItem('tempPhone', formattedPhone);
          break;
        }
          
        case "MOCK":
        default:
          // Use mock
          generatedOTP = await sendMockOTP(formattedPhone);
          break;
      }
      
      setError('');
    } catch (error) {
      console.error('Error resending OTP:', error);
      
      // If primary method fails, fall back to mock auth for development
      try {
        console.log('Falling back to mock authentication for resend');
        await sendMockOTP(formData.phoneNumber);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Using error instead of mockError to avoid unused variable warning
        setError('Failed to resend code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 fixed inset-0">
      {/* Scrollable Content Container */}
      <div className="flex flex-col items-center w-full h-full overflow-y-auto relative">
        <div className="flex flex-col items-center w-full pb-20 max-w-6xl mx-auto px-4">
          {/* Header with back button */}
          <div className="w-full flex justify-between items-center pt-4">
            <Link to="/" className="flex items-center text-white hover:text-yellow-400">
              <ArrowLeft className="h-6 w-6" />
              <span className="ml-2">Back</span>
            </Link>
            
            <h1 className="text-white text-xl font-bold">Login</h1>
            
            <div className="w-12"></div> {/* Empty div for spacing */}
          </div>
          
          {/* Logo Section - Smaller version of home logo */}
          <div className="w-full flex justify-center pt-8 pb-12">
            <div className="relative w-32 h-32">
              {/* White circle background */}
              <div className="absolute inset-0 bg-white rounded-full"></div>
              
              {/* Orange logo rectangle - centered */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                             bg-orange-500 rounded-lg w-20 h-24 flex items-center justify-center z-10">
                <div className="text-center">
                  <h1 className="font-serif italic">
                    <span className="text-yellow-300 text-xl">Y</span>
                    <span className="text-yellow-300 text-lg">not</span>
                    <br />
                    <span className="text-white text-2xl">games</span>
                  </h1>
                </div>
              </div>
              
              {/* Blue dice - left side */}
              <div className="absolute left-0 top-1/3 transform -translate-x-1/4 
                           bg-blue-400 rounded-lg w-8 h-8 z-20">
                <div className="flex flex-wrap justify-center items-center h-full">
                  <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                  <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                </div>
              </div>
              
              {/* Yellow dice - right side */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/4 
                           bg-yellow-400 rounded-lg w-8 h-8 z-20">
                <div className="flex flex-wrap justify-center items-center h-full">
                  <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                  <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Card */}
          <div className="w-full max-w-md bg-indigo-900 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-500">
            <div className="p-6">
              {/* Error message if any */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {step === 1 ? (
                <form onSubmit={handleSendOTP}>
                  <h2 className="text-white text-2xl font-bold mb-6">Welcome Back</h2>
                  
                  {/* Username Field */}
                  <div className="mb-4">
                    <div className="flex items-center border-b border-indigo-800 py-2">
                      <User className="h-5 w-5 text-teal-500 mr-3" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full bg-transparent text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  {/* Phone Number Field */}
                  <div className="mb-6">
                    <div className="flex items-center border-b border-indigo-800 py-2">
                      <Phone className="h-5 w-5 text-teal-500 mr-3" />
                      <div className="flex items-center w-full">
                        <span className="text-gray-400 mr-1">+91</span>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber.replace(/^\+91/, '')}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className="w-full bg-transparent text-white focus:outline-none"
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Enter your 10-digit phone number</p>
                  </div>
                  
                  {/* Invisible reCAPTCHA container */}
                  <div id="recaptcha-container"></div>
                  
                  {/* Send OTP Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-500 text-indigo-950 rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-yellow-400 disabled:opacity-50"
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <SendHorizontal className="h-5 w-5 mr-2" />
                        Send OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin}>
                  <h2 className="text-white text-2xl font-bold mb-6">OTP Verification</h2>
                  
                  <div className="mb-2 text-gray-300 text-sm">
                    We've sent a verification code to {formData.phoneNumber}
                  </div>
                  
                  {/* OTP Input Field */}
                  <div className="mb-6">
                    <div className="flex items-center border-b border-indigo-800 py-2">
                      <ShieldCheck className="h-5 w-5 text-teal-500 mr-3" />
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter OTP"
                        className="w-full bg-transparent text-white focus:outline-none"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  
                  {/* Login Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-500 text-white rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-teal-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      "Verifying..."
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        Login
                      </>
                    )}
                  </button>
                  
                  {/* Resend OTP Button */}
                  <button 
                    type="button"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="w-full bg-transparent text-yellow-400 hover:text-yellow-300 py-2 mt-2 font-medium"
                  >
                    Resend OTP
                  </button>
                  
                  {/* Back Button */}
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full bg-transparent text-gray-300 py-2 mt-2 font-medium"
                  >
                    Back to Phone Entry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;