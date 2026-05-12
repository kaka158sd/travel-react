// 封装和Token相关的方法

const TOKENKEY = 'token_key';

// 存
export function setTokenStorage(token) {
  localStorage.setItem(TOKENKEY, token);
}

// 取
export function getToken() {
  return localStorage.getItem(TOKENKEY);
}

// 删
export function removeToken() {
  localStorage.removeItem(TOKENKEY);
}
