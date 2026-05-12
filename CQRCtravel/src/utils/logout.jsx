// 退出登陆

import { removeToken, removeUserStorage } from '.';

export function logout() {
  removeUserStorage();
  removeToken();
  window.dispatchEvent(new Event('userStorageChange'));
}
