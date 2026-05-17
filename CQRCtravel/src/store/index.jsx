// 组合redux的子模块 + 导出store实例

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './modules/user';
import {
  inheritLevelTagsConfig,
  heritageLevelOptions,
} from './commonList/inheritor';
import { statusStyle, orderLabel } from './commonList/order';
import {
  spotStarOptions,
  openStatusOptions,
  tagsColor,
} from './commonList/scenicSpot';
import { newLabel } from './commonList/new';
import { identity } from './commonList/user';
import { defaultAvatar } from './commonData/user';
import {
  fetchLogin,
  setToken,
  setTouristId,
  setCurrentUser,
  setUserPrivacyData,
  clearUser,
} from './modules/user';
import favoriteReducer from './modules/favorites';
import { setFavoritesList, setLoading } from './modules/favorites';
import walletReducer from './modules/wallet';
import { setWallet } from './modules/wallet';
import customItemReducer from './modules/customItem';
import { setCustomItem, setCustomLoading } from './modules/customItem';

export default configureStore({
  reducer: {
    user: userReducer,
    favorite: favoriteReducer,
    wallet: walletReducer,
    customItem: customItemReducer,
  },
});

export {
  inheritLevelTagsConfig,
  statusStyle,
  orderLabel,
  heritageLevelOptions,
  spotStarOptions,
  openStatusOptions,
  newLabel,
  identity,
  defaultAvatar,
  fetchLogin,
  setToken,
  setTouristId,
  setCurrentUser,
  setUserPrivacyData,
  clearUser,
  setFavoritesList,
  setLoading,
  tagsColor,
  setWallet,
  setCustomItem,
  setCustomLoading,
};
