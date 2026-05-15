// 与钱包有关的全局数据

import { getWalletStorage, setWalletStorage } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const walletStore = createSlice({
  name: 'wallet',
  initialState: {
    wallet: getWalletStorage() || 0,
  },
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload;
      setWalletStorage(action.payload);
    },
  },
});

const { setWallet } = walletStore.actions;

const walletReducer = walletStore.reducer;

export { setWallet };

export default walletReducer;
