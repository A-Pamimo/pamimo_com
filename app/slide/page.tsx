/* eslint-disable @next/next/no-img-element */
import React from 'react';

const SlidePage: React.FC = () => {
  return (
    <main className="h-screen w-full bg-[#f0f0f0] flex items-center justify-center p-2 md:p-4 font-mono text-black selection:bg-black selection:text-white overflow-hidden cursor-crosshair">
      {/* 
        Slide Container 
        Aspect Ratio 16:9 
        Palette: Neo-Brutalist Pop (Yellow, Green, Pink, Blue)
        FINAL VERSION - Fully Dynamic (cqw units)
      */}
      <div
        className="relative flex flex-col w-full aspect-video bg-white border-[0.3cqw] border-black shadow-[1cqw_1cqw_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-full max-w-[177.78vh]"
        style={{ containerType: 'inline-size' }}
      >

        {/* HEADER - YELLOW POP */}
        <header className="shrink-0 border-b-[0.3cqw] border-black p-[1.5cqw] flex justify-between items-center bg-[#FFD700] z-10 relative h-[15%] overflow-hidden">
          {/* Header Sticker 1 */}
          <div className="absolute top-[0.5cqw] left-[45%] w-[5cqw] h-[5cqw] pointer-events-none opacity-90 hidden lg:block transform rotate-90">
            <img src="/slide-assets/extra-5.jpg" alt="" className="w-full h-full object-contain mix-blend-multiply" />
          </div>

          <div className="flex flex-col justify-center h-full relative z-10">
            <div className="inline-block bg-black text-white px-[0.8cqw] py-[0.1cqw] text-[0.8cqw] font-bold mb-[0.3cqw] transform -rotate-1 border border-transparent w-max hover:scale-105 transition-transform">
              INTRODUCING_FELLOW_2026
            </div>
            <h1 className="text-[4.5cqw] font-black uppercase tracking-tighter leading-none mb-[0.2cqw] text-black hover:tracking-wide transition-all duration-300">
              PAMIMO AKINJIDE
            </h1>
            <p className="text-[1.1cqw] font-bold uppercase tracking-widest opacity-80 text-black">
              5TH YEAR ECON HONS // CS MINOR [USASK]
            </p>
          </div>

          <div className="hidden md:flex flex-row items-center gap-[1.5cqw] h-full relative z-10">
            {/* Header Sticker 2 */}
            {/* Header Sticker 2 - Smile */}
            <div className="w-[5cqw] h-[5cqw] border-[0.2cqw] border-black bg-white transform -rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
              <img src="/slide-assets/header-smile.png" alt="Smile" className="w-full h-full object-cover" />
            </div>

            <div className="bg-white border-[0.3cqw] border-black px-[1cqw] py-[0.5cqw] text-center transform rotate-2 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-help">
              <span className="block text-[0.7cqw] font-bold uppercase text-gray-500">INTERESTS_IN_ASIA</span>
              <span className="block text-[1.4cqw] font-black uppercase text-[#FF4500] leading-none my-[0.2cqw]">
                GOING 0-TO-1
              </span>
              <span className="text-[0.7cqw] font-bold uppercase text-black">
                NAVIGATING AMBIGUITY
              </span>
            </div>
          </div>
        </header>

        {/* MAIN GRID - 4 COLUMNS WITH HEAVY TEXTURE */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 divide-x-[0.2cqw] lg:divide-x-[0.3cqw] divide-y-0 divide-black bg-[radial-gradient(circle,#000_1px,transparent_1px)] [background-size:12px_12px] opacity-100 overflow-hidden min-h-0">

          {/* COLUMN 1: ORIGIN */}
          <div className="col-span-1 p-[1cqw] flex flex-col relative group bg-white/95 overflow-hidden h-full hover:bg-white transition-colors">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_6px)]"></div>

            <div className="mb-[0.8cqw] border-b-[0.3cqw] border-black pb-[0.3cqw] relative z-30 shrink-0">
              <h2 className="text-[2.2cqw] font-black uppercase leading-none transform -skew-x-6 origin-left text-black hover:skew-x-0 transition-transform duration-300">
                01_THE_ORIGIN
              </h2>
              <p className="text-[0.7cqw] font-bold text-gray-500 mt-[0.3cqw] tracking-tight truncate">LAGOS → MARYLAND → ABUJA → SASKATCHEWAN</p>
            </div>

            <div className="flex-1 flex flex-col justify-start gap-[1cqw] relative z-30 text-black overflow-hidden">
              <div className="bg-gray-100 p-[0.6cqw] border-[0.15cqw] border-black relative z-30 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] transform -rotate-1 shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="mb-[0.2cqw] text-[0.7cqw] text-gray-500 font-black tracking-wider">UNIQUE_PATH</p>
                <p className="text-[0.85cqw] uppercase leading-tight">EXPANDING TECH ACCESS W/ NGOS [NIGERIA].</p>
              </div>

              {/* Absolute Image - frozrn */}
              <div className="absolute top-[6cqw] right-0 w-[4cqw] h-[4cqw] border-[0.15cqw] border-black bg-white transform rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-40 flex items-center justify-center hover:scale-150 hover:z-50 hover:rotate-0 transition-all duration-300 origin-center">
                <img src="/slide-assets/frozen.jpg" alt="Impact" className="w-full h-full object-cover" />
                <div className="absolute -top-[0.8cqw] -left-[0.8cqw] bg-black text-white text-[0.7cqw] px-[0.4cqw] font-black transform -rotate-6">-41°C</div>
              </div>

              <div className="bg-blue-50 p-[0.6cqw] border-[0.15cqw] border-blue-600 relative z-30 shadow-[0.3cqw_0.3cqw_0px_0px_#2563EB] transform rotate-1 shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="mb-[0.2cqw] text-[0.7cqw] text-blue-600 font-black tracking-wider">THE_FREEZE</p>
                <p className="uppercase leading-tight text-[0.85cqw]">LANDED SASKATCHEWAN. <span className="text-white bg-blue-600 px-[0.2cqw]">-28°C</span>.</p>
                <p className="mt-[0.2cqw] text-[0.7cqw] opacity-70">&quot;ONLY BEEN WORSE SINCE.&quot;</p>
              </div>

              <div className="bg-purple-50 p-[0.6cqw] border-[0.15cqw] border-purple-600 relative z-30 shadow-[0.3cqw_0.3cqw_0px_0px_#9333EA] transform -rotate-1 shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="mb-[0.2cqw] text-[0.7cqw] text-purple-600 font-black tracking-wider">USASK_ERA</p>
                <p className="uppercase leading-tight text-[0.85cqw]">FOUNDED <span className="bg-purple-200 px-[0.2cqw] border border-purple-600"> USASK ECON STUDENTS SOCIETY</span>. SCALED TO 30+. <span className="bg-purple-200 px-[0.2cqw] border border-purple-600">RAISED $20K+</span></p>
              </div>

              {/* ESS Group Photo - New */}
              <div className="absolute top-[15.5cqw] left-[0.5cqw] w-[5cqw] h-[4cqw] border-[0.2cqw] border-black bg-white transform rotate-3 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-40 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/group-ess.jpg" alt="ESS Group" className="w-full h-full object-cover" />
              </div>

              {/* Dolapo Shoutout - Removed from here */}

              {/* PHOTO: Pamimo Face */}
              <div className="shrink min-h-0 relative border-[0.3cqw] border-black bg-white transform rotate-2 shadow-[0.5cqw_0.5cqw_0px_0px_rgba(0,0,0,1)] z-20 flex items-center justify-center self-center w-auto h-auto max-h-[12cqw] aspect-square mt-auto mb-[0.4cqw] hover:scale-110 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/mountain.jpg" alt="Frozen Face" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* COLUMN 2: BUILDER */}
          <div className="col-span-1 p-[1cqw] flex flex-col relative group bg-[#f0fff4]/95 overflow-hidden h-full hover:bg-[#f0fff4] transition-colors">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[repeating-linear-gradient(-45deg,#000,#000_1px,transparent_1px,transparent_6px)]"></div>

            <div className="mb-[0.8cqw] border-b-[0.3cqw] border-black pb-[0.3cqw] relative z-30 shrink-0">
              <h2 className="text-[2.2cqw] font-black uppercase leading-none transform skew-x-6 origin-left text-black hover:skew-x-0 transition-transform duration-300">
                02_THE_BUILDER
              </h2>
              <p className="text-[0.7cqw] font-bold text-green-700 mt-[0.3cqw]">FOUNDER & STRATEGIST</p>
            </div>

            {/* Cheque Photo - New (Top Right of Col 2) */}
            <div className="absolute top-[3.5cqw] right-[0.5cqw] w-[6cqw] h-[4cqw] border-[0.2cqw] border-black bg-white transform rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-40 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
              <img src="/slide-assets/presentation.jpg" alt="Winning Cheque" className="w-full h-full object-cover" />
              <div className="absolute -bottom-[0.4cqw] -right-[0.4cqw] bg-black text-white text-[0.5cqw] px-[0.3cqw] font-black transform -rotate-3">WEG</div>
            </div>

            <div className="flex-1 flex flex-col justify-start gap-[0.8cqw] relative z-30 text-black overflow-hidden">
              {/* Presentation Image */}
              {/* Presentation Image - Linked */}
              <a href="https://worldsedgegroup.com" target="_blank" rel="noopener noreferrer" className="shrink min-h-0 relative w-auto h-auto max-h-[14cqw] aspect-square border-[0.3cqw] border-black bg-white transform -rotate-2 p-[0.6cqw] shadow-[0.5cqw_0.5cqw_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center z-20 mx-auto hover:scale-110 hover:rotate-0 hover:z-50 transition-all duration-300 mt-[0.8cqw] block cursor-pointer">
                <img src="/slide-assets/group-check.jpg" alt="Presentation" className="w-full h-full object-cover" />
                <div className="absolute -bottom-[0.6cqw] -right-[0.6cqw] bg-black text-white px-[0.4cqw] py-[0.1cqw] text-[0.6cqw] font-black transform rotate-3 border-2 border-white">
                  Amplify Win
                </div>
              </a>

              <div className="p-[0.6cqw] bg-white border-[0.15cqw] border-green-500 shadow-[0.3cqw_0.3cqw_0px_0px_#22C55E] relative z-30 transform rotate-1 mt-[0.8cqw] shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="text-[0.7cqw] text-green-700 mb-[0.2cqw] font-black tracking-wider">CURRENT_STATE</p>
                <p className="uppercase leading-tight text-[0.85cqw]">FROM HACKATHONS TO STARTING A CONSULTING COMPANY, NOW LOOKING FOR THE <span className="bg-[#FFD700] px-[0.2cqw] border border-black font-black transform -rotate-1 inline-block">NEXT THING TO BUILD!!</span></p>
              </div>

              <div className="p-[0.6cqw] bg-blue-100 border-[0.15cqw] border-blue-600 shadow-[0.3cqw_0.3cqw_0px_0px_#2563EB] relative z-30 transform -rotate-1 mt-[0.8cqw] shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="text-[0.7cqw] text-blue-700 mb-[0.2cqw] font-black tracking-wider">RBC_AGENTIC_AI</p>
                <p className="uppercase leading-tight text-[0.85cqw]">BUILT AGENTIC AI @ RBC. <span className="bg-yellow-300 px-[0.2cqw] border border-black transform -rotate-2 inline-block">WON $20K</span>.</p>
              </div>

              {/* Trophy Photo - New */}
              <div className="absolute top-[9cqw] left-[0.2cqw] w-[5cqw] h-[5cqw] border-[0.2cqw] border-black bg-white transform -rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-40 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/group-cup.jpg" alt="Trophy" className="w-full h-full object-cover" />
                <div className="absolute -bottom-[0.6cqw] -right-[0.6cqw] bg-black text-white px-[0.4cqw] py-[0.1cqw] text-[0.6cqw] font-black transform rotate-3 border-2 border-white">
                  coHacks Win
                </div>
              </div>

              {/* KBBQ Photo */}
              <div className="shrink min-h-0 relative w-auto max-h-[8cqw] aspect-square border-[0.3cqw] border-black bg-white transform -rotate-3 shadow-[0.5cqw_0.5cqw_0px_0px_rgba(0,0,0,1)] z-10 flex items-center justify-center self-start ml-[0.8cqw] mt-auto mb-[0.4cqw] hover:scale-110 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/food-kbbq.jpg" alt="KBBQ Fuel" className="w-full h-full object-cover" />
                <div className="absolute -top-[0.6cqw] -right-[0.6cqw] bg-[#FFD700] text-black text-[0.6cqw] px-[0.4cqw] font-black border border-black transform rotate-12">FUEL</div>
              </div>

              {/* Ramen Photo - Restored */}
              <div className="absolute bottom-[2cqw] right-[1cqw] w-[5cqw] h-[5cqw] border-[0.2cqw] border-black bg-white transform rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-20 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/ramen.jpg" alt="Ramen" className="w-full h-full object-cover" />
                <div className="absolute -top-[0.4cqw] -left-[0.4cqw] bg-black text-white text-[0.5cqw] px-[0.3cqw] font-black transform -rotate-3">OG_FUEL</div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: THE VIBE */}
          <div className="col-span-1 p-[1cqw] flex flex-col relative group bg-white/95 overflow-hidden h-full hover:bg-white transition-colors">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_6px)]"></div>

            <div className="mb-[0.8cqw] border-b-[0.3cqw] border-black pb-[0.3cqw] relative z-30 shrink-0">
              <h2 className="text-[2.2cqw] font-black uppercase leading-none text-[#FF1493] group-hover:tracking-wider transition-all duration-300">
                03_THE_VIBE
              </h2>
              <p className="text-[0.7cqw] font-bold text-[#FF69B4] mt-[0.3cqw]">CHAOS // CREATIVITY</p>
            </div>

            {/* Sandwich Image - Moved to prevent cropping */}
            <div className="absolute top-[4.5cqw] right-[0.8cqw] w-[4cqw] h-[4cqw] border-[0.15cqw] border-black bg-pink-200 transform rotate-12 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-40 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
              <img src="/slide-assets/sandwich.jpg" alt="Vibe" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 flex flex-col justify-start gap-[1.5cqw] relative z-30 text-black overflow-hidden">

              <div className="bg-[#FFC0CB] border-[0.15cqw] border-black p-[0.8cqw] text-black transform -rotate-2 relative z-30 w-full self-center shadow-[0.4cqw_0.4cqw_0px_0px_#000] mt-[2cqw] shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <div className="bg-black text-white inline-block px-[0.4cqw] py-[0.1cqw] text-[0.6cqw] mb-[0.4cqw] font-black border border-white transform -rotate-3">ASK_ME_ABOUT</div>
                <p className="text-black uppercase leading-tight font-black text-[1cqw]">
                  &quot;COOKING IS JUST ENGINEERING YOU CAN EAT.&quot;
                </p>
              </div>

              {/* Tacos Photo - Main */}
              <div className="shrink min-h-0 relative w-full aspect-video max-h-[12cqw] border-[0.3cqw] border-black bg-[#FFB6C1] transform rotate-2 shadow-[0.5cqw_0.5cqw_0px_0px_rgba(0,0,0,1)] z-20 flex items-center justify-center hover:scale-110 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/tacos.jpg" alt="Tacos" className="w-full h-full object-cover" />
                <div className="absolute -bottom-[0.6cqw] -left-[0.6cqw] bg-black text-white text-[0.6cqw] px-[0.4cqw] font-black transform -rotate-6">ENGINEERING</div>
              </div>

              {/* Curry Photo - Sticker */}
              <div className="absolute top-[8cqw] left-[1cqw] w-[6cqw] h-[4cqw] border-[0.2cqw] border-black bg-white transform -rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-40 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/food-curry.jpg" alt="Curry" className="w-full h-full object-cover" />
              </div>

              {/* Madame Tussauds Block - Text Restored + Sticker */}
              <div className="bg-yellow-200 border-[0.15cqw] border-black p-[0.5cqw] transform -rotate-2 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] relative z-30 shrink-0 mt-auto mb-[0.5cqw] hover:rotate-0 hover:scale-110 transition-all duration-200 group/confess">
                <p className="text-[0.6cqw] font-black bg-black text-white inline-block px-[0.3cqw] mb-[0.2cqw]">CONFESSION</p>
                <p className="text-[0.65cqw] font-bold uppercase leading-tight w-[70%]">ACCIDENTALLY BROKE INTO MADAME TUSSAUDS NY. GOT FREE VIP PASS & PICS.</p>

                {/* Photo Sticker Absolute */}
                <div className="absolute -top-[5cqw] right-[0.2cqw] w-[5cqw] aspect-[3/4] border-[0.2cqw] border-black bg-white transform rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                  <img src="/slide-assets/madame-tussauds.jpg" alt="Madame Tussauds" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-[0.3cqw] -right-[0.3cqw] bg-red-600 text-white text-[0.4cqw] px-[0.2cqw] font-bold transform -rotate-3">VIP</div>
                </div>
              </div>

              <div className="bg-pink-50 border-[0.15cqw] border-pink-500 p-[0.8cqw] transform rotate-1 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] relative z-20 shrink-0 mb-[0.4cqw] hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="text-[0.6cqw] font-black bg-pink-600 text-white inline-block px-[0.3cqw] mb-[0.2cqw]">AMA: ASK ME ANYTHING ABOUT</p>
                <p className="uppercase text-[0.85cqw] font-black leading-tight">MANHWA → SELF-HELP PIPELINE</p>
                <p className="uppercase text-[0.7cqw] text-black mt-[0.3cqw] font-black"><span className="bg-lime-300 px-[0.2cqw] border border-black inline-block transform rotate-1">SINGING & WRITING.</span></p>
                {/* Jersey Photo - New */}
                <div className="absolute -top-[3cqw] -right-[0.5cqw] w-[4cqw] h-[5cqw] border-[0.2cqw] border-black bg-white transform rotate-12 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-50 flex items-center justify-center hover:scale-150 hover:rotate-0  transition-all duration-300">
                  <img src="/slide-assets/bio-jersey.jpg" alt="Jersey Vibe" className="w-full h-full object-cover" />
                </div>
                <p className="uppercase text-[0.7cqw] text-gray-600 mt-[0.2cqw] font-bold">RANDOM FACTS COLLECTOR.</p>
                <p className="uppercase text-[0.7cqw] text-pink-600 mt-[0.1cqw] font-black">SPICY FOOD ENTHUSIAST.</p>
                <p className="uppercase text-[0.65cqw] text-purple-600 mt-[0.2cqw] font-black leading-tight">CAN WE TALK ABOUT THE GEOPOLITICAL & ECONOMIC STATE OF THE WORLD RIGHT NOW?</p>
              </div>
            </div>
          </div>

          {/* COLUMN 4: MISSION */}
          <div className="col-span-1 p-[1cqw] flex flex-col relative group bg-[#E0F7FA]/95 overflow-hidden h-full hover:bg-[#E0F7FA] transition-colors">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[repeating-linear-gradient(135deg,#000,#000_1px,transparent_1px,transparent_6px)]"></div>

            <div className="mb-[0.8cqw] border-b-[0.3cqw] border-black pb-[0.3cqw] relative z-30 shrink-0">
              <h2 className="text-[2.2cqw] font-black uppercase leading-none transform -skew-y-2 origin-bottom-left text-[#00008B] hover:skew-y-0 transition-transform duration-300">
                04_MISSION
              </h2>
              <p className="text-[0.7cqw] font-bold text-blue-600 mt-[0.3cqw]">THE_NEXT_FRONTIER</p>
            </div>

            <div className="flex-1 flex flex-col justify-start gap-[0.8cqw] relative z-30 text-black overflow-hidden">
              {/* Fish Image */}
              <div className="absolute top-0 right-0 w-[5cqw] h-[5cqw] border-[0.15cqw] border-black bg-white transform rotate-6 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] z-10 flex items-center justify-center hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/fish.jpg" alt="Spicy Fish" className="w-full h-full object-cover" />
              </div>

              {/* Selfie Headshot - New */}
              <div className="shrink min-h-0 relative w-auto max-h-[11cqw] aspect-square border-[0.3cqw] border-black bg-yellow-300 transform -rotate-1 shadow-[0.5cqw_0.5cqw_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto z-20 overflow-hidden mt-[1.5cqw] hover:scale-110 hover:rotate-0 hover:z-50 transition-all duration-300 group-hover:grayscale-0">
                <img src="/slide-assets/bio-selfie.jpg" alt="Pamimo" className="w-full h-full object-cover object-top" />
                <div className="absolute -top-[0.6cqw] left-1/2 -translate-x-1/2 bg-black text-white text-[0.6cqw] px-[0.4cqw] font-black transform -rotate-2">READY</div>
              </div>

              <div className="transform rotate-1 text-center relative z-20 bg-white border-[0.15cqw] border-black p-[0.8cqw] shadow-[0.4cqw_0.4cqw_0px_0px_rgba(0,0,0,1)] mb-[0.4cqw] shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200 mt-auto">
                <p className="text-[0.6cqw] font-black text-white bg-blue-600 inline-block px-[0.4cqw] py-[0.1cqw] border border-black mb-[0.2cqw]">TARGET</p>
                <div className="text-[2cqw] font-black text-black leading-none mt-[0.2cqw]">
                  CHINA<br /><span className="text-[1.5cqw] opacity-40">/</span><br />TAIWAN
                </div>
              </div>

              <div className="pt-[0.4cqw] border-t-[0.3cqw] border-black border-dotted relative z-20 bg-white p-[0.8cqw] transform -rotate-1 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] mb-[0.4cqw] shrink-0 hover:rotate-0 hover:scale-105 transition-all duration-200">
                <p className="text-[0.8cqw] text-blue-600 mb-[0.3cqw] font-black tracking-wider border-b border-blue-600 inline-block">GOALS</p>
                <ul className="text-[0.85cqw] font-bold uppercase leading-tight space-y-[0.3cqw]">
                  <li className="flex items-start"><span className="mr-[0.2cqw] text-blue-600">::</span> IMPROVE MANDARIN PROFICIENCY</li>
                  <li className="flex items-start"><span className="mr-[0.2cqw] text-blue-600">::</span> VISIT 2+ OTHER COUNTRIES</li>
                  <li className="flex items-start"><span className="mr-[0.2cqw] text-blue-600">::</span> STUDY WORK CULTURE (VS CANADA)</li>
                  <li className="flex items-start"><span className="mr-[0.2cqw] text-blue-600">::</span> EAT SPICY FOOD!!</li>
                </ul>
              </div>

              {/* Niagara Falls Image */}
              <div className="absolute bottom-[0.4cqw] right-[0.4cqw] w-[5cqw] h-[5cqw] border-[0.15cqw] border-black bg-[#87CEEB] transform rotate-3 shadow-[0.3cqw_0.3cqw_0px_0px_rgba(0,0,0,1)] flex items-center justify-center z-40 hover:scale-150 hover:rotate-0 hover:z-50 transition-all duration-300">
                <img src="/slide-assets/travel-falls.jpg" alt="Travel" className="w-full h-full object-cover" />
                <div className="absolute -top-[0.5cqw] -left-[0.5cqw] bg-black text-white text-[0.5cqw] px-[0.3cqw] font-black transform -rotate-3">NEXT</div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="shrink-0 border-t-[0.3cqw] border-black bg-black text-white p-[0.8cqw] flex justify-between items-center z-20 relative h-[8%]">
          <div className="flex items-center gap-[0.8cqw]">
            <span className="w-[0.8cqw] h-[0.8cqw] bg-[#00FF00] rounded-full shadow-[0_0_10px_#00FF00] animate-pulse"></span>
            <span className="font-bold tracking-widest text-[0.8cqw] uppercase">SYSTEM :: READY</span>
          </div>
          <div className="flex items-center gap-[0.8cqw] font-bold text-gray-500 tracking-widest text-[0.8cqw] uppercase font-mono">
            <img src="/favicon.ico" alt="Logo" className="w-[1.5cqw] h-[1.5cqw] opacity-80" />
            [ FELLOW_2026 ]
          </div>
        </footer>

      </div>
    </main>
  );
};

export default SlidePage;
