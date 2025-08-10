import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Sample course data for titles
const courseTitles = {
  "1": "Blockchain Fundamentals",
  "3": "Gold Investment Strategies",
  "4": "Silver Markets & Analysis",
  "5": "DeFi & The Future of Finance",
  "6": "Portfolio Diversification with Metals & Crypto"
};

const logoWatermark = (
  <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute opacity-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
    <path d="M30,45a45,45 0 1,1 120,0a45,45 0 1,1 -120,0" stroke="#fff" strokeWidth="8" fill="none" />
    <path d="M60,45a15,15 0 1,1 60,0a15,15 0 1,1 -60,0" stroke="#fff" strokeWidth="8" fill="none" />
  </svg>
);

const ComingSoon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseTitle = courseTitles[id as keyof typeof courseTitles] || "Course";

  return (
  <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-white via-company-primary to-company-secondary animate-gradient-x relative overflow-hidden">
      {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-white via-company-primary to-company-secondary opacity-80 blur-2xl animate-gradient-x z-0" />
      
      <div className="w-full max-w-4xl relative z-10 flex justify-center">
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/20 overflow-hidden">
          {/* Watermark */}
          {logoWatermark}
          
          {/* Course Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight text-center drop-shadow-xl font-sans">
            {courseTitle}
          </h1>
          
          <div className="text-center text-company-secondary text-xl italic mb-8 font-glacial">
            "Knowledge is the new gold."
          </div>
          
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-company-secondary via-company-primary to-company-pink rounded-full mb-12" />

          {/* Coming Soon Content */}
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-br from-company-secondary to-company-pink text-white font-bold py-6 px-12 rounded-2xl shadow-2xl border-4 border-white/20 text-3xl tracking-wide mb-8">
                🚀 COMING SOON 🚀
              </div>
              
              <p className="text-white/90 text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
                We're working hard to bring you this amazing course. 
                Get ready to dive deep into our world .
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-4 h-4 bg-company-gold rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-company-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-company-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              
              <p className="text-company-secondary text-lg font-semibold mb-12">
                Stay tuned for updates!
              </p>
            </div>
            
            {/* Back to Courses Button */}
            <button
              onClick={() => navigate('/?tab=courses')}
              className="inline-block bg-company-primary hover:bg-company-secondary text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-200 text-xl tracking-wide border-2 border-company-secondary hover:scale-105"
            >
              ← Back to Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 