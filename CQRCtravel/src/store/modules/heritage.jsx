// 非遗列表的全局数据

import { createSlice } from '@reduxjs/toolkit';

const heritageStore = createSlice({
  name: 'heritage',
  initialState: {
    heritage: [],
    loading: false,
  },
  reducers: {
    setHeritage: (state, action) => {
      state.heritage = action.payload;
    },
    setHeritageLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const { setHeritage, setHeritageLoading } = heritageStore.actions;

const heritageReducer = heritageStore.reducer;

export { setHeritage, setHeritageLoading };

export default heritageReducer;
