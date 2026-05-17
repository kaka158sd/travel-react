import { Outlet } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { updateTouristApi } from '@/apis/users';
import { getOrdersAPI, updateOrderstAPI } from '@/apis/orders';
import { getFavoritesAPI } from '@/apis/favorites';
import { LoadError, LoadingSkeleton } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { setFavoritesList, setUserPrivacyData, setWallet } from '@/store';
import { shallowEqual } from 'react-redux';

const TouristCenterLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  // 全局消息
  const {
    currentUser,
    touristId,
    userPrivacyData: currentTourist,
  } = useSelector((state) => state.user, shallowEqual);

  const [orders, setOrders] = useState([]);
  const { favoritesList = [] } = useSelector(
    (state) => state.favorite,
    shallowEqual,
  );
  const { wallet = 0 } = useSelector((state) => state.wallet, shallowEqual);

  // 请求锁，防止并发/重复请求
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!touristId) return;

    let mounted = true;

    const fetchData = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const [orderRes, favRes] = await Promise.all([
          getOrdersAPI(),
          getFavoritesAPI(),
        ]);

        if (!mounted) return;

        setOrders(orderRes?.data || []);
        dispatch(setFavoritesList(favRes?.data || []));
      } catch (error) {
        console.error('数据加载失败', error);
        if (mounted) setError(true);
      } finally {
        if (mounted) {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    setIsLoading(true);
    fetchData();

    return () => {
      mounted = false;
      // clearTimeout(timerRef.current);
      isFetchingRef.current = false;
    };
  }, [touristId, dispatch]);

  // 监听 currentTourist 变化，同步更新钱包余额
  useEffect(() => {
    if (
      currentTourist?.wallet !== undefined &&
      currentTourist.wallet !== wallet
    ) {
      dispatch(setWallet(currentTourist.wallet));
    }
  }, [currentTourist?.wallet, dispatch, wallet]); // 依赖项是钱包余额，变化时自动更新

  // 当前游客的收藏数据
  const favoritesData = useMemo(() => {
    if (!touristId || !favoritesList || !favoritesList.length) return [];

    return (
      favoritesList.filter(
        (item) => item.tourist_id === touristId && item.is_favorite,
      ) || []
    );
  }, [favoritesList, touristId]);

  // 当前游客的订单数据
  const myOrderData = useMemo(() => {
    if (!touristId || !orders.length) return [];

    const data = orders.filter((item) => item.tourist_id === touristId) || [];
    // 按 order_id 倒序，最新的在前面
    return data.sort((a, b) => b.order_id - a.order_id);
  }, [touristId, orders]);

  // 更新钱包数据
  const updateWalletData = useCallback(
    async (newWallet) => {
      try {
        await updateTouristApi(touristId, { wallet: newWallet });

        dispatch(
          setUserPrivacyData({
            ...currentTourist,
            wallet: newWallet,
          }),
        );

        dispatch(setWallet(newWallet));
      } catch (err) {
        console.error('更新钱包失败', err);
      }
    },
    [touristId, dispatch, currentTourist],
  );

  // 更新订单数据
  const updateOrderData = useCallback(
    async (id, status) => {
      // 防止重复调用同一个订单的更新接口
      const order = orders.find((o) => o.order_id === id);
      if (order?.order_status === status) return;

      await updateOrderstAPI(id, { order_status: status });
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === id ? { ...order, order_status: status } : order,
        ),
      );
    },
    [orders],
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

  return (
    <Outlet
      context={{
        currentUser,
        currentTourist,
        touristId,
        favoritesDataLength: favoritesData.length,
        myOrderData,
        favoritesData,
        updateWalletData,
        updateOrderData,
      }}
    />
  );
};

export default TouristCenterLayout;
