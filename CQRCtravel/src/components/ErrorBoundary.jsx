import React from 'react';
import { Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 捕获渲染异常，更新 state
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // 打印错误日志
  componentDidCatch(error, errorInfo) {
    console.error('组件渲染异常捕获：', error, errorInfo);
    // 可在此接入埋点上报
  }

  // 刷新重置页面
  handleReset = () => {
    this.setState({ hasError: false });
    // 可选：刷新页面 / 重置路由
    // window.location.reload();
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    // 外部传入自定义错误兜底组件，优先使用
    if (hasError) {
      if (fallback) return fallback;
      // 默认兜底UI
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h3>页面加载出错了</h3>
          <p style={{ color: '#999' }}>当前组件发生渲染异常，请重试</p>
          <Button
            type="primary"
            onClick={this.handleReset}
            style={{ marginTop: 16 }}
          >
            重新加载
          </Button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
