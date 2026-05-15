// 和用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit';
import {
  setTokenStorage,
  getToken,
  getUserStorage,
  setUserStorage,
  getTouristIdStorage,
  setTouristIdStorage,
  getUserPrivacyData,
  setUserPrivacyData as setPrivacy,
} from '@/utils';

const userStore = createSlice({
  name: 'user',
  // 数据状态
  initialState: () => ({
    token: getToken() || '',
    touristId: getTouristIdStorage() || '', // 游客ID（全局可用）
    currentUser: getUserStorage() || {},
    userPrivacyData: getUserPrivacyData() || {},
  }),
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      // 在本地中存一份
      setTokenStorage(action.payload);
    },
    setTouristId(state, action) {
      state.touristId = action.payload;
      setTouristIdStorage(action.payload);
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      // 在本地中存一份
      setUserStorage(action.payload);
    },
    setUserPrivacyData(state, action) {
      state.userPrivacyData = action.payload;
      setPrivacy(action.payload);
    },
    // 退出登陆
    clearUser(state) {
      ((state.token = ''),
        (state.touristId = ''),
        (state.currentUser = {}),
        (state.userPrivacyData = {}));
    },
  },
});

// 解构出actionCreater
const {
  setToken,
  setTouristId,
  setCurrentUser,
  setUserPrivacyData,
  clearUser,
} = userStore.actions;

// 获取reducer函数
const userReducer = userStore.reducer;

// 异步方法

// 完成登陆获取token
const fetchLogin = async (users, values) => {
  return new Promise((resolve, reject) => {
    // 模拟网络请求延迟
    const timer = setTimeout(() => {
      try {
        const { phone, password } = values;

        // 1. 查找用户
        const matchPhone = users.find((item) => item.phone === phone);

        if (!matchPhone) {
          reject(new Error('手机号未注册'));
          return;
        }

        // 2. 校验密码
        if (matchPhone.password !== password) {
          reject(new Error('密码输入错误，请重新输入'));
          return;
        }

        // 登陆成功，模拟生成Token
        const mockToken =
          'USER_TOKEN_' +
          Date.now() +
          '_' +
          Math.random().toString(36).substr(2);

        // 登录成功 → 返回用户信息
        // 返回：用户信息 + token
        const result = {
          user: matchPhone,
          token: mockToken,
        };

        resolve(result);
      } catch (err) {
        reject(err);
      }
    }, 300); // 模拟请求延迟

    return () => clearTimeout(timer);
  });
};

export {
  fetchLogin,
  setToken,
  setTouristId,
  setCurrentUser,
  setUserPrivacyData,
  clearUser,
};

export default userReducer;
