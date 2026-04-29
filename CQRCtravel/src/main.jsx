import { createRoot } from 'react-dom/client';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import '@/assets/fonts/iconfont.css';

createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ConfigProvider>,
);
