// 设置cookie  days 天数
// 未统一导出

export const setCookie = (key, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
};

// 获取cookie
export const getCookie = (key) => {
  const arr = document.cookie.split('; ');
  for (let item of arr) {
    const [k, v] = item.split('=');
    if (k === key) return decodeURIComponent(v);
  }
  return '';
};

// 删除cookie
export const removeCookie = (key) => {
  document.cookie = `${key}=;expires=0;path=/`;
};
