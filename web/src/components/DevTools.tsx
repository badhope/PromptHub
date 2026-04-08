'use client';

import { useState, useEffect } from 'react';
import { usePerformanceMonitor, useErrorTracking, useDeviceDetect, useMemoryMonitor } from '@/hooks/useMonitoring';

interface DevToolsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DevTools({ isOpen = false, onClose }: DevToolsProps) {
  const [open, setOpen] = useState(isOpen);
  const [activeTab, setActiveTab] = useState<'performance' | 'errors' | 'device' | 'memory'>('performance');
  
  const { getMetrics, reportMetrics } = usePerformanceMonitor();
  const { getErrors, clearErrors, reportErrors } = useErrorTracking();
  const deviceInfo = useDeviceDetect();
  const memoryInfo = useMemoryMonitor();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="打开开发者工具"
      >
        🔧 DevTools
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">🔧 开发者工具</h2>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: 'performance', label: '性能', icon: '📊' },
            { id: 'errors', label: '错误', icon: '🐛' },
            { id: 'device', label: '设备', icon: '💻' },
            { id: 'memory', label: '内存', icon: '💾' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'performance' | 'errors' | 'device' | 'memory')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">性能指标</h3>
                <button
                  onClick={reportMetrics}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  刷新
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'FCP (首次内容绘制)', key: 'fcp', unit: 'ms' },
                  { label: 'LCP (最大内容绘制)', key: 'lcp', unit: 'ms' },
                  { label: 'FID (首次输入延迟)', key: 'fid', unit: 'ms' },
                  { label: 'CLS (累积布局偏移)', key: 'cls', unit: '' },
                  { label: 'TTFB (首字节时间)', key: 'ttfb', unit: 'ms' }
                ].map((metric) => {
                  const metrics = getMetrics();
                  const value = metrics[metric.key as keyof PerformanceMetrics];
                  
                  return (
                    <div key={metric.key} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">{metric.label}</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {value !== undefined ? value.toFixed(2) : '-'}
                        {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">错误追踪</h3>
                <div className="flex gap-2">
                  <button
                    onClick={reportErrors}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    刷新
                  </button>
                  <button
                    onClick={clearErrors}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    清除
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {getErrors().length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    暂无错误记录
                  </div>
                ) : (
                  getErrors().map((error, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="font-semibold text-red-800">{error.message}</div>
                      {error.filename && (
                        <div className="text-sm text-red-600 mt-1">
                          {error.filename}:{error.lineno}:{error.colno}
                        </div>
                      )}
                      {error.stack && (
                        <pre className="text-xs text-red-600 mt-2 overflow-auto">
                          {error.stack}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'device' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">设备信息</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '设备类型', value: deviceInfo.isMobile ? '移动设备' : deviceInfo.isTablet ? '平板' : '桌面设备' },
                  { label: '操作系统', value: deviceInfo.os },
                  { label: '浏览器', value: deviceInfo.browser },
                  { label: '触摸支持', value: deviceInfo.isTouch ? '支持' : '不支持' }
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">{item.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">内存使用</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '已使用', value: memoryInfo.usedMB },
                  { label: '总分配', value: memoryInfo.totalMB },
                  { label: '限制', value: memoryInfo.limitMB },
                  { label: '使用率', value: `${memoryInfo.usagePercent}%` }
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">{item.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">内存使用情况</div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${memoryInfo.usagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}
