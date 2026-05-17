import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './index.less';
import '@/assets/fonts/iconfont.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import logo from '../../assets/logo.svg';
import {
  getNavActiveKey,
  getUserStorage,
  clearLocalStorage,
  setNavActiveKey,
} from '@/utils';
import { clearUser, defaultAvatar, setCurrentUser } from '@/store';
import { useDispatch, useSelector } from 'react-redux';

// 顶部导航列表
const tabs = [
  { path: '/', text: '首页' },
  { path: '/ancient-town', text: '古镇人文' },
  { path: '/intangible-cultural', text: '非遗体验' },
  { path: '/food-exploration', text: '美食探索' },
  { path: '/itinerary-planning', text: '行程规划' },
  { path: '/practical-tips', text: '实用贴士' },
  { path: '/center', text: '用户中心' },
];

// 提前创建图标元素
const UserIcon = (
  <i className="iconfont icon-user text-color1" style={{ fontSize: 16 }} />
);
const SettingIcon = (
  <i className="iconfont icon-guanli text-color1" style={{ fontSize: 16 }} />
);
const helpIcon = (
  <i className="iconfont icon-help text-color1" style={{ fontSize: 16 }} />
);
const LogoutIcon = (
  <i className="iconfont icon-shut-down text-color1" style={{ fontSize: 16 }} />
);

