// 多个页面 / 模块都要持久化导航激活 key ,刷新页面后 key 保持不变

// 保存导航激活的 key (字符串 navKey——本地存储唯一标识；字符串或者数字 value——要保持的值)

export function setNavActiveKey(navKey, value) {
  try {
    localStorage.setItem('NAVSTORAGE' + navKey, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

// 获取本地持久化导航 key (任何类型 defaultValue——默认值)

export function getNavActiveKey(navKey, defaultValue) {
  try {
    const item = localStorage.getItem('NAVSTORAGE' + navKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(error);
    return defaultValue;
  }
}
