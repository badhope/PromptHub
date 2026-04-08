'use client';

import { memo } from 'react';

const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-shift" aria-hidden="true"></div>
      
      <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/40 to-blue-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/40 to-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-rose-500/35 to-orange-500/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-gradient-to-br from-violet-500/30 to-indigo-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-gradient-to-br from-amber-500/25 to-yellow-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="fixed inset-0 opacity-10" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.4%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%27)"
      }} aria-hidden="true"></div>

      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute top-20 left-10 w-12 h-12 text-cyan-400/20 animate-float gpu-accelerated" style={{ animationDelay: '0.5s' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <svg className="absolute top-40 right-20 w-16 h-16 text-purple-400/20 animate-float gpu-accelerated" style={{ animationDelay: '1.5s' }} fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
        <svg className="absolute bottom-40 left-20 w-14 h-14 text-rose-400/20 animate-float gpu-accelerated" style={{ animationDelay: '2.5s' }} fill="currentColor" viewBox="0 0 24 24">
          <polygon points="12,2 22,20 2,20" />
        </svg>
        <svg className="absolute bottom-20 right-40 w-10 h-10 text-emerald-400/20 animate-float gpu-accelerated" style={{ animationDelay: '3.5s' }} fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
        <svg className="absolute top-1/2 left-1/4 w-8 h-8 text-amber-400/20 animate-float gpu-accelerated" style={{ animationDelay: '4.5s' }} fill="currentColor" viewBox="0 0 24 24">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      </div>
    </>
  );
});

export default AnimatedBackground;
