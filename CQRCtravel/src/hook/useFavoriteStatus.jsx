// 与收藏有关的操作

import {
  getFavoritesAPI,
  postFavoriteAPI,
  updateFavoriteAPI,
} from '@/apis/favorites';
import { setFavoritesList, setLoading } from '@/store';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 判断某个数据是否被收藏
// 传入参数：当前用户id，业务类型，业务id
export function useFavoriteStatus(touristId, businessType, businessId) {
  // 收藏状态
  const [isFavorite, setIsFavorite] = useState(null);
  // 收藏列表
  const [favoriteItem, setFavoriteItem] = useState(null);
  // 收藏id
  const [favoriteId, setFavoriteId] = useState(null);
  const favorites = useSelector((state) => state.favorite.favoritesList);
  const loading = useSelector((state) => state.favorite.loading);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const getFavoritesList = async () => {
    if (!touristId) return;
    dispatch(setLoading(true));

    try {
      const res = await getFavoritesAPI();
      const list = res.data || [];
      dispatch(setFavoritesList(list));

      // 自动判断当前是否收藏
      if (businessType && businessId) {
        const fav = list.find(
          (item) =>
            item.tourist_id === touristId &&
            item.business_type === businessType &&
            item.business_id === businessId,
        );
        if (fav) {
          setIsFavorite(fav.is_favorite);
          setFavoriteId(fav.favorite_id);
          setFavoriteItem(fav);
        } else {
          setIsFavorite(false);
          setFavoriteId(null);
          setFavoriteItem(null);
        }
      }
    } catch (error) {
      console.error('获取收藏列表失败', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 初始化，依赖变化时重新请求
  useEffect(() => {
    getFavoritesList();
  }, [touristId, businessId, businessType]);

  // 收藏点击方法
  const handleFavClick = async () => {
    // 防止重复点击
    if (loading) return;

    try {
      // 已有收藏记录 → 更新
      if (favoriteItem) {
        const newStatus = !favoriteItem.is_favorite;

        await updateFavoriteAPI(favoriteId, {
          is_favorite: newStatus,
          update_time: new Date(),
        });

        // 给用户反馈
        newStatus
          ? messageApi.success('收藏成功！')
          : messageApi.info('已取消收藏！');

        // 刷新收藏列表
        await getFavoritesList();
      } else {
        // 无收藏记录 → 新增
        await postFavoriteAPI({
          tourist_id: touristId,
          business_type: businessType,
          business_id: businessId,
        });

        messageApi.success('收藏成功！');

        await getFavoritesList();
      }
    } catch (error) {
      console.error('收藏按钮点击发生错误', error);
      messageApi.error('操作失败，请重试！');
    }
  };

  // 刷新方法
  const refreshFavorite = async () => {
    await getFavoritesList();
  };

  return {
    isFavorite, //是否收藏
    favoriteId, //收藏id
    loading, //加载状态
    favoriteItem, //收藏的具体项或者表示未在收藏数据库中找到
    favorites, //收藏列表
    contextHolder, // 消息提示
    refreshFavorite, //刷新收藏
    handleFavClick, // 点击事件
  };
}
