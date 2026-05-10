import { getIntangibleHeritageAPI } from '@/apis/intangible_heritage';
import { Card, LookMore, Title } from '@/components';
import { useEffect, useState } from 'react';
import { LoadError, LoadingSkeleton } from '@/components/EmptyStates';

const titleData = {
  title: '非遗体验 · 匠心传承',
  desc: '预约荣昌特色非遗体验，与匠人面对面交流创作',
};

const IntangibleCultural = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [intangibleHeritageList, setintangibleHeritageList] = useState([]);

  useEffect(() => {
    let timer;
    const getIntangibleHeritageList = async () => {
      try {
        setIsLoading(true);
        const res = await getIntangibleHeritageAPI();
        setintangibleHeritageList(res.data);
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

    getIntangibleHeritageList();
    return () => clearTimeout(timer);
  }, []);

  const intangibleHeritageThreeList = intangibleHeritageList.slice(0, 3);

  if (isLoading) {
    // return <Loading />;
    return <LoadingSkeleton />;
  }

  // 错误状态
  if (error) {
    return <LoadError />;
  }

  return (
    <div className="max-w-350 m-auto">
      <Title titleData={titleData} />
      <LookMore path="/intangibleHeritage_Page" />

      <div className="w-full mx-auto grid grid-cols-3 gap-43 justify-content-stretch mb-25">
        {intangibleHeritageThreeList.map((item) => {
          const boxStyle = {
            width: 'w-[350px]',
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
            category: 1, //1：价格-number；2：价格-string；3：已体验人数-number
            content: {
              label: ['预约周期', '体验时长', '适合人群'],
              contents: [
                `提前${item.reserve_weeks}天`,
                `${item.experience_duration}分钟`,
                `${item.suitable_people}`,
              ], //若为数字则与相应文字拼接变成字符串
            },
            btn: [1, 2, 5], //1:行程；2：预约；3：编辑；4：删除；5：收藏（最好按顺序写，因为当第一项为5时不显示1-4按钮）
          };

          return (
            <Card
              key={item.heritage_id}
              boxStyle={boxStyle}
              cardData={cardData}
              reservationForm={{
                item_name: item.heritage_name,
                single_price: item.price,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IntangibleCultural;
