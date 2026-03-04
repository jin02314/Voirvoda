import { motion } from 'motion/react';

export function About() {
  return (
    <motion.div 
      className="flex-1 p-8 md:p-12 max-w-6xl mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left - Profile Image */}
        <div className="w-full lg:w-[45%] flex-shrink-0">
          <div className="w-full aspect-[4/5] bg-gray-200 rounded-lg flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-1/3 h-1/3 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="8" r="4" fill="currentColor"/>
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Right - Content */}
        <div className="flex-1">
          <h2 className="text-2xl mb-8">About</h2>

          <div className="space-y-1 text-gray-600 leading-relaxed text-sm">
            <p className="text-gray-900">
              <span className="text-3xl font-bold">황진영</span> <span className="text-xl font-bold">/ young</span>
            </p>
            <p>
              CEO
            </p>
            <p className="mt-6">
              경력
            </p>
            <p className="mt-3">
              <span className="inline-block w-12">2021</span> 제2회 SKT 우리동네 테레미전 우수상
            </p>
            <p>
              <span className="inline-block w-12">2021</span> 광주관광공사 영상공모전 장려상
            </p>
            <p>
              <span className="inline-block w-12">2022</span> KBS 광주전남 Z뉴스 제작 (22.04.~22.10.)
            </p>
            <p>
              <span className="inline-block w-12">2022</span> 버스킹 월드컵 촬영감독
            </p>
            
            <p className="mt-8">
              언제든 편하게 이메일 혹은 인스타그램 DM으로 프로젝트 문의 주세요!
            </p>
            <p className="mt-3">
              young@voirvoda.com
            </p>
            <p>
              Instagram: @voirvoda
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}