// ✅ IMPLEMENTED: FUTURISTIC AI WINDOW PANEL (CLAUDE-STYLE)
import React from 'react';

interface FuturisticHeroProps {
  robotImg: string;
  videoImg: string;
}

const FuturisticHero: React.FC<FuturisticHeroProps> = ({ robotImg = "/robot.png", videoImg = "/video-frame.png" }) => (
  <section id="futuristic-ai-panel" className="w-full flex justify-center items-center py-10 px-2 sm:px-6 bg-ui-black">
    <div className="w-full max-w-5xl relative rounded-3xl shadow-inset-glow flex flex-col md:flex-row items-center overflow-hidden">
      {/* SVG Background Panel */}
      <svg
        viewBox="0 0 1400 800"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full z-0"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="25" floodColor="#000000" floodOpacity="0.15"/>
          </filter>
        </defs>
        <rect
          x="0"
          y="0"
          rx="60"
          ry="60"
          width="100%"
          height="100%"
          fill="white"
          filter="url(#softShadow)"
        />
        {/* Corner Notch */}
        <path
          d="M1340 0 L1400 0 L1400 60 Z"
          fill="rgba(200, 200, 200, 0.3)"
        />
      </svg>
      {/* Left: Video Card */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 gap-6 relative z-10">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-ui-black/10 flex items-center justify-center">
          <img src={videoImg} alt="AI Video Thumbnail" className="object-cover w-full h-full" />
          <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ui-black/70 rounded-full p-4 border-2 border-white/30 shadow-lg">
            <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><polygon points="9.5,7.5 16.5,12 9.5,16.5"/></svg>
          </button>
          <div className="absolute bottom-0 left-0 w-full bg-ui-black/60 py-3 px-2 flex items-center justify-center">
            <span className="text-white text-base sm:text-lg font-futuristic font-bold text-center drop-shadow-lg tracking-wide">
              EMPOWER AI: SHAPING TOMORROW WITH ROBOTICS & AI
            </span>
          </div>
        </div>
      </div>
      {/* Right: Robot Image */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 relative z-10">
        <h1 className="text-2xl md:text-4xl font-futuristic font-bold text-ui-black text-center mb-6 tracking-wider leading-tight">
          EMPOWERING THE FUTURE WITH<br />AI & ROBOTICS
        </h1>
        <img src={robotImg} alt="Futuristic Robot" className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl rounded-2xl mx-auto" draggable="false" />
      </div>
    </div>
  </section>
);

export default FuturisticHero; 