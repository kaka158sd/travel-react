// 退出登陆

import {
  removeAdminIdStorage,
  removeInheritorIdStorage,
  removeItineraryStorage,
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
  removeItineraryStorage();
  window.dispatchEvent(new Event('userStorageChange'));
}
