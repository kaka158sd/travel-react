// 与收藏有关的全局数据

import { createSlice } from '@reduxjs/toolkit';

const favoritesStore = createSlice({
  name: 'favorite',
  initialState: {
    favoritesList: [],
    loading: false,
  },
  reducers: {
    setFavoritesList: (state, action) => {
      state.favoritesList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const { setFavoritesList, setLoading } = favoritesStore.actions;

const favoriteReducer = favoritesStore.reducer;

export { setFavoritesList, setLoading };

export default favoriteReducer;
