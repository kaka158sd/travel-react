// EmptyStates.jsx - 统一管理空状态组件
import { Empty, Spin, Skeleton } from 'antd';

const stylesObject = {
  indicator: {
    color: '#d97706',
  },
};

// 1. 加载中组件
export const Loading = ({
  tip = '加载中...',
  size = 'large',
  className = 'my-40',
}) => {
  return (
    <div
      className={`w-full flex ${size === 'small' ? 'justify-end' : 'justify-center items-center'} min-h-120`}
    >
      <Spin
        spinning={true}
        size={size}
        styles={stylesObject}
        className={className}
        description={tip}
      />
    </div>
  );
};

// 2. 无数据组件
export const NoData = ({ width }) => {
  return (
    <Empty description="暂无数据" className={`${width ? width : 'my-75'}`} />
  );
};

// 3. 加载失败组件
export const LoadError = () => {
  return (
    <div className="text-center my-80">
      <i
        className="iconfont icon-error text-orange-600"
        style={{ fontSize: '60px' }}
      />
      <p className="text-lg" style={{ marginTop: 16, color: '#ff4d4f' }}>
        数据加载失败
      </p>
    </div>
  );
};

// 骨架屏加载组件
export const LoadingSkeleton = () => {
  return (
    <div className="p-30 ">
      <Skeleton active className="py-10" />
      <Skeleton active className="py-10 mb-20" />
    </div>
  );
};
