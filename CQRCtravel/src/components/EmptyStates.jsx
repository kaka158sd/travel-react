// EmptyStates.jsx - 统一管理空状态组件
import { Empty, Spin } from 'antd';

const stylesObject = {
  indicator: {
    color: '#d97706',
    margin: '300px 812px',
  },
};

// 1. 加载中组件
export const Loading = () => {
  const sharedProps = {
    spinning: true,
    percent: 0,
    classNames: 'my-40',
  };

  return <Spin {...sharedProps} size="large" styles={stylesObject} />;
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
