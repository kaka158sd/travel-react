// 组合redux的子模块 + 导出store实例

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './modules/user';
import {
  inheritLevelTagsConfig,
  heritageLevelOptions,
} from './commonList/inheritor';
import { statusStyle, orderLabel } from './commonList/order';
import { spotStarOptions, openStatusOptions } from './commonList/scenicSpot';
import { newLabel } from './commonList/new';
import { identity } from './commonList/user';
import { defaultAvatar } from './commonData/user';

export default configureStore({
  reducer: {
    user: userReducer,
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
};
