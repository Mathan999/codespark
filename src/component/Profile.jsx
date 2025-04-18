import React, { useState } from 'react';
import { User, Phone, Mail, Key, LogOut, Trash2, Save, ArrowLeft, Home as HomeIcon, Play, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    phone: '+1 123-456-7890',
    userId: 'JD12345',
    email: 'john.doe@example.com'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
  };

  const confirmDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle delete account functionality here
      alert('Account deleted successfully');
      // Redirect to login or home page
    }
  };

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
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-transparent text-white focus:outline-none"
                        />
                      ) : (
                        <p className="text-white">{userData.phone}</p>
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
                        <p className="text-white">{userData.email}</p>
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
                      className="w-full bg-teal-500 text-white rounded-lg py-3 flex items-center justify-center font-bold transition-all hover:bg-teal-600"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
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
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-300 rounded-t-3xl py-2 md:py-3 lg:py-4 z-30">
        <div className="flex justify-around max-w-xl mx-auto">
          <Link to="/" className="flex flex-col items-center text-white transition-all hover:text-indigo-800">
            <HomeIcon className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Home</span>
          </Link>
          <Link to="/PlayGame" className="flex flex-col items-center text-white transition-all hover:text-indigo-800">
            <Play className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Play</span>
          </Link>
          <Link to="/blog" className="flex flex-col items-center text-white transition-all hover:text-indigo-800">
            <BookOpen className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Blog</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-indigo-800 font-bold">
            <User className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;