import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Key, LogOut, Trash2, Save, Home as HomeIcon, Play, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from './api'; // Import the API service

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    userId: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const result = await api.getUserProfile(userId);
        
        if (result.success) {
          const user = result.user;
          setUserData({
            name: user.name || '',
            phone: user.phone || '',
            userId: `YN${user.id.toString().padStart(5, '0')}`,
            email: user.email || '',
          });
          setFormData({
            name: user.name || '',
            phone_number: user.phone || '',
            email: user.email || ''
          });
        } else {
          setError(result.message || 'Failed to load profile');
          // Don't automatically redirect on error - give user a chance to see the error
        }
      } catch (error) {
        setError(error.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const userId = sessionStorage.getItem('userId');
      
      if (formData.phone_number && formData.phone_number !== userData.phone) {
        if (!/^\d{10}$/.test(formData.phone_number)) {
          setError('Please enter a valid 10-digit phone number');
          setIsLoading(false);
          return;
        }
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }
      
      const result = await api.updateProfile(userId, formData);
      
      if (result.success) {
        setUserData(prev => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone_number
        }));
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const confirmDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        const userId = sessionStorage.getItem('userId');
        const result = await api.deleteAccount(userId);
        
        if (result.success) {
          sessionStorage.clear();
          alert('Account deleted successfully');
          navigate('/login');
        } else {
          setError(result.message || 'Failed to delete account');
        }
      } catch (error) {
        setError(error.message || 'Failed to delete account');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // if (isLoading && userData.name === '') {
  //   return (
  //     // <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
  //     //   <div className="text-white text-xl">Loading profile...</div>
  //     // </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-indigo-950 fixed inset-0">
      {/* Scrollable Content Container */}
      <div className="flex flex-col items-center w-full h-full overflow-y-auto relative">
        <div className="flex flex-col items-center w-full pb-20 max-w-6xl mx-auto px-4">
          
          {/* Profile Avatar */}
          <div className="mt-8 mb-6">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-indigo-950" />
              </div>
            </div>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="w-full max-w-md bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Success message if any */}
          {successMessage && (
            <div className="w-full max-w-md bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-2 rounded-lg mb-4">
              {successMessage}
            </div>
          )}

          {/* Profile Info Card */}
          <div className="w-full max-w-md bg-indigo-900 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-500">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Profile Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex items-center border-b border-indigo-800 py-2">
                    <User className="h-5 w-5 text-teal-500 mr-3" />
                    <div className="w-full">
                      <label className="block text-xs text-gray-400">Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-transparent text-white focus:outline-none"
                        />
                      ) : (
                        <p className="text-white">{userData.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center border-b border-indigo-800 py-2">
                    <Phone className="h-5 w-5 text-teal-500 mr-3" />
                    <div className="w-full">
                      <label className="block text-xs text-gray-400">Phone Number</label>
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-1">+91</span>
                          <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full bg-transparent text-white focus:outline-none"
                            maxLength={10}
                            pattern="\d{10}"
                          />
                        </div>
                      ) : (
                        <p className="text-white">{userData.phone ? `+91 ${userData.phone}` : 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center border-b border-indigo-800 py-2">
                    <Mail className="h-5 w-5 text-teal-500 mr-3" />
                    <div className="w-full">
                      <label className="block text-xs text-gray-400">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent text-white focus:outline-none"
                        />
                      ) : (
                        <p className="text-white">{userData.email || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  {/* User ID */}
                  <div className="flex items-center py-2">
                    <Key className="h-5 w-5 text-teal-500 mr-3" />
                    <div className="w-full">
                      <label className="block text-xs text-gray-400">User ID</label>
                      <p className="text-white">{userData.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  {isEditing ? (
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-teal-500 text-white rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-teal-600 disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-teal-500 text-white rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-teal-600"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Edit Profile
                    </button>
                  )}
                  
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="w-full bg-yellow-500 text-indigo-950 rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-yellow-400"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                  
                  <button 
                    type="button"
                    onClick={confirmDelete}
                    className="w-full bg-transparent border border-red-500 text-red-500 rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Fixed to bottom regardless of scroll */}
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-900 rounded-t-3xl py-2 md:py-3 lg:py-4 z-30">
        <div className="flex justify-around max-w-xl mx-auto">
          <Link to="/" className="flex flex-col items-center text-indigo-300 transition-all hover:text-yellow-500">
            <HomeIcon className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Home</span>
          </Link>
          <Link to="/PlayGame" className="flex flex-col items-center text-indigo-300 transition-all hover:text-yellow-500">
            <Play className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Play</span>
          </Link>
          <Link to="/blog" className="flex flex-col items-center text-indigo-300 transition-all hover:text-yellow-500">
            <BookOpen className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Blog</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-yellow-500 font-bold">
            <User className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;