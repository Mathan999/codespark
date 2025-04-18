import React from 'react';
import { Home as HomeIcon, Play, BookOpen, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-indigo-950 fixed inset-0">
      {/* Fixed Background Layer - covers entire viewport */}
      
      {/* Scrollable Content Container */}
      <div className="flex flex-col items-center w-full h-full overflow-y-auto relative">
        <div className="flex flex-col items-center w-full pb-20 max-w-6xl mx-auto px-4">
          {/* Login Button in right corner */}
          <div className="w-full flex justify-end pt-4">
            <Link to="/login" className="flex items-center bg-yellow-500 text-indigo-950 px-4 py-2 rounded-lg font-bold transition-all hover:bg-yellow-400">
              <LogIn className="h-5 w-5 mr-2" />
              <span>Login</span>
            </Link>
          </div>
          
          {/* Logo Section - Centered in top third, responsive sizing */}
          <div className="w-full flex justify-center pt-8 pb-8">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
              {/* White circle background */}
              <div className="absolute inset-0 bg-white rounded-full"></div>
              
              {/* Orange logo rectangle - centered */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                             bg-orange-500 rounded-lg w-28 h-36 md:w-36 md:h-48 lg:w-40 lg:h-52 flex items-center justify-center z-10">
                <div className="text-center">
                  <h1 className="font-serif italic">
                    <span className="text-yellow-300 text-2xl md:text-3xl lg:text-4xl">Y</span>
                    <span className="text-yellow-300 text-xl md:text-2xl lg:text-3xl">not</span>
                    <br />
                    <span className="text-white text-3xl md:text-4xl lg:text-5xl">games</span>
                  </h1>
                </div>
              </div>
              
              {/* Blue dice - left side */}
              <div className="absolute left-0 top-1/3 transform -translate-x-1/4 
                           bg-blue-400 rounded-lg w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 z-20">
                <div className="flex flex-wrap justify-center items-center h-full">
                  <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white rounded-full mx-1"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white rounded-full mx-1"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white rounded-full mx-1"></div>
                </div>
              </div>
              
              {/* Yellow dice - right side */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/4 
                           bg-yellow-400 rounded-lg w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 z-20">
                <div className="flex flex-wrap justify-center items-center h-full">
                  <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white rounded-full mx-1"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white rounded-full mx-1"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white rounded-full mx-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Winning Tips Title */}
          <div className="w-full pb-8 md:pb-12">
            <h2 className="text-white text-center font-bold text-3xl md:text-4xl lg:text-5xl tracking-widest">WINNING TIPS</h2>
          </div>

          {/* Main Buttons Grid - Responsive layout */}
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 px-4">
            {/* First Row */}
            <div className="border-4 border-yellow-500 rounded-2xl overflow-hidden w-28 md:w-40 lg:w-64 transition-all hover:scale-105">
              <div className="bg-teal-500 w-full h-full">
                <Link to="/blog">
                  <button className="w-full h-full py-4 md:py-6 lg:py-8 px-2 text-white font-bold">
                    <span className="text-lg md:text-xl lg:text-2xl">First</span><br />
                    <span className="text-lg md:text-xl lg:text-2xl">Paper</span>
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="border-4 border-yellow-500 rounded-2xl overflow-hidden w-28 md:w-40 lg:w-64 transition-all hover:scale-105">
              <div className="bg-teal-500 w-full h-full">
                <Link to="/blog">
                  <button className="w-full h-full py-4 md:py-6 lg:py-8 px-2 text-white font-bold">
                    <span className="text-lg md:text-xl lg:text-2xl">Second</span><br />
                    <span className="text-lg md:text-xl lg:text-2xl">Paper</span>
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="border-4 border-yellow-500 rounded-2xl overflow-hidden w-28 md:w-40 lg:w-64 transition-all hover:scale-105">
              <div className="bg-teal-500 w-full h-full">
                <Link to="/blog">
                  <button className="w-full h-full py-4 md:py-6 lg:py-8 px-2 text-white font-bold">
                    <span className="text-lg md:text-xl lg:text-2xl">Third</span><br />
                    <span className="text-lg md:text-xl lg:text-2xl">Paper</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Second Row */}
            <div className="border-4 border-yellow-500 rounded-2xl overflow-hidden w-28 md:w-40 lg:w-64 transition-all hover:scale-105">
              <div className="bg-teal-500 w-full h-full">
                <button className="w-full h-full py-4 md:py-6 lg:py-8 px-2 text-white font-bold text-lg md:text-xl lg:text-2xl">
                  Tips
                </button>
              </div>
            </div>
            
            <div className="border-4 border-yellow-500 rounded-2xl overflow-hidden w-28 md:w-40 lg:w-64 transition-all hover:scale-105">
              <div className="bg-teal-500 w-full h-full">
                <button className="w-full h-full py-4 md:py-6 lg:py-8 px-2 text-white font-bold text-lg md:text-xl lg:text-2xl">
                  VIP Tips
                </button>
              </div>
            </div>
            
            <div className="border-4 border-yellow-500 rounded-2xl overflow-hidden w-28 md:w-40 lg:w-64 transition-all hover:scale-105">
              <div className="bg-teal-500 w-full h-full">
                <button className="w-full h-full py-4 md:py-6 lg:py-8 px-2 text-white font-bold text-lg md:text-xl lg:text-2xl">
                  Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Fixed to bottom regardless of scroll */}
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-300 rounded-t-3xl py-2 md:py-3 lg:py-4 z-30">
        <div className="flex justify-around max-w-xl mx-auto">
          <Link to="/" className="flex flex-col items-center text-indigo-800 font-bold">
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
          <Link to="/profile" className="flex flex-col items-center text-white transition-all hover:text-indigo-800">
            <User className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <span className="text-sm md:text-base">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;