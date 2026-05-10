// 和用户相关的状态管理
import { request } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const userStore = createSlice({
  name: 'user',
  // 数据状态
  initialState: {
    token: '',
  },
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

// 解构出actionCreater
const { setToken } = userStore.actions;

// 获取reducer函数
const userReducer = userStore.reducer;

// 异步方法
// const dispatch = useDispatch()

// 完成登陆获取token
// const fetchLogin = (loginForm) => {
//   return async () => {
//     // 发送异步请求
//     const res = await request.post('', loginForm);

//     // 提交同步action进行token的存入
//     // dispatch(setToken(res.data.token))
//   };
// };

export { setToken };

export default userReducer;
