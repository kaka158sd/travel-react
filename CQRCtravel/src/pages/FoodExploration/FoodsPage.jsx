import { Title, Card } from '@/components';
import { useEffect, useState } from 'react';
import { getFoodsAPI } from '@/apis/foods';

const FoodsPage = () => {
  const [foodsList, setFoodsList] = useState([]);

  useEffect(() => {
    const getFoodsList = async () => {
      try {
        const res = await getFoodsAPI();
        setFoodsList(res.data);
      } catch (error) {
        console.error('获取非遗列表失败', error);
      }
    };

    getFoodsList();
  }, []);

  return (
    <div className="max-w-364 m-auto">
      <Title titleData={{ title: '荣昌美食' }} />

      <div className="w-full mx-auto grid grid-cols-3 gap-17.5 justify-content-stretch mb-25 mt-4">
        {foodsList.map((item) => {
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
              contents: [`${item.recommended_shop}`, `${item.suitable_people}`], //若为数字则与相应文字拼接变成字符串
            },
            btn: [5], //1:行程；2：预约；3：编辑；4：删除；5：收藏（最好按顺序写，因为当第一项为5时不显示1-4按钮）
          };

          return (
            <Card key={item.food_id} boxStyle={boxStyle} cardData={cardData} />
          );
        })}
      </div>
    </div>
  );
};

export default FoodsPage;
