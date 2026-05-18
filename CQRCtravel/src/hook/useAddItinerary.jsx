// 加入行程操作

import {
  getCustomItemsAPI,
  postCustomItemAPI,
  updateCustomItemAPI,
} from '@/apis/trip';
import { setCustomItem, setCustomLoading } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsTourist } from '.';

export function useAddItinerary(touristId, processData, messageApi) {
  const isTourist = useIsTourist();

  // 解构数据
  const { business_type, business_id, business_name, price } = processData;
  const dispatch = useDispatch();
  // 是否已有自定义项目记录
  const [isExisted, setIsExisted] = useState(false);
  // 已有的自定义项目对象
  const [existItem, setExistItem] = useState(null);
  const { customItem = [], loading = false } = useSelector(
    (state) => state.customItem,
  );

  const getCustomItem = useCallback(async () => {
    if (!touristId) {
      return;
    }
    dispatch(setCustomLoading(true));

    try {
      const res = await getCustomItemsAPI();
      const list = res.data || [];
      dispatch(setCustomItem(list));

      if (business_type && business_id) {
        // 判断该业务项目是否已经在自定义项目中
        const isAddCustom = list.find(
          (item) =>
            item.tourist_id === touristId &&
            item.business_type === business_type &&
            item.business_id === business_id,
        );

        if (isAddCustom) {
          setIsExisted(true);
          setExistItem(isAddCustom);
        } else {
          setIsExisted(false);
          setExistItem(null);
        }
      }
    } catch (error) {
      console.error('获取自定义列表并判断项目是否已有记录失败！', error);
    } finally {
      dispatch(setCustomLoading(false));
    }
  }, [touristId, business_type, business_id, dispatch]);

  // 初始化，依赖变化时重新请求
  useEffect(() => {
    // 非游客身份直接返回空对象，不执行任何逻辑
    if (!isTourist) {
      return;
    }

    if (!touristId) {
      messageApi.error('游客id不存在！请登录！');
      return;
    }

    getCustomItem();
  }, [getCustomItem, messageApi, touristId, isTourist]);

  // 加入行程点击事件
  const handleAddItinerary = async () => {
    // 非游客身份直接返回空对象，不执行任何逻辑
    if (!isTourist) {
      messageApi.info('加入行程功能只有游客才能操作！您并非游客，请勿点击！');
      return;
    }

    if (loading) {
      messageApi.error('操作太快了，请稍后！');
      return;
    }

    await getCustomItem();

    if (isExisted) {
      // 已存在于自定义项目中
      // 判断是否加入到自定义为true
      if (!existItem.is_added_to_custom) {
        try {
          await updateCustomItemAPI(existItem.custom_item_id, {
            is_added_to_custom: true,
          });

          loading
            ? messageApi.open({
                type: 'loading',
                content: '正在加载中...',
                duration: 0,
              })
            : messageApi.open({
                type: 'success',
                content: (
                  <div>
                    {business_type === 1 ? '景点' : '非遗'}
                    <span className="mx-1 text-amber-400">{business_name}</span>
                    已加入行程！
                  </div>
                ),
              });

          // 并更新自定义项目状态
          await getCustomItem();
        } catch (error) {
          console.error('将已有记录加入行程失败！', error);
        }
      } else {
        messageApi.info('已加入到行程的自定义项目中，请勿重复加入！');
      }
    } else {
      // 不存在，需要新增
      try {
        await postCustomItemAPI({
          tourist_id: touristId,
          business_type,
          business_id,
          business_name,
          price,
          is_added_to_custom: true,
          is_added_to_trip: false,
        });

        loading
          ? messageApi.open({
              type: 'loading',
              content: '正在加载中...',
              duration: 0,
            })
          : messageApi.open({
              type: 'success',
              content: (
                <div>
                  {business_type === 1 ? '景点' : '非遗'}
                  <span className="mx-1 text-amber-400">{business_name}</span>
                  已加入行程！
                </div>
              ),
            });

        // 并更新自定义项目状态
        await getCustomItem();
      } catch (error) {
        console.error('项目加入行程失败！', error);
        messageApi.error('项目加入行程失败！请重试！');
      }
    }
  };

  return {
    customItem, //自定义项目列表
    isExisted, //是否有记录
    existItem, //记录的对象，无则为 null
    loading, //加载状态
    handleAddItinerary, //加入行程点击事件
  };
}
