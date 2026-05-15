// 与不同身份的特殊身份数据有关的方法

// 存
export function setUserPrivacyData(data) {
  localStorage.setItem('userPrivacyData', JSON.stringify(data));
}

// 取
export function getUserPrivacyData() {
  const data = localStorage.getItem('userPrivacyData');
  return data ? JSON.parse(data) : {};
}

// 删
export function removeUserPrivacyData() {
  localStorage.removeItem('userPrivacyData');
}
