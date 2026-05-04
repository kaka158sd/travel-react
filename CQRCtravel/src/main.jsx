import { createRoot } from 'react-dom/client';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './variables.less';
import { Provider } from 'react-redux';
import store from './store';
import { ConfigProvider, App } from 'antd';
import { zhCN } from 'antd/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '@/assets/fonts/iconfont.css';
// 定义主题色
const THEME_COLOR = '#d97706';
const DEEP_COLOR = '#ce7106';
const LIGHT_COLOR = '#faeedd';
const SOFT_COLOR = 'rgb(255 247 237 / var(--tw-text-opacity, 1))';

// 全局设置 dayjs 语言
dayjs.locale('zh-cn');

createRoot(document.getElementById('root')).render(
  <App>
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Input: {
            activeBorderColor: THEME_COLOR, // 换成你的主题色
            hoverBorderColor: THEME_COLOR, // 同时修改 hover 态边框色，保持一致
            activeShadow: '0 0 0 2px rgba(217, 119, 6, 0.1)', // 修改激活态阴影，避免默认蓝色阴影
          },
          InputNumber: {
            activeBorderColor: THEME_COLOR,
            hoverBorderColor: THEME_COLOR,
            handleHoverColor: THEME_COLOR,
            activeShadow: '0 0 0 2px rgba(217, 119, 6, 0.1)',
          },
          Radio: {
            colorPrimary: THEME_COLOR,
            colorPrimaryActive: DEEP_COLOR,
            colorPrimaryBorder: LIGHT_COLOR,
            colorPrimaryHover: THEME_COLOR,
          },
          Checkbox: {
            colorPrimary: THEME_COLOR,
            colorPrimaryBorder: LIGHT_COLOR,
            colorPrimaryHover: THEME_COLOR,
          },

          Image: { colorPrimaryBorder: LIGHT_COLOR },
          Switch: {
            colorPrimary: THEME_COLOR,
            colorPrimaryBorder: LIGHT_COLOR,
            colorPrimaryHover: THEME_COLOR,
          },
          Select: {
            activeBorderColor: THEME_COLOR,
            activeOutlineColor: LIGHT_COLOR,
            hoverBorderColor: THEME_COLOR,
            optionSelectedBg: LIGHT_COLOR,
            colorPrimary: THEME_COLOR,
          },
          DatePicker: {
            activeBorderColor: THEME_COLOR,
            cellActiveWithRangeBg: LIGHT_COLOR,
            cellHoverWithRangeBg: LIGHT_COLOR,
            cellRangeBorderColor: LIGHT_COLOR,
            hoverBorderColor: THEME_COLOR,
            colorPrimary: THEME_COLOR,
            colorPrimaryBorder: LIGHT_COLOR,
            controlItemBgActive: LIGHT_COLOR,
          },
          Modal: {
            colorPrimaryBorder: LIGHT_COLOR,
          },
          Button: {
            defaultActiveBorderColor: DEEP_COLOR,
            defaultActiveColor: DEEP_COLOR,
            defaultHoverBorderColor: THEME_COLOR,
            defaultHoverColor: THEME_COLOR,
            colorLink: THEME_COLOR,
            colorPrimary: THEME_COLOR,
            colorPrimaryHover: THEME_COLOR,
            colorLinkActive: DEEP_COLOR,
            colorPrimaryActive: DEEP_COLOR,
            colorLinkHover: LIGHT_COLOR,
            colorPrimaryBgHover: LIGHT_COLOR,
            colorPrimaryBorder: LIGHT_COLOR,
            colorPrimaryBg: LIGHT_COLOR,
          },
          Descriptions: {
            colorSplit: THEME_COLOR,
            labelBg: SOFT_COLOR,
          },
          Splitter: {
            colorPrimary: THEME_COLOR,
            controlItemBgActiveHover: LIGHT_COLOR,
            controlItemBgActive: LIGHT_COLOR,
          },
          Form: {
            colorPrimary: THEME_COLOR,
            controlOutline: LIGHT_COLOR,
          },
        },
        token: {
          colorPrimary: THEME_COLOR,
        },
      }}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
    ,
  </App>,
);
