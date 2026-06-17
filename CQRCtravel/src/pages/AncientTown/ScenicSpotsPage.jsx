import { getScenicSpotsAPI, getSpotTypeAPI } from '@/apis/scenic_spots';
import { Title, Card, SearchAndFilter } from '@/components';
import { useEffect, useState } from 'react';
import { LoadError, LoadingSkeleton, NoData } from '@/components/EmptyStates';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Pagination } from 'antd';
import { usePageList } from '@/hook';

const ScenicSpotsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  // 获取景点列表
  const [scenicSpotsList, setScenicSpotsList] = useState([]);
  // 获取景点类型列表
  const [spotType, setspotType] = useState([]);
  const navigate = useNavigate();
  const { touristId } = useSelector((state) => state.user);
  const [inputValue, setInputValue] = useState('');
  // 多选值状态
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    let timer; // 用于最小加载时间
    const getScenicSpotsList = async () => {
      try {
        setIsLoading(true);
        const res = await getScenicSpotsAPI();
        setScenicSpotsList(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 300ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    const getSpotTypeList = async () => {
      try {
        setIsLoading(true);
        const res = await getSpotTypeAPI();
        setspotType(res.data);
      } catch (error) {
        console.error('获取景点类型列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 300ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    getScenicSpotsList();
    getSpotTypeList();
    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearTimeout(timer);
  }, []);

  // 搜索和筛选
  const {
    currentPage,
    currentData,
    total,
    setCurrentPage,
    changeFilter,
    setSearchText,
  } = usePageList(
    scenicSpotsList.sort((a, b) => b.spot_id - a.spot_id),
    6,
    ['spot_name'],
  );

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    // console.log('当前选中的值：', value);
    setSelectedValues(value);
    changeFilter('spot_type', value); // 筛选 type 字段
  };

  // 下拉菜单 / 搜索框配置
  const scenicSpotsform = {
    select: {
      width: 360,
      optionsItem: spotType
        .sort((a, b) => b.type_id - a.type_id)
        .map((item) => ({
          value: item.type_name,
          label: item.type_name,
        })),
      placeholder: '选择景点类型',
      showSearch: true,
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
    search: {
      placeholder: '搜索景点名称...',
      width: 360,
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

  return (
    <div className="w-full px-36">
      <Title titleData={{ title: '荣昌景点' }} />

      {/* 筛选框和搜索框 */}
      <div className="py-10">
        <SearchAndFilter fieldConfig={scenicSpotsform} />
      </div>

      {/* 景点列表渲染 */}
      {currentData.length > 0 ? (
        <div className="w-full mx-auto grid grid-cols-3 gap-25 justify-content-stretch mb-25">
          {[...currentData]
            ?.sort((a, b) => b.spot_id - a.spot_id)
            .map((item) => {
              // 组装Card组件需要的数据
              const boxStyle = {
                width: 'w-[346px]',
                height: 'h-[450px]',
                imgHeight: 'h-[200px]',
              };

              const cardData = {
                mode: 2,
                img: item.spot_image,
                type: item.spot_type,
                title: item.spot_name,
                desc: item.spot_desc,
                tags: item.spot_tags,
                btn: [1, 2, 5],
              };

              const favoriteData = {
                touristId: touristId,
                businessType: 1,
                businessId: item.spot_id,
              };

              // 处理的用于加入行程的数据
              const processData = {
                business_type: 1,
                business_id: item.spot_id,
                business_name: item.spot_name,
                price: item.ticket_price,
              };

              // 给每个Card传递对象并添加key
              return (
                <Card
                  key={item.spot_id}
                  boxStyle={boxStyle}
                  cardData={cardData}
                  reservationForm={{
                    business_type: 1,
                    item_name: item.spot_name,
                    single_price: item.ticket_price,
                  }}
                  onClick={() => navigate(`/scenicSpotsDetail/${item.spot_id}`)}
                  favoriteData={favoriteData}
                  processData={processData}
                />
              );
            })}
        </div>
      ) : (
        <NoData />
      )}

      {/* 分页组件 */}
      <div>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={6}
          total={total}
          align="end"
          onChange={(page) => setCurrentPage(page)}
          size="large"
        />
      </div>
    </div>
  );
};

export default ScenicSpotsPage;
