import React from 'react';
import { Home as HomeIcon, Play, BookOpen, User,  } from 'lucide-react';
import { Link } from 'react-router-dom';

function Blog() {
  // Sample blog data - you can replace this with your actual data
  const blogPosts = [
    {
      id: 1,
      title: "First Paper",
      content: "Content about the first paper...",
      leftImage: "/api/placeholder/400/320",
      rightImage: "/api/placeholder/400/320"
    },
    {
      id: 2,
      title: "Second Paper",
      content: "Content about the second paper...",
      leftImage: "/api/placeholder/400/320",
      rightImage: "/api/placeholder/400/320"
    },
    {
      id: 3,
      title: "Third Paper",
      content: "Content about the third paper...",
      leftImage: "/api/placeholder/400/320",
      rightImage: "/api/placeholder/400/320"
    }
  ];

  return (
    <div className="min-h-screen bg-indigo-950 fixed inset-0">
      {/* Scrollable Content Container */}
      <div className="flex flex-col items-center w-full h-full overflow-y-auto relative">
        <div className="flex flex-col items-center w-full pb-20 max-w-6xl mx-auto px-4">
        
          
          {/* Blog Header */}
          <div className="w-full pb-8 md:pb-12 pt-8">
            <h2 className="text-white text-center font-bold text-3xl md:text-4xl lg:text-5xl tracking-widest">BLOG</h2>
          </div>

          {/* Blog Content */}
          <div className="w-full max-w-4xl">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-indigo-900 rounded-xl mb-8 p-4 md:p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Left side - Image with Title */}
                  <div className="md:w-1/2 flex flex-col">
                    <h3 className="text-yellow-500 font-bold text-xl md:text-2xl lg:text-3xl mb-2">{post.title}</h3>
                    <div className="rounded-lg overflow-hidden border-2 border-yellow-500">
                      <img 
                        src={post.leftImage} 
                        alt={`${post.title} featured image`} 
                        className="w-full h-48 md:h-56 lg:h-64 object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Right side - Image */}
                  <div className="md:w-1/2">
                    <div className="rounded-lg overflow-hidden border-2 border-yellow-500 h-48 md:h-64 lg:h-72">
                      <img 
                        src={post.rightImage} 
                        alt={`${post.title} additional image`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Blog post content */}
                <div className="mt-4 text-white">
                  <p className="text-sm md:text-base lg:text-lg">{post.content}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg font-bold transition-all hover:bg-teal-400">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
          <Link to="/blog" className="flex flex-col items-center text-indigo-800 font-bold">
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

export default Blog;