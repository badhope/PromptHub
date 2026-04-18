'use client';

import { useState } from 'react';
import { Copy, CopyCheck, ExternalLink, Sparkles } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import { showCopyToast, showToast } from './ToastProvider';

interface MobileActivationButtonProps {
  command: string;
  skillName?: string;
  rawUrl?: string;
  darkMode?: boolean;
}

const vibrate = (pattern: number | number[] = 25) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (_e) {
    }
  }
};

const isMobile = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default function MobileActivationButton({ 
  command, 
  skillName = '技能',
  rawUrl,
  darkMode = false
}: MobileActivationButtonProps) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();
  const [isMobileDevice] = useState(() => isMobile());

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    vibrate([15, 30, 15]);
    
    const success = await copy(command);
    if (success) {
      setCopied(true);
      showCopyToast(skillName);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyAndOpen = async () => {
    vibrate([20, 50, 20]);
    
    const success = await copy(command);
    if (success) {
      setCopied(true);
      showToast({
        type: 'success',
        message: `${skillName} 已复制，正在打开 ChatGPT...`,
        duration: 2500
      });
      
      setTimeout(() => {
        window.open('https://chat.openai.com', '_blank');
      }, 300);
      
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const activationCommand = rawUrl 
    ? `请读取以下技能文件并完整激活：\n${rawUrl}`
    : command;

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopy}
          className={`flex-1 relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 focus-visible:outline-none active:scale-[0.98] touch-manipulation min-h-[72px] ${
            copied 
              ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
              : darkMode
                ? 'bg-white text-black shadow-lg hover:bg-gray-100 hover:shadow-xl'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 hover:from-blue-600 hover:to-blue-700 focus-visible:ring-4 focus-visible:ring-blue-300'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                copied 
                  ? 'bg-white/20' 
                  : darkMode ? 'bg-gray-100' : 'bg-white/20'
              }`}>
                {copied ? (
                  <CopyCheck className="w-6 h-6" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="font-bold text-base leading-tight">
                  {copied ? '✓ 复制成功!' : '复制激活指令'}
                </div>
                <div className="text-sm opacity-80">
                  {copied ? '已准备好粘贴' : '点击即可复制到剪贴板'}
                </div>
              </div>
            </div>
            
            <Sparkles className={`w-6 h-6 opacity-60 flex-shrink-0 ${
              copied ? 'animate-pulse' : ''
            }`} />
          </div>
        </button>

        {isMobileDevice && (
          <button
            onClick={handleCopyAndOpen}
            className={`sm:w-auto w-full relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 shadow-lg active:scale-[0.98] touch-manipulation min-h-[72px] ${
              darkMode
                ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-200 hover:from-emerald-600 hover:to-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
            
            <div className="relative z-10 flex items-center justify-center sm:justify-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                darkMode ? 'bg-gray-800' : 'bg-white/20'
              }`}>
                <ExternalLink className="w-6 h-6" />
              </div>
              <div className="sm:block hidden">
                <div className="font-bold text-base leading-tight">
                  一键激活
                </div>
                <div className="text-sm opacity-80">
                  复制并打开 ChatGPT
                </div>
              </div>
              <div className="sm:hidden">
                <div className="font-bold text-base">
                  跳转激活
                </div>
              </div>
            </div>
          </button>
        )}
      </div>

      {rawUrl && (
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">💡 推荐激活方式</div>
          <div className="bg-gray-900 rounded-lg p-3 text-gray-100 text-xs font-mono overflow-x-auto">
            <code className="whitespace-pre-wrap break-all">
              请读取技能文件并完整激活：{rawUrl}
            </code>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
