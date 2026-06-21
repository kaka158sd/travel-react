// 存放审核退款申请的全局变量

import { createSlice } from '@reduxjs/toolkit';

const refundStore = createSlice({
  name: 'refund',
  initialState: {
    refund: [],
  },
  reducers: {
    setRefund: (state, action) => {
      state.refund = action.payload;
    },
  },
});

const { setRefund } = refundStore.actions;

const refundReducer = refundStore.reducer;

export { setRefund };

export default refundReducer;
