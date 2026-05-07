// 进入页面 是第一次 / 从外部其他路由跳转进来 → 强制用第一个导航，不读本地存储
// 在页面 内部切换 Tab → 才读取本地、持久化保存
// basePath——页面根路径；defaultValue——默认值；navKey - 本地存储 key的字段

import { getNavActiveKey, setNavActiveKey } from '@/utils';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useFirstEnterNav(basePath, defaultValue, navKey) {
  const location = useLocation();
  const initialRenderRef = useRef(true); // 标记是否首次渲染
  const lastPathRef = useRef(location.pathname); // 记录上一次路径

  // 初始化：永远优先读本地（刷新能保留）
  const [activeKey, setActiveKey] = useState(() => {
    return getNavActiveKey(navKey, defaultValue);
  });

  // 只有从其他路由跳转过来时才重置，刷新不重置
  useEffect(() => {
    let timer = [];
    // 第一次加载 = 刷新 → 不做任何事
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      lastPathRef.current = location.pathname;
      return;
    }

    const currentPath = location.pathname;
    const lastPath = lastPathRef.current;

    // 判断：是否从【外部页面】跳转到当前模块
    const isFromOutside =
      !lastPath.startsWith(basePath) && currentPath.startsWith(basePath);

    // 路由变化 + 进入了当前模块 = 从外部跳转
    if (isFromOutside) {
      timer = setTimeout(() => {
        setActiveKey(defaultValue);
        setNavActiveKey(navKey, defaultValue);
      }, 0);
    }

    // 更新上一次路径
    lastPathRef.current = currentPath;

    return () => clearTimeout(timer);
  }, [defaultValue, navKey, basePath, location.pathname]);

  // 同步本地存储
  const setKeyStorage = (nav) => {
    setActiveKey(nav);
    setNavActiveKey(navKey, nav);
  };

  return [activeKey, setKeyStorage];
}
