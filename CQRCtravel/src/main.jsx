import { createRoot } from 'react-dom/client';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './variables.less';
import { Provider } from 'react-redux';
import store from './store';
import { ConfigProvider, App } from 'antd';
import { zhCN } from 'antd/locale/zh_CN';
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
            colorPrimaryActive: DEEP_COLOR,
            colorPrimaryHover: THEME_COLOR,
          },
          Checkbox: {
            colorPrimaryHover: THEME_COLOR,
          },
          Select: {
            activeBorderColor: THEME_COLOR,
            activeOutlineColor: LIGHT_COLOR,
            hoverBorderColor: THEME_COLOR,
            optionSelectedBg: LIGHT_COLOR,
          },
          DatePicker: {
            activeBorderColor: THEME_COLOR,
            cellActiveWithRangeBg: LIGHT_COLOR,
            cellHoverWithRangeBg: LIGHT_COLOR,
            cellRangeBorderColor: LIGHT_COLOR,
            hoverBorderColor: THEME_COLOR,
          },
          Button: {
            defaultActiveBorderColor: DEEP_COLOR,
            defaultActiveColor: DEEP_COLOR,
            defaultHoverBorderColor: THEME_COLOR,
            defaultHoverColor: THEME_COLOR,
            colorLink: THEME_COLOR,
            colorPrimaryHover: THEME_COLOR,
            colorLinkActive: DEEP_COLOR,
            colorPrimaryActive: DEEP_COLOR,
            colorLinkHover: LIGHT_COLOR,
            colorPrimaryBgHover: LIGHT_COLOR,
            colorPrimaryBg: LIGHT_COLOR,
          },
          Descriptions: {
            colorSplit: THEME_COLOR,
            labelBg: SOFT_COLOR,
          },
          Splitter: {
            controlItemBgActiveHover: LIGHT_COLOR,
            controlItemBgActive: LIGHT_COLOR,
          },
          Form: {
            controlOutline: LIGHT_COLOR,
          },
          // THEME_COLOR  DEEP_COLOR  LIGHT_COLOR  SOFT_COLOR
          Table: {
            borderColor: 'rgb(209 213 219 / var(--tw-text-opacity, 1))',
            cellFontSize: 15,
            headerBg: SOFT_COLOR,
            rowHoverBg: '#fffdfa',
          },
          Tooltip: {
            colorBgSpotlight: '#fff',
            colorTextLightSolid: '#000',
          },
          Collapse: {
            headerBg: '#fff',
          },
        },
        token: {
          colorPrimary: THEME_COLOR,
          colorPrimaryBorder: SOFT_COLOR,
          controlItemBgActive: SOFT_COLOR,
          controlItemBgActiveHover: LIGHT_COLOR,
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
