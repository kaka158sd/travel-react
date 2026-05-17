import {
  getIntangibleHeritageAPI,
  getHeritageTypeAPI,
} from '@/apis/intangible_heritage';
import { Title, Card, DataField } from '@/components';
import { useEffect, useState } from 'react';
import { LoadError, LoadingSkeleton } from '@/components/EmptyStates';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const IntangibleHeritagePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [intangibleHeritageList, setIntangibleHeritageList] = useState([]);
  const [heritageTypeList, setHeritageTypeList] = useState([]);
  const { touristId } = useSelector((state) => state.user);

  useEffect(() => {
    let timer;
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

    const getHeritageTypeList = async () => {
      try {
        setIsLoading(true);
        const res = await getHeritageTypeAPI();
        setHeritageTypeList(res.data);
      } catch (error) {
        console.error('获取非遗类型列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 200ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    };

    getIntangibleHeritageList();
    getHeritageTypeList();
    return () => clearTimeout(timer);
  }, []);

  // 下拉菜单 / 搜索框配置
  const intangibleHeritageForm = [
    {
      type: 'select',
      formConfig: {
        width: 360,
        optionsItem: heritageTypeList.map((item) => ({
          value: item.tp_id,
          label: item.type_name,
        })),
        placeholder: '选择非遗类型',
        isAllowClear: true,
        mode: 2, //1:单选；2:多选
      },
    },
    {
      type: 'search',
      formConfig: {
        placeholder: '搜索非遗名称...',
        width: 360,
      },
    },
  ];

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

  return (
    <div className="w-full px-36">
      <Title titleData={{ title: '荣昌非遗项目' }} />

      {/* 筛选框和搜索框 */}
      <div className="pb-10 flex justify-between ">
        {intangibleHeritageForm.map((item) => (
          <DataField
            key={item.type}
            type={item.type}
            formConfig={item.formConfig}
          />
        ))}
      </div>

      <div className="w-full mx-auto grid grid-cols-3 gap-43 justify-content-stretch mb-25">
        {intangibleHeritageList
          .sort((a, b) => b.heritage_id - a.heritage_id)
          .map((item) => {
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

            const favoriteData = {
              touristId: touristId,
              businessType: 2,
              businessId: item.heritage_id,
            };

            const reservationData = {
              inheritor_id: item.inheritor_id,
            };

            // 处理的用于加入行程的数据
            const processData = {
              business_type: 2,
              business_id: item.heritage_id,
              business_name: item.heritage_name,
              price: item.price,
            };

            return (
              <Card
                key={item.heritage_id}
                boxStyle={boxStyle}
                cardData={cardData}
                reservationForm={{
                  business_type: 2,
                  item_name: item.heritage_name,
                  single_price: item.price,
                }}
                favoriteData={favoriteData}
                reservationData={reservationData}
                processData={processData}
                onClick={() =>
                  navigate(`/intangibleHeritageDetail/${item.heritage_id}`)
                }
              />
            );
          })}
      </div>
    </div>
  );
};

export default IntangibleHeritagePage;
