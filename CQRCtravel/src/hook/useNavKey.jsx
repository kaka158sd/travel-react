// 通用导航逻辑封装

import { getNavActiveKey, setNavActiveKey } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavKey(
  navItems,
  storageKey = 'dynamicNav',
  defaultNav = '',
) {
  const location = useLocation();

  // 路由匹配逻辑
  const matchRouteToNav = useCallback(
    (pathname, defaultNav) => {
      // 精确匹配
      const found = navItems.find((item) => item.key === pathname);
      if (found) return found.key;

      // 子路由匹配
      const parent = navItems.find(
        (item) => pathname.startsWith(item.key + '/') || pathname === item.key,
      );
      if (parent) return parent.key;

      // 匹配子菜单（spotAdd / spotList）
      const childItem = navItems
        .flatMap((item) => item.children || [])
        .find(
          (child) => child.key === pathname || pathname.startsWith(child.key),
        );
      if (childItem) return childItem.key;

      return defaultNav;
    },
    [navItems],
  );

  // 初始化状态：本地存储 > 路由匹配
  const [activeNav, setActiveNav] = useState(() => {
    const savedNav = getNavActiveKey(storageKey, defaultNav);
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
    setNavActiveKey(storageKey, activeNav);
  }, [activeNav, storageKey]);

  // 手动更新
  const updateActiveNav = (nav) => {
    setActiveNav(nav);
  };

  return {
    activeNav,
    updateActiveNav,
  };
}
