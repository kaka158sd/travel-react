// 和用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit';
import { setTokenStorage, getToken } from '@/utils';

const userStore = createSlice({
  name: 'user',
  // 数据状态
  initialState: () => ({
    token: '',
  }),
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      // 在本地中存一份
      setTokenStorage(action.payload);
    },
  },
});

// 解构出actionCreater
const { setToken } = userStore.actions;

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

export { fetchLogin, setToken };

export default userReducer;
