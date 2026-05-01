'use client';

import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import Balancer from 'react-wrap-balancer';
import { showCopyToast } from '@/shared/components/ToastProvider';

interface ActivationCommandProps {
  command: string;
  title?: string;
}

export default function ActivationCommand({ command, title = '激活指令' }: ActivationCommandProps) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const extractFirstCommand = (text: string): string => {
    const firstLine = text.split('\n').find(line => line.trim().length > 0);
    if (firstLine) {
      const cleaned = firstLine
        .replace(/^[#\s>]+/, '')
        .replace(/[*`\[\]]/g, '')
        .trim();
      return cleaned.length > 8 ? cleaned : cleaned + '...';
    }
    return '点击复制完整指令';
  };

  const displayText = extractFirstCommand(command);

  const handleCopy = async () => {
    const success = await copy(command);
    if (success) {
      setCopied(true);
      showCopyToast('指令已复制');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group">
      <button
        onClick={handleCopy}
        className="w-full relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition-all duration-300 hover:border-gray-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                copied 
                  ? 'bg-green-100' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                {copied ? (
                  <CopyCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <span className={`text-sm font-semibold transition-colors ${
                copied ? 'text-green-600' : 'text-gray-700'
              }`}>
                {copied ? '已复制!' : title}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }`}>
              {copied ? '✓' : '点击复制'}
            </div>
          </div>
          
          <div className="pl-10">
            <p className="text-gray-900 font-medium leading-relaxed">
              <Balancer>
                {displayText}
              </Balancer>
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
