// ✅ IMPLEMENTED: FUTURISTIC AI WINDOW PANEL (PIXEL-PERFECT REFERENCE)
import React from "react";

const robotImg = "/robot.png";
const logo = (
  <div className="flex items-center gap-2">
    {/* Replace with SVG or image if available */}
    <span className="inline-block w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-ui-black text-xl">🤖</span>
    <span className="font-futuristic text-lg text-white font-bold tracking-wide">RoboWorks<br /><span className="font-normal text-xs text-muted-text">Technologies</span></span>
  </div>
);
const nav = (
  <nav className="flex items-center gap-3 md:gap-5">
    {['Home', 'About us', 'Pages', 'Contact'].map((item) => (
      <button key={item} className="px-4 py-1 rounded-pill bg-panel-gray/30 text-ui-black font-futuristic text-sm hover:bg-panel-gray/60 transition font-semibold shadow-sm">{item}</button>
    ))}
    <button className="ml-2 p-2 rounded-full bg-panel-gray/30 hover:bg-panel-gray/60 transition">
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-ui-black"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
  </nav>
);
const notchedPanel = (
  <svg
    className="absolute inset-0 w-full h-full z-0"
    viewBox="0 0 320 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="atop" />
      </filter>
    </defs>
    <path
      d="M24 0H116V24H204V0H296C308.15 0 318 9.84974 318 22V216C318 228.15 308.15 238 296 238H24C11.8497 238 2 228.15 2 216V22C2 9.84974 11.8497 0 24 0Z"
      fill="#e5e7eb"
      stroke="#d1d5db"
      strokeWidth="1.5"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      filter="url(#glass)"
    />
  </svg>
);

const FuturisticAiPanel = () => {
  return (
    <section
      id="futuristic-ai-panel"
      className="w-full flex justify-center items-center py-8 px-2 sm:px-6 bg-ui-black min-h-[100vh] relative"
      style={{ minHeight: "100vh" }}
    >
      <div className="relative w-full max-w-5xl mx-auto rounded-3xl bg-ui-black shadow-neon border border-panel-gray/20 overflow-hidden" style={{zIndex:1}}>
        {/* Header: Logo + Nav */}
        <header className="flex items-center justify-between px-8 pt-6 pb-2">
          {logo}
          {nav}
        </header>
        {/* Headline above notched panel */}
        <div className="w-full flex flex-col items-start md:items-center px-8 pt-4 pb-2">
          <h1 className="text-3xl md:text-5xl font-futuristic font-bold text-white tracking-wider leading-tight mb-2 md:mb-3">
            EMPOWERING THE FUTURE WITH
          </h1>
          <h2 className="text-2xl md:text-4xl font-futuristic font-bold text-white tracking-wider leading-tight mb-6">
            AI & ROBOTICS
          </h2>
        </div>
        {/* Main Notched Glass Panel */}
        <div className="relative flex flex-col md:flex-row items-center justify-between px-4 md:px-8 pb-12 pt-2 md:pt-4" style={{minHeight:'420px'}}>
          {/* SVG Notched Glass Panel BG */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
            {notchedPanel}
          </div>
          {/* Left: Video Card and Partner Info */}
          <div className="relative w-full md:w-[44%] max-w-sm z-10 flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden shadow-inset-glow bg-panel-gray/80 flex flex-col items-end relative">
              <img
                src="/video-frame.png"
                alt="AI Video Thumbnail"
                className="object-cover w-full h-56 md:h-64"
                draggable="false"
              />
              {/* Play Button Overlay */}
              <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ui-black/60 rounded-full p-4 border-2 border-white/30 shadow-neon">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><polygon points="9.5,7.5 16.5,12 9.5,16.5"/></svg>
              </button>
              {/* Overlay Text */}
              <div className="absolute bottom-0 left-0 w-full bg-ui-black/60 py-3 px-2 flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-futuristic font-bold text-center drop-shadow-lg tracking-wide">
                  EMPOWER AI: SHAPING TOMORROW WITH ROBOTICS & AI
                </span>
              </div>
            </div>
            {/* Partner Avatars and Badge */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <img key={i} src={`https://randomuser.me/api/portraits/men/${30+i}.jpg`} alt="Partner" className="w-8 h-8 rounded-full border-2 border-white" />
                ))}
              </div>
              <span className="text-panel-gray text-lg font-futuristic font-bold ml-2">100K+</span>
              <span className="text-muted-text text-xs ml-1">Partners</span>
            </div>
            {/* Get Involved Button */}
            <button className="mt-2 px-6 py-2 rounded-pill bg-neon-blue text-white font-futuristic font-bold shadow-neon hover:bg-neon-purple transition">Get Involved</button>
          </div>
          {/* Right: Robot Image and Explore More Button */}
          <div className="w-full md:w-[56%] flex flex-col items-center justify-center z-10 mt-8 md:mt-0">
            <img
              src={robotImg}
              alt="Futuristic Robot"
              className="w-64 h-64 md:w-[420px] md:h-[420px] object-contain drop-shadow-xl rounded-3xl mx-auto"
              draggable="false"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            {/* Explore More Button */}
            <button className="mt-6 px-10 py-3 rounded-pill bg-ui-black text-panel-gray font-futuristic font-bold text-lg shadow-inset-glow hover:bg-panel-gray transition border border-panel-gray/40">
              EXPLORE MORE
            </button>
            <p className="mt-4 text-ui-black text-xs text-center max-w-md font-futuristic font-semibold">
              OUR AI AND ROBOTICS COMPANY SPECIALIZES IN THE DEVELOPMENT OF CUTTING-EDGE TECHNOLOGY FOR A WIDE RANGE OF INDUSTRIES.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FuturisticAiPanel; 