// 退出登陆

import {
  removeAdminIdStorage,
  removeInheritorIdStorage,
  removeSession,
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
  removeInheritorIdStorage();
  removeAdminIdStorage();
  removeSession('itineraryPlan');
  window.dispatchEvent(new Event('userStorageChange'));
}
