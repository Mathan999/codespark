import React, { useState } from 'react';
import { ArrowLeft, User, Phone, ShieldCheck, LogIn, SendHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

function Login() {
  const [step, setStep] = useState(1); // 1: Username & Phone, 2: OTP Verification
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = (e) => {
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
    
    // Reset error state
    setError('');
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to OTP verification step
    }, 1500);
    
    // In a real implementation, you would call your Firebase function here
    // sendOTP(formData.phoneNumber).then(() => setStep(2)).catch(error => setError(error.message));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate OTP
    if (!formData.otp.trim()) {
      setError('OTP is required');
      return;
    }
    
    // Reset error state
    setError('');
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to profile or home after successful login
      window.location.href = '/profile';
    }, 1500);
    
    // In a real implementation, you would verify the OTP with Firebase here
    // verifyOTP(formData.phoneNumber, formData.otp).then(() => navigate('/profile')).catch(error => setError(error.message));
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
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full bg-transparent text-white focus:outline-none"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Format: +1234567890</p>
                  </div>
                  
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
                  
                  {/* Back Button */}
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full bg-transparent text-gray-300 py-2 mt-4 font-medium"
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