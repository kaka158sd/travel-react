// 封装临时存储关闭页面标签即清空的存储方式

// 存储
export const setSession = (key, value) => {
  if (typeof value === 'object') {
    sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    sessionStorage.setItem(key, value);
  }
};

// 获取
export const getSession = (key) => {
  const val = sessionStorage.getItem(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

// 删除单个
export const removeSession = (key) => {
  sessionStorage.removeItem(key);
};

// 清空所有
export const clearSession = () => {
  sessionStorage.clear();
};
