// 规划行程中的自定义项目全局数据

import { createSlice } from '@reduxjs/toolkit';

const customItemStore = createSlice({
  name: 'customItem',
  initialState: {
    customItem: [],
    loading: false,
  },
  reducers: {
    setCustomItem: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.customItem = action.payload;
      } else {
        state.customItem = [];
      }
    },
    setCustomLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const { setCustomItem, setCustomLoading } = customItemStore.actions;

const customItemReducer = customItemStore.reducer;

export { setCustomItem, setCustomLoading };

export default customItemReducer;
