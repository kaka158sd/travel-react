import { useFirstEnterNav } from '@/hook';
import { Menu } from 'antd';
import { getScenicSpotsAPI } from '@/apis/scenic_spots';
import { Card, NoData } from '@/components';
import { useEffect, useMemo, useState } from 'react';
import { getIntangibleHeritageAPI } from '@/apis/intangible_heritage';
import { getFoodsAPI } from '@/apis/foods';
import { LoadError, LoadingSkeleton } from '@/components/EmptyStates';
import { useNavigate, useOutletContext } from 'react-router-dom';

// 导航配置项
const menuItems = [
  { key: 'spot', label: '景点' },
  { key: 'heritage', label: '非遗' },
  { key: 'food', label: '美食' },
];

const MyFavorites = () => {
  const { favoritesData = [], touristId = 1 } = useOutletContext() || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 当前选中的菜单项
  const [selectedMenu, setSelectedMenu] = useFirstEnterNav(
    '/touristCenter',
    'spot',
    'favoriteNav',
  );
  // 获取景点列表
  const [scenicSpotsList, setScenicSpotsList] = useState([]);
  // 获取非遗列表
  const [intangibleHeritageList, setIntangibleHeritageList] = useState([]);
  // 获取美食列表
  const [foodsList, setFoodsList] = useState([]);

  useEffect(() => {
    let timer;
    const getScenicSpotsList = async () => {
      try {
        setIsLoading(true);
        const res = await getScenicSpotsAPI();
        setScenicSpotsList(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 200ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    };
    const getIntangibleHeritageList = async () => {
      try {
        setIsLoading(true);
        const res = await getIntangibleHeritageAPI();
        setIntangibleHeritageList(res.data);
      } catch (error) {
        console.error('获取非遗列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 200ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    };
    const getFoodsList = async () => {
      try {
        setIsLoading(true);
        const res = await getFoodsAPI();
        setFoodsList(res.data);
      } catch (error) {
        console.error('获取非遗列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 200ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    };

    getScenicSpotsList();
    getIntangibleHeritageList();
    getFoodsList();
    return () => clearTimeout(timer);
  }, []);

  // 用于展示在收藏中的数据
  const myFavoritesData = useMemo(() => {
    // 过滤出收藏中不同类型的数据
    const spotFavoritesList = favoritesData.filter(
      (item) => item.business_type === 1 && item.is_favorite,
    );
    const heritageFavoritesList = favoritesData.filter(
      (item) => item.business_type === 2 && item.is_favorite,
    );
    const foodsFavoritesList = favoritesData.filter(
      (item) => item.business_type === 3 && item.is_favorite,
    );

    // 获取匹配数据的id
    const spotIds = spotFavoritesList.map((item) => item.business_id);
    const heritageIds = heritageFavoritesList.map((item) => item.business_id);
    const foodsIds = foodsFavoritesList.map((item) => item.business_id);

    // 从接口中匹配数据
    const scenicSpots = scenicSpotsList
      .filter((item) => spotIds.includes(item.spot_id))
      .sort((a, b) => new Date(b.update_time) - new Date(a.update_time));
    const intangibleHeritage = intangibleHeritageList
      .filter((item) => heritageIds.includes(item.heritage_id))
      .sort((a, b) => new Date(b.update_time) - new Date(a.update_time));
    const foods = foodsList
      .filter((item) => foodsIds.includes(item.food_id))
      .sort((a, b) => new Date(b.update_time) - new Date(a.update_time));

    return {
      scenicSpots,
      intangibleHeritage,
      foods,
    };
  }, [favoritesData, scenicSpotsList, intangibleHeritageList, foodsList]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

  return (
    <div className="w-full">
      <div className=" w-full text-xl text-center font-semibold tracking-widest py-4 border my-0 rounded-lg border-amber-500 bg-[#fff7eb]">
        我的收藏
      </div>

      {/* 收藏类型导航 */}
      <div className="max-w-300 h-fit  mx-auto">
        <Menu
          mode="inline"
          items={menuItems}
          style={{ fontSize: 18, width: 100 }}
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          className="fixed z-30 left-24 top-46"
        />

        {/* 景点列表渲染 */}
        {selectedMenu === 'spot' && (
          <>
            {myFavoritesData?.scenicSpots?.length > 0 ? (
              <div className="w-full px-10 py-6 mx-auto grid grid-cols-3 gap-y-8 gap-x-27">
                {myFavoritesData.scenicSpots.map((item) => {
                  // 组装Card组件需要的数据
                  const boxStyle = {
                    width: 'w-[300px]',
                    height: 'h-[320px]',
                    imgHeight: 'h-[140px]',
                  };

                  const cardData = {
                    mode: 2,
                    img: item.spot_image,
                    type: item.spot_type,
                    title: item.spot_name,
                    desc: item.spot_desc,
                    tags: item.spot_tags,
                    btn: [5],
                  };

                  const favoriteData = {
                    touristId: touristId,
                    businessType: 1,
                    businessId: item.spot_id,
                  };

                  // 给每个Card传递对象并添加key
                  return (
                    <Card
                      key={item.spot_id}
                      boxStyle={boxStyle}
                      cardData={cardData}
                      favoriteData={favoriteData}
                      onClick={() =>
                        navigate(`/scenicSpotsDetail/${item.spot_id}`)
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <NoData />
            )}
          </>
        )}

        {/* 非遗列表渲染 */}
        {selectedMenu === 'heritage' && (
          <>
            {myFavoritesData?.intangibleHeritage?.length > 0 ? (
              <div className="w-full px-10 py-6 mx-auto grid grid-cols-4 gap-y-8 gap-x-7">
                {myFavoritesData.intangibleHeritage.map((item) => {
                  // 组装Card组件需要的数据
                  const boxStyle = {
                    width: 'w-[260px]',
                    height: 'h-[500px]',
                    imgHeight: 'h-[200px]',
                  };

                  const cardData = {
                    mode: 2,
                    img: item.heritage_image,
                    type: item.heritage_type,
                    title: item.heritage_name,
                    desc: item.heritage_desc,
                    score: item.score,
                    rate: item.price,
                    category: 1,
                    content: {
                      label: ['预约周期', '体验时长', '适合人群'],
                      contents: [
                        `提前${item.reserve_weeks}天`,
                        `${item.experience_duration}分钟`,
                        `${item.suitable_people}`,
                      ],
                    },
                    btn: [5],
                  };

                  const favoriteData = {
                    touristId: touristId,
                    businessType: 2,
                    businessId: item.heritage_id,
                  };

                  // 给每个Card传递对象并添加key
                  return (
                    <Card
                      key={item.heritage_id}
                      boxStyle={boxStyle}
                      cardData={cardData}
                      favoriteData={favoriteData}
                      onClick={() =>
                        navigate(
                          `/intangibleHeritageDetail/${item.heritage_id}`,
                        )
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <NoData />
            )}
          </>
        )}

        {/* 美食列表渲染 */}
        {selectedMenu === 'food' && (
          <>
            {myFavoritesData?.foods?.length > 0 ? (
              <div className="w-full px-10 py-6 mx-auto grid grid-cols-3 gap-y-8 gap-x-13">
                {myFavoritesData.foods.map((item) => {
                  // 组装Card组件需要的数据
                  const boxStyle = {
                    width: 'w-[340px]',
                    height: 'h-[400px]',
                    imgHeight: 'h-[140px]',
                  };

                  const cardData = {
                    mode: 2,
                    img: item.food_image,
                    type: item.food_type,
                    title: item.food_name,
                    desc: item.food_desc,
                    score: item.score,
                    rate: item.price,
                    category: 2,
                    content: {
                      label: ['推荐店铺', '适合人群'],
                      contents: [
                        `${item.recommended_shop}`,
                        `${item.suitable_people}`,
                      ],
                    },
                    btn: [5],
                  };

                  const favoriteData = {
                    touristId: touristId,
                    businessType: 3,
                    businessId: item.food_id,
                  };

                  return (
                    <Card
                      key={item.food_id}
                      boxStyle={boxStyle}
                      cardData={cardData}
                      favoriteData={favoriteData}
                    />
                  );
                })}
              </div>
            ) : (
              <NoData />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
