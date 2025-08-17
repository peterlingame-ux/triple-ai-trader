import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class Brain3DErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Brain3D Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-sm border rounded-2xl shadow-2xl">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            AI大脑运算中心
          </h3>
          <p className="text-muted-foreground mb-4">3D渲染正在初始化...</p>
          
          {/* 静态动画效果 */}
          <div className="flex space-x-2 mb-4">
            <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>🔄 量子神经网络正在建立连接</p>
            <p className="mt-1">💫 AI思维矩阵加载中</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}