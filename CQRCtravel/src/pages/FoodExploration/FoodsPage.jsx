import { Title, Card } from '@/components';
import { useEffect, useState } from 'react';
import { getFoodsAPI } from '@/apis/foods';
import { LoadError, LoadingSkeleton } from '@/components/EmptyStates';
import { useSelector } from 'react-redux';
import { Pagination } from 'antd';
import { usePageList } from '@/hook';

const FoodsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [foodsList, setFoodsList] = useState([]);
  const { touristId } = useSelector((state) => state.user);

  useEffect(() => {
    let timer; // 用于最小加载时间
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
    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearTimeout(timer);
  }, []);

  const { currentData, currentPage, total, setCurrentPage } = usePageList(
    foodsList.sort((a, b) => b.food_id - a.food_id),
    6,
    [''],
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

  return (
    <div className="max-w-364 m-auto">
      <Title titleData={{ title: '荣昌美食' }} />

      <div className="w-full mx-auto grid grid-cols-3 gap-17.5 justify-content-stretch mb-25 mt-4">
        {currentData
          .sort((a, b) => b.food_id - a.food_id)
          .map((item) => {
            const boxStyle = {
              width: 'w-[440px]',
              imgHeight: 'h-[240px]',
            };

            const cardData = {
              mode: 2,
              img: item.food_image,
              type: item.food_type,
              title: item.food_name,
              desc: item.food_desc,
              score: item.score,
              rate: item.price,
              category: 2, //1：价格-number；2：价格-string；3：已体验人数-number
              content: {
                label: ['推荐店铺', '适合人群'],
                contents: [
                  `${item.recommended_shop}`,
                  `${item.suitable_people}`,
                ], //若为数字则与相应文字拼接变成字符串
              },
              btn: [5], //1:行程；2：预约；3：编辑；4：删除；5：收藏（最好按顺序写，因为当第一项为5时不显示1-4按钮）
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

export default FoodsPage;
