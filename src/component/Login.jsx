import React, { useState } from 'react';
import { ArrowLeft, User, Phone, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from './api';

function Login() {
  const [formData, setFormData] = useState({
    name: '', // Field matches database column 'name'
    phone: '' // Field matches database column 'phone'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', formData.name, formData.phone);
      
      // Call the API login function with the correct field names that match the database
      const result = await api.login(formData.name, formData.phone);
      
      if (result.success) {
        // Store user data in sessionStorage
        sessionStorage.setItem('userId', result.userId);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', formData.name);
        
        // Show success message if account was newly created
        if (result.message && result.message.includes('created')) {
          setSuccessMessage('Account created successfully! Redirecting to your profile...');
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        } else {
          // Redirect to profile page immediately for existing users
          navigate('/profile');
        }
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error details:', error);
      // More user-friendly error message
      if (error.message && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        setError('Cannot connect to the server. Please check your internet connection or try again later.');
      } else {
        setError(error.message || 'Login failed. Please check your credentials and try again.');
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
              
              {/* Success message if any */}
              {successMessage && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-2 rounded-lg mb-4">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <h2 className="text-white text-2xl font-bold mb-6">Welcome Back</h2>
                
                {/* Name Field */}
                <div className="mb-4">
                  <div className="flex items-center border-b border-indigo-800 py-2">
                    <User className="h-5 w-5 text-teal-500 mr-3" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full bg-transparent text-white focus:outline-none"
                        maxLength={10}
                        pattern="\d{10}"
                      />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Enter your 10-digit phone number</p>
                </div>
                
                {/* Login Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 text-indigo-950 rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-yellow-400 disabled:opacity-50"
                >
                  {isLoading ? (
                    "Logging in..."
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Login / Sign Up
                    </>
                  )}
                </button>
                
                {/* Create Account Link */}
                <div className="mt-4 text-center">
                  <p className="text-gray-400">
                    First time? Just enter your details and we'll create an account for you.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;