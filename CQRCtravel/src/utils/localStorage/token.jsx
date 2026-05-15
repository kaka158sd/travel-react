// 封装和Token相关的方法

// 存
export function setTokenStorage(token) {
  localStorage.setItem('token_key', token);
}

// 取
export function getToken() {
  return localStorage.getItem('token_key');
}

// 删
export function removeToken() {
  localStorage.removeItem('token_key');
}
