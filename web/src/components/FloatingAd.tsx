'use client';

import { useState, useEffect } from 'react';

export default function FloatingAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const lastClosed = localStorage.getItem('whiteLeftFloatAd_7day');
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (!lastClosed || Date.now() - parseInt(lastClosed) > sevenDays) {
        setIsVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('whiteLeftFloatAd_7day', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-[15px] bottom-[40px] z-[998] md:left-[15px] md:bottom-[40px] max-md:left-[10px] max-md:bottom-[25px]">
      <div
        className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center cursor-pointer border border-gray-200 shadow-lg hover:scale-105 transition-transform duration-300"
        onMouseEnter={() => setIsExpanded(true)}
      >
        <span className="text-[13px] text-gray-600 font-medium">广告</span>
      </div>

      {isExpanded && (
        <div 
          className="absolute left-[60px] bottom-0 w-[260px] max-md:w-[220px] max-md:left-[55px] bg-white rounded-[14px] border border-gray-100 shadow-xl p-[22px_18px] transition-all duration-400 ease-out"
          style={{
            animation: 'fadeIn 0.4s ease-out'
          }}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <button
            onClick={handleClose}
            className="absolute top-[12px] right-[12px] w-[20px] h-[20px] bg-gray-100 rounded-full border-none text-gray-400 text-[14px] cursor-pointer hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
            aria-label="关闭广告"
          >
            ×
          </button>
          
          <div className="text-[12px] text-gray-400 mb-[10px]">
            Advertisement · 广告位招租
          </div>
          
          <h3 className="text-[17px] text-gray-800 font-semibold mb-[10px]">
            全站优质广告空位
          </h3>
          
          <p className="text-[13px] text-gray-600 leading-[1.6] mb-[16px]">
            高流量精准曝光<br />
            PC/移动端全站适配<br />
            长期招商 合作共赢
          </p>
          
          <a
            href="tel:18825407105"
            className="block text-center py-[8px] bg-gray-100 text-gray-700 no-underline rounded-[8px] text-[14px] border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
          >
            点击咨询合作
          </a>
          
          <p className="mt-[14px] text-[12px] text-gray-400 text-center">
            微信/电话：188-2540-7105
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
