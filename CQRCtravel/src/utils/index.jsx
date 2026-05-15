import { request } from './api/request';
import { rulesParse } from './rulesParse';
import { setNavActiveKey, getNavActiveKey } from './localStorage/navStorage';
import {
  getDetailOrderItems,
  getDetailActivityItems,
  getDetailNewItems,
  getDetailPeopleItems,
} from './detailDialog/detailDialog';
import { setTokenStorage, getToken, removeToken } from './localStorage/token';
import {
  setUserStorage,
  getUserStorage,
  removeUserStorage,
} from './localStorage/userStorage';
import { clearLocalStorage } from './logout';
import {
  setWalletStorage,
  getWalletStorage,
  removeWalletStorage,
} from './localStorage/wallet';
import {
  getTouristIdStorage,
  setTouristIdStorage,
  removeTouristIdStorage,
} from './localStorage/touristId';
import {
  setUserPrivacyData,
  getUserPrivacyData,
  removeUserPrivacyData,
} from './localStorage/userPrivacyData';
import { matchRelateActivities } from './matchRelateActivities';
import { isOrderExpired, isReserveFeasible } from './isExpired';

export {
  request,
  rulesParse,
  setNavActiveKey,
  getNavActiveKey,
  getDetailOrderItems,
  getDetailActivityItems,
  getDetailNewItems,
  getDetailPeopleItems,
  setTokenStorage,
  getToken,
  removeToken,
  setUserStorage,
  getUserStorage,
  removeUserStorage,
  clearLocalStorage,
  setWalletStorage,
  getWalletStorage,
  removeWalletStorage,
  getTouristIdStorage,
  setTouristIdStorage,
  removeTouristIdStorage,
  setUserPrivacyData,
  getUserPrivacyData,
  removeUserPrivacyData,
  matchRelateActivities,
  isOrderExpired,
  isReserveFeasible,
};
