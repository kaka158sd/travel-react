import { useFirstEnterNav, usePageList } from '@/hook';
import { Alert, Menu, Pagination } from 'antd';
import { getScenicSpotsAPI } from '@/apis/scenic_spots';
import { Card, NoData, SearchAndFilter } from '@/components';
import { useEffect, useMemo, useState } from 'react';
import { getIntangibleHeritageAPI } from '@/apis/intangible_heritage';
import { getFoodsAPI } from '@/apis/foods';
import { LoadError, LoadingSkeleton } from '@/components/EmptyStates';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHeritage, setSpotList } from '@/store';

// 导航配置项
const menuItems = [
  { key: 'spot', label: '景点' },
  { key: 'heritage', label: '非遗' },
  { key: 'food', label: '美食' },
];

const MyFavorites = () => {
  const { favoritesData = [], touristId = 1 } = useOutletContext() || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  // 获取景点列表
  const { spotList = [] } = useSelector((state) => state.spot);
  // 获取非遗列表
  const { heritage = [] } = useSelector((state) => state.heritage);

  // 当前选中的菜单项
  const [selectedMenu, setSelectedMenu] = useFirstEnterNav(
    '/touristCenter',
    'spot',
    'favoriteNav',
  );

  // 获取美食列表
  const [foodsList, setFoodsList] = useState([]);
  // 景点搜索框
  const [spotInputValue, setSpotInputValue] = useState('');
  // 非遗搜索框
  const [heritageInputValue, setHeritageInputValue] = useState('');
  // 美食搜索框
  const [foodInputValue, setFoodInputValue] = useState('');
  // 存储被删除了的收藏业务
  const [deleteLength, setDeleteLength] = useState({});

  useEffect(() => {
    let timer;

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

    getFoodsList();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const getScenicSpotsList = async () => {
      try {
        const res = await getScenicSpotsAPI();
        dispatch(setSpotList(res.data));
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    const getIntangibleHeritageList = async () => {
      try {
        const res = await getIntangibleHeritageAPI();
        dispatch(setHeritage(res.data));
      } catch (error) {
        console.error('获取非遗列表失败', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getScenicSpotsList();
    getIntangibleHeritageList();
  }, [dispatch]);

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
    const spotIds = new Set(spotFavoritesList.map((item) => item.business_id));
    const heritageIds = new Set(
      heritageFavoritesList.map((item) => item.business_id),
    );
    const foodsIds = new Set(
      foodsFavoritesList.map((item) => item.business_id),
    );

    // 业务列表有效ID
    const validSpotIds = new Set(spotList.map((it) => it.spot_id));
    const validHeritageIds = new Set(heritage.map((it) => it.heritage_id));

    // 收藏存在、列表不存在 = 已删除失效ID
    const loseSpotIds = [...spotIds].filter((id) => !validSpotIds.has(id));
    const loseHeritageIds = [...heritageIds].filter(
      (id) => !validHeritageIds.has(id),
    );
    setDeleteLength({
      loseSpot: loseSpotIds,
      loseHeritage: loseHeritageIds,
    });

    // 从接口中匹配数据
    const scenicSpots = [...spotList]
      .filter((item) => spotIds.has(item.spot_id))
      .sort((a, b) => new Date(b.update_time) - new Date(a.update_time));
    const intangibleHeritage = [...heritage]
      .filter((item) => heritageIds.has(item.heritage_id))
      .sort((a, b) => new Date(b.update_time) - new Date(a.update_time));
    const foods = [...foodsList]
      .filter((item) => foodsIds.has(item.food_id))
      .sort((a, b) => new Date(b.update_time) - new Date(a.update_time));

    return {
      scenicSpots,
      intangibleHeritage,
      foods,
    };
  }, [favoritesData, heritage, spotList, foodsList]);

  // 搜索
  // 景点
  const {
    currentPage: spotCurrentPage,
    currentData: spotCurrentData,
    total: spotTotal,
    setCurrentPage: setSpotCurrentPage,
    setSearchText: setSpotSearchText,
  } = usePageList(myFavoritesData?.scenicSpots ?? [], 6, ['spot_name']);
  // 非遗
  const {
    currentPage: heritageCurrentPage,
    currentData: heritageCurrentData,
    total: heritageTotal,
    setCurrentPage: setHeritageCurrentPage,
    setSearchText: setHeritageSearchText,
  } = usePageList(myFavoritesData?.intangibleHeritage ?? [], 8, [
    'heritage_name',
  ]);
  // 美食
  const {
    currentPage: foodCurrentPage,
    currentData: foodCurrentData,
    total: foodTotal,
    setCurrentPage: setFoodCurrentPage,
    setSearchText: setFoodSearchText,
  } = usePageList(myFavoritesData?.foods ?? [], 6, ['food_name']);

  // 搜索框配置
  const searchConfig = {
    spot: {
      text: '景点',
      value: spotInputValue,
      set: setSpotInputValue,
      search: setSpotSearchText,
    },
    heritage: {
      text: '非遗',
      value: heritageInputValue,
      set: setHeritageInputValue,
      search: setHeritageSearchText,
    },
    food: {
      text: '美食',
      value: foodInputValue,
      set: setFoodInputValue,
      search: setFoodSearchText,
    },
  };

  // 封装获取搜索框配置方法
  const getSearchConfig = (type) => {
    const item = searchConfig[type];
    if (!item) return null;

    return {
      search: {
        placeholder: `搜索${item.text}名称...`,
        width: 360,
        value: item.value,
        onChange: (e) => item.set(e.target.value),
        onSearch: (value) => item.search(value),
        onClear: () => {
          item.set('');
          item.search('');
        },
      },
    };
  };

  // 分页数据
  const pageData = useMemo(() => {
    switch (selectedMenu) {
      case 'spot':
        return {
          currentPage: spotCurrentPage,
          total: spotTotal,
          setCurrentPage: setSpotCurrentPage,
          pageSize: 6,
        };
      case 'heritage':
        return {
          currentPage: heritageCurrentPage,
          total: heritageTotal,
          setCurrentPage: setHeritageCurrentPage,
          pageSize: 8,
        };
      case 'food':
        return {
          currentPage: foodCurrentPage,
          total: foodTotal,
          setCurrentPage: setFoodCurrentPage,
          pageSize: 6,
        };
      default:
        return {};
    }
  }, [
    selectedMenu,
    spotCurrentPage,
    spotTotal,
    setSpotCurrentPage,
    setHeritageCurrentPage,
    heritageCurrentPage,
    heritageTotal,
    foodCurrentPage,
    foodTotal,
    setFoodCurrentPage,
  ]);

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
            {deleteLength.loseSpot.length > 0 && (
              <Alert
                type="warning"
                title={`消息提示：最近有 ${deleteLength.loseSpot.length} 个您喜欢的景点关闭了开放！`}
                closable={{ closeIcon: true, 'aria-label': 'close' }}
                style={{ margin: '16px 20px 0' }}
              />
            )}
            <div className="pt-6 px-8">
              <SearchAndFilter fieldConfig={getSearchConfig('spot')} />
            </div>
            {spotCurrentData?.length > 0 ? (
              <div className="w-full px-10 py-6 mx-auto grid grid-cols-3 gap-y-8 gap-x-27">
                {[...spotCurrentData]
                  .sort(
                    (a, b) => new Date(b.update_time) - new Date(a.update_time),
                  )
                  .map((item) => {
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
            {deleteLength.loseHeritage.length > 0 && (
              <Alert
                type="warning"
                title={`消息提示：最近有 ${deleteLength.loseHeritage.length} 个您喜欢的非遗项目下架了！`}
                closable={{ closeIcon: true, 'aria-label': 'close' }}
                style={{ margin: '16px 20px 0' }}
              />
            )}
            <div className="pt-6 px-8">
              <SearchAndFilter fieldConfig={getSearchConfig('heritage')} />
            </div>
            {heritageCurrentData?.length > 0 ? (
              <div className="w-full px-10 py-6 mx-auto grid grid-cols-4 gap-y-8 gap-x-7">
                {[...heritageCurrentData]
                  .sort(
                    (a, b) => new Date(b.update_time) - new Date(a.update_time),
                  )
                  .map((item) => {
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
            <div className="pt-6 px-8">
              <SearchAndFilter fieldConfig={getSearchConfig('food')} />
            </div>
            {foodCurrentData?.length > 0 ? (
              <div className="w-full px-10 py-6 mx-auto grid grid-cols-3 gap-y-8 gap-x-13">
                {[...foodCurrentData]
                  .sort(
                    (a, b) => new Date(b.update_time) - new Date(a.update_time),
                  )
                  .map((item) => {
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

        {/* 分页组件 */}
        <div className="my-4">
          <Pagination
            defaultCurrent={1}
            current={pageData?.currentPage}
            pageSize={pageData?.pageSize}
            total={pageData?.total}
            align="end"
            onChange={(page) => pageData?.setCurrentPage(page)}
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default MyFavorites;
