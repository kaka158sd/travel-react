// 退出登陆

import {
  removeToken,
  removeTouristIdStorage,
  removeUserPrivacyData,
  removeUserStorage,
  removeWalletStorage,
} from '.';

export function clearLocalStorage() {
  removeUserStorage();
  removeToken();
  removeWalletStorage();
  removeTouristIdStorage();
  removeUserPrivacyData();
  window.dispatchEvent(new Event('userStorageChange'));
}
