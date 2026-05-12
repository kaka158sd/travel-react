import { request } from './request';
import { rulesParse } from './rulesParse';
import { setNavActiveKey, getNavActiveKey } from './navStorage';
import {
  getDetailOrderItems,
  getDetailActivityItems,
  getDetailNewItems,
  getDetailPeopleItems,
} from './detailDialog/detailDialog';
import { setTokenStorage, getToken, removeToken } from './token';
import {
  setUserStorage,
  getUserStorage,
  removeUserStorage,
} from './userStorage';
import { logout } from './logout';
import {
  setWalletStorage,
  getWalletStorage,
  removeWalletStorage,
} from './wallet';

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
  logout,
  setWalletStorage,
  getWalletStorage,
  removeWalletStorage,
};
