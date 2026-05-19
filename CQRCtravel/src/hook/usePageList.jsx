// 与搜索筛选和分页有关的函数

import { useMemo, useState } from 'react';

export function usePageList(data = [], pageSize = 10, searchKeys = []) {
  // 搜索关键词
  const [searchText, setSearchText] = useState('');
  // 筛选条件：只存 一个字段名 + 一个值
  const [filter, setFilter] = useState({
    key: '', // 要筛选的字段名
    values: [], // 筛选的值
  });
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);

  // 先过滤：搜索(字段名+字段值)+精确筛选
  const allFilterData = useMemo(() => {
    return data.filter((item) => {
      // 搜索逻辑：匹配字段名+字段值
      const lowerSearch = searchText.trim().toLowerCase();
      // 空搜索直接返回搜索检验
      let isMatchSearch = true;
      // 遍历制定搜索字段
      if (lowerSearch) {
        isMatchSearch = false;
        for (const key of searchKeys) {
          // 匹配字段值
          const fieldVal = String(item[key] || '')
            .trim()
            .toLowerCase();
          if (fieldVal.includes(lowerSearch)) {
            isMatchSearch = true;
            break;
          }
        }
      }
      // 搜索不匹配直接剔除
      if (!isMatchSearch) return false;

      // 筛选逻辑：匹配字段
      let isMatchFilter = true;
      const { key, values } = filter;

      // 有筛选才执行
      if (key && values.length > 0) {
        // 只要字段值 在 values 数组里，就保留
        isMatchFilter = values.includes(item[key]);
      }
      // console.log('filter', filter);
      // console.log('item[key]', item[key]);

      // 同时满足搜索和筛选才保留数据
      return isMatchSearch && isMatchFilter;
    });
  }, [data, searchKeys, searchText, filter]);

  // 分页计算
  const total = allFilterData.length;
  const totalPage = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  // 当前页数据
  const currentData = useMemo(() => {
    return allFilterData.slice(start, end);
  }, [allFilterData, start, end]);

  // 搜索时自动回到第 1 页
  const handleSearch = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  // 设置筛选条件，自动重置页码
  const changeFilter = (key, values) => {
    setFilter({ key, values });
    setCurrentPage(1);
  };

  // 清空所有筛选
  const clearFilter = () => {
    setFilter({ key: '', values: [] });
    setCurrentPage(1);
  };

  return {
    searchText, //搜索词
    currentPage, //当前页面
    currentData, //当前页码数据
    total, //过滤后的总数据
    totalPage, //过滤后的总页码数
    filter, //包含筛选字段的对象
    setSearchText: handleSearch,
    setCurrentPage,
    changeFilter,
    clearFilter,
  };
}
