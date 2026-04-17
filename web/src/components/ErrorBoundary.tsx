'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(`[ErrorBoundary:${this.props.componentName || 'Unknown'}]`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[400px] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              页面出现异常
            </h3>
            
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              {this.state.error?.message || '组件渲染时遇到了问题'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5
                  bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                  rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
              
              <Link href="/">
                <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5
                  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                  rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer">
                  <Home className="w-4 h-4" />
                  返回首页
                </span>
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer mb-2">
                  查看错误详情（开发模式）
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-left text-rose-600 dark:text-rose-400">
                  {this.state.error.stack.slice(0, 500)}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
