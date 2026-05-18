// 存放景点列表的全局变量

import { createSlice } from '@reduxjs/toolkit';

const spotStore = createSlice({
  name: 'spot',
  initialState: {
    spotList: [],
    loading: false,
  },
  reducers: {
    setSpotList: (state, action) => {
      state.spotList = action.payload;
    },
    setSpotLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const { setSpotList, setSpotLoading } = spotStore.actions;

const spotReducer = spotStore.reducer;

export { setSpotList, setSpotLoading };

export default spotReducer;
