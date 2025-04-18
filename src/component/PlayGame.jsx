import React, { useState } from 'react';
import { Home as HomeIcon, Play,  BookOpen, User, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function PlayGame() {
  const [luckyNumbers, setLuckyNumbers] = useState(Array(4).fill({ number: 'N', alphabet: 'A' }));
  const [showBuyStarModal, setShowBuyStarModal] = useState(false);
  
  const handleNumberChange = (index, value) => {
    const updatedNumbers = [...luckyNumbers];
    updatedNumbers[index] = { ...updatedNumbers[index], number: value };
    setLuckyNumbers(updatedNumbers);
  };

  const handleAlphabetChange = (index, value) => {
    const updatedNumbers = [...luckyNumbers];
    updatedNumbers[index] = { ...updatedNumbers[index], alphabet: value };
    setLuckyNumbers(updatedNumbers);
  };

  const handleAddRow = (index) => {
    // In a real app, this would add a new row of inputs
    console.log("Add row at index:", index);
  };

  const handleSubmit = () => {
    console.log("Submitting lucky numbers:", luckyNumbers);
    // Handle submission logic here
  };

  const toggleBuyStarModal = () => {
    setShowBuyStarModal(!showBuyStarModal);
  };

  return (
    <div className="min-h-screen bg-indigo-950 fixed inset-0">
      {/* Fixed Background Layer */}
      
      {/* Scrollable Content Container */}
      <div className="flex flex-col items-center justify-center w-full h-full overflow-y-auto relative">
        {/* Main Content - Added flex justify-center for better centering */}
        <div className="flex flex-col items-center justify-center w-full pb-24 max-w-6xl mx-auto px-4">
          {/* Game Card - Centered in the viewport with additional margin adjustments */}
          <div className="w-full max-w-xs mx-auto mt-8 mb-6 bg-indigo-800 rounded-xl overflow-hidden shadow-lg">
            {/* Header Section - More compact */}
            <div className="bg-indigo-900 p-4 text-center">
              <h1 className="text-white text-xl font-bold tracking-wider mb-3">PLAY GAME</h1>
              
              {/* User Profile Section - Horizontal layout */}
              <div className="flex items-center justify-between px-2">
                {/* Profile Circle - Smaller as in image */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden border border-white">
                    <div className="bg-blue-200 h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-indigo-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2">
                    <p className="text-white text-sm text-left">User Name</p>
                  </div>
                </div>
                
                {/* Star Count - As shown in image */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                    </svg>
                    <span className="text-white font-bold text-sm">30</span>
                  </div>
                  <button 
                    className="bg-yellow-400 text-indigo-900 font-bold text-xs px-3 py-1 rounded-full mt-1"
                    onClick={toggleBuyStarModal}
                  >
                    BUY STAR
                  </button>
                </div>
              </div>
            </div>
            
            {/* Game Input Section - Light blue background as in image */}
            <div className="bg-blue-200 p-4">
              <h2 className="text-indigo-900 font-bold text-center text-lg mb-4">TYPE LUCKY NUM</h2>
              
              {/* First row with example values as in image */}
              <div className="flex items-center space-x-2 mb-3 justify-center">
                <input
                  type="text"
                  defaultValue="123"
                  className="w-16 h-8 border border-gray-300 text-center font-bold text-base rounded"
                />
                <input
                  type="text"
                  defaultValue="5"
                  className="w-10 h-8 border border-gray-300 text-center font-bold text-base rounded"
                />
                <button className="flex items-center justify-center w-8 h-8 bg-white rounded-full border border-gray-300">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Lucky Number Input Rows - Matching the image layout */}
              {luckyNumbers.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3 justify-center">
                  <input
                    type="text"
                    value={item.number}
                    onChange={(e) => handleNumberChange(index, e.target.value)}
                    className="w-16 h-8 border border-gray-300 text-center font-bold text-base rounded"
                    maxLength={3}
                  />
                  <input
                    type="text"
                    value={item.alphabet}
                    onChange={(e) => handleAlphabetChange(index, e.target.value)}
                    className="w-10 h-8 border border-gray-300 text-center font-bold text-base rounded"
                    maxLength={1}
                  />
                  <button 
                    onClick={() => handleAddRow(index)}
                    className="flex items-center justify-center w-8 h-8 bg-white rounded-full border border-gray-300"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
              
              {/* Submit Button - Yellow as in image */}
              <div className="mt-4 mb-2">
                <button 
                  className="w-full bg-yellow-400 text-indigo-900 font-bold py-2 rounded-lg text-base"
                  onClick={handleSubmit}
                >
                  SUBMIT
                </button>
              </div>
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
          <Link to="/PlayGame" className="flex flex-col items-center text-indigo-800 font-bold">
            <Play className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Play</span>
          </Link>
          <Link to="/blog" className="flex flex-col items-center text-white transition-all hover:text-indigo-800">
          <BookOpen className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />            
          <span className="text-sm md:text-base">Blog</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-white transition-all hover:text-indigo-800">
          <User className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Profile</span>
          </Link>
        </div>
      </div>

      {/* Buy Star Modal - Shows when showBuyStarModal is true */}
      {showBuyStarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleBuyStarModal}></div>
          
          {/* Modal Content */}
          <div className="bg-indigo-950 w-64 rounded-xl shadow-xl z-10 overflow-hidden">
            {/* Modal Header - BUY STARS text at bottom */}
            <div className="flex items-end justify-center h-20 relative">
              <h2 className="text-white text-2xl font-bold mb-4 tracking-wider">BUY STARS</h2>
            </div>
            
            {/* Coupon Code Section */}
            <div className="bg-blue-200 mx-4 mb-4 p-4 rounded-lg">
              <p className="text-center font-bold text-gray-800 mb-3">COUPON CODE</p>
              
              {/* Input field for coupon */}
              <div className="bg-white rounded p-2 mb-3">
                <input 
                  type="text"
                  placeholder="Add Your Star With Coupon Code"
                  className="w-full text-center text-sm"
                />
              </div>
              
            
              <button className="bg-yellow-400 text-gray-800 w-full py-2 rounded font-bold">
                SUBMIT
              </button>
            </div>
            
          
            <div className="bg-blue-200 mx-4 mb-6 p-4 rounded-lg flex items-center justify-center">
              <div className="relative">
                <svg className="w-16 h-16 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-xl">20</span>
              </div>
            </div>
            
           
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGame;