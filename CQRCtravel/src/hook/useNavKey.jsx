// 通用导航逻辑封装

import { getSession, setSession } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavKey(
  navItems,
  storageKey = 'dynamicNav',
  defaultNav = '',
) {
  const location = useLocation();
  const NAVKEY = 'NAVSTORAGE' + storageKey;

  // 路由匹配逻辑
  const matchRouteToNav = useCallback(
    (pathname, defaultNav) => {
      // 先匹配子菜单（三级/二级子页面）
      const allChildren = navItems.flatMap((item) => item.children || []);
      const exactChild = allChildren.find((child) => child.key === pathname);
      if (exactChild) return exactChild.key;

      // 匹配一级菜单
      const found = navItems.find((item) => item.key === pathname);
      if (found) return found.key;

      // 匹配父级路由
      const parent = navItems.find(
        (item) => pathname.startsWith(item.key + '/') || pathname === item.key,
      );
      if (parent) return parent.key;

      return defaultNav;
    },
    [navItems],
  );

  // 初始化状态：本地存储 > 路由匹配
  const [activeNav, setActiveNav] = useState(() => {
    const savedNav = getSession(NAVKEY, defaultNav);
    if (savedNav) return savedNav;
    return matchRouteToNav(location.pathname, defaultNav);
  });

  // 路由变化自动更新
  const timerRef = useRef(null);
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const newNav = matchRouteToNav(location.pathname, activeNav);
      setActiveNav(newNav);
    }, 0);

    return () => clearTimeout(timerRef.current);
  }, [location.pathname, activeNav, matchRouteToNav]);

  // 同步本地存储
  useEffect(() => {
    setSession(NAVKEY, activeNav);
  }, [activeNav, NAVKEY]);

  // 手动更新
  const updateActiveNav = (nav) => {
    setActiveNav(nav);
  };

  return {
    activeNav,
    updateActiveNav,
  };
}