const Layout = () => {
  const dispatch = useDispatch();
  // 获取当前用户
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路由路径

  // 根据路由匹配导航文字（支持子路由）
  const matchRouteToText = useCallback((path, defaultText) => {
    // 精确匹配首页
    if (path === '/') return '首页';

    // 匹配用户中心子路由，有路径touristCenter的都是用户中心字段
    if (path.startsWith('/touristCenter')) return '用户中心';

    // 匹配其他导航字段
    const matchedTab = tabs.find((tab) => path === tab.path);
    if (matchedTab) return matchedTab.text;

    // 都不匹配，保持当前的text不改变
    return defaultText;
  }, []);

  const [text, setText] = useState(() => {
    // 1. 初始化 text：优先从 localStorage 读取 → 其次匹配路由 → 最后默认“首页”
    // 步骤1：读取本地存储的 text
    const savedText = getNavActiveKey('homeNav', '首页');
    if (savedText) return savedText;

    // 步骤2：无存储则匹配当前路由路径
    return matchRouteToText(location.pathname, '首页');
  });

  // 用 ref 存储定时器 ID，确保能跨渲染周期访问
  const timerRef = useRef(null);
  // 监听路由，但只根据路径更新，不依赖 text，不会覆盖手动设置
  useEffect(() => {
    // 第一步：先清除上一次的定时器（避免重复创建）
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 第二步：创建新定时器，并存入 ref
    timerRef.current = setTimeout(() => {
      const newText = matchRouteToText(location.pathname, text);
      setText(newText);
    }, 0);

    // 第三步：组件卸载/依赖变化时，清除定时器
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [location.pathname, matchRouteToText, text]); // 依赖数组保留 location.pathname + text

  // 同步本地存储
  useEffect(() => {
    if (text) setNavActiveKey('homeNav', text);
  }, [text]);

  // 点击顶部导航事件
  const handleTabChange = (tab) => {
    setText(tab.text);
    navigate(tab.path);
  };

  // 监听 localStorage 变化，实现同步更新
  useEffect(() => {
    const handleStorageChange = () => {
      const user = getUserStorage() || null;
      dispatch(setCurrentUser(user));
    };

    // 监听 storage 事件（跨标签页也会触发）
    window.addEventListener('storage', handleStorageChange);

    // 监听自定义事件（用于当前页面内的更新）
    window.addEventListener('userStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStorageChange', handleStorageChange);
    };
  }, [dispatch]);

  // 退出登陆
  const logout = useCallback(() => {
    dispatch(clearUser());
    clearLocalStorage();
    navigate('/');
  }, [dispatch, navigate]);

  // 用户登陆后悬停在顶部栏的头像显示的下拉菜单
  const userItems = useMemo(() => {
    // 用户未登录，不应该执行这里的逻辑，所以先判断
    if (!currentUser) return [];

    //  根据身份类型返回不同菜单
    switch (currentUser.identity_type) {
      case 1:
        return [
          {
            key: 'touristCenter',
            label: '个人中心',
            icon: UserIcon,
            onClick: () => navigate('/touristCenter'),
          },
          {
            key: 'setting',
            label: '设置',
            icon: SettingIcon,
            onClick: () => navigate('/touristCenter/setting'),
          },
          {
            key: 'helpCenter',
            label: '帮助中心',
            icon: helpIcon,
            onClick: () => navigate('/touristCenter/helpCenter'),
          },
          {
            key: 'logout',
            label: '退出登录',
            icon: LogoutIcon,
            onClick: () => logout(),
          },
        ];
      case 2:
        return [
          {
            key: 'inheritorCenter',
            label: '个人中心',
            icon: UserIcon,
            onClick: () => navigate('/inheritorCenter'),
          },
          {
            key: 'logout',
            label: '退出登录',
            icon: LogoutIcon,
            onClick: () => logout(),
          },
        ];
      case 3:
        return [
          {
            key: 'adminCenter',
            label: '个人中心',
            icon: UserIcon,
            onClick: () => navigate('/adminCenter'),
          },
          {
            key: 'logout',
            label: '退出登录',
            icon: LogoutIcon,
            onClick: () => logout(),
          },
        ];
      default:
        return [];
    }
  }, [currentUser, navigate, logout]);

  return (
    <div>
      {/* 顶部导航 */}
      <header className="bg-white flex border-b-2 border-slate-200 justify-between items-center px-12 fixed z-50 top-0 left-0 w-full">
        <img
          src={logo}
          title="荣昌深度游"
          className="w-20 h-20 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <div className="flex">
          {tabs.slice(0, 6).map((item) => (
            <div
              key={item.text}
              className={`nav-items cursor-pointer ${text === item.text ? 'active' : ''}`}
              onClick={() => handleTabChange(item)}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="w-24 h-10 ">
          {currentUser ? (
            <Dropdown menu={{ items: userItems }}>
              <div className="cursor-pointer">
                <Avatar
                  src={currentUser?.avatar || defaultAvatar}
                  size={50}
                  icon={<UserOutlined />}
                />
              </div>
            </Dropdown>
          ) : (
            <button className="btn1" onClick={() => navigate('/login')}>
              <i className="iconfont icon-user1 mr-2 text-2xl"></i>
              登陆
            </button>
          )}
        </div>
      </header>

      {/* 二级路由出口 */}
      <div className="mt-20.5">
        <Outlet />
      </div>

      {/* 底部栏:登陆后不显示 */}
      {text !== '用户中心' && (
        <footer className="footer">
          <div className="footer-container">
            {/* 第一栏：品牌介绍 */}
            <div className="footer-col brand-col">
              <div className="brand-header">
                <span className="brand-icon">
                  <img src="./logo.svg" />
                </span>
                <h3>荣昌深度游</h3>
              </div>
              <p className="brand-desc">
                荣昌，一座历史悠久、文化底蕴深厚的城市，以其独特的非遗文化、美食文化和自然风光，成为重庆旅游的新亮点。
              </p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="iconfont icon-wechat-fill"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="iconfont icon-alipay"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="iconfont icon-taobao"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="iconfont icon-QQ"></i>
                </a>
              </div>
            </div>

            {/* 第二栏：快速链接 */}
            <div className="footer-col">
              <h4>快速链接</h4>
              <ul className="link-list">
                <li>
                  <a href="/">首页</a>
                </li>
                <li>
                  <a href="ancient-town">古镇人文</a>
                </li>
                <li>
                  <a href="intangible-cultural">非遗体验</a>
                </li>
                <li>
                  <a href="food-exploration">美食探索</a>
                </li>
                <li>
                  <a href="itinerary-planning">行程规划</a>
                </li>
                <li>
                  <a href="practical-tips">实用贴士</a>
                </li>
              </ul>
            </div>

            {/* 第三栏：联系我们 */}
            <div className="footer-col contact">
              <h4>联系我们</h4>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon">
                    <i className="iconfont icon-ditu-dibiao"></i>
                  </span>
                  <span>重庆市荣昌区昌元街道广场路1号</span>
                </li>
                <li>
                  <span className="contact-icon">
                    <i className="iconfont icon-customer-service"></i>
                  </span>
                  <span>023-46732666</span>
                </li>
                <li>
                  <span className="contact-icon">
                    <i className="iconfont icon-mail"></i>
                  </span>
                  <span>tourism@rongchang.gov.cn</span>
                </li>
              </ul>
              <p className="work-time">工作时间：周一至周五 9:00-17:30</p>
            </div>

            {/* 第四栏：订阅资讯 */}
            <div className="footer-col subscribe-col">
              <h4>订阅资讯</h4>
              <p className="subscribe-desc">
                订阅我们的旅游资讯，及时获取最新活动信息和旅游攻略
              </p>
              <input
                type="email"
                placeholder="请输入您的邮箱"
                className="subscribe-input"
              />
              <button className="subscribe-btn">订阅</button>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="copyright">
            <p>© 2025 重庆荣昌深度游指南. 版权所有</p>
            <div className="copyright-links">
              <a href="#">隐私政策</a>
              <span>|</span>
              <a href="#">使用条款</a>
              <span>|</span>
              <a href="#">网站地图</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
