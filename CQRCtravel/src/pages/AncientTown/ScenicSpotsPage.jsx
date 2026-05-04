import { getScenicSpotsAPI, getSpotTypeAPI } from '@/apis/scenic_spots';
import { Title, Card, DataField } from '@/components';
import { useEffect, useState } from 'react';

const ScenicSpotsPage = () => {
  // 获取景点列表
  const [scenicSpotsList, setScenicSpotsList] = useState([]);
  // 获取景点类型列表
  const [spotType, setspotType] = useState([]);

  useEffect(() => {
    const getScenicSpotsList = async () => {
      try {
        const res = await getScenicSpotsAPI();
        setScenicSpotsList(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
      }
    };

    const getSpotTypeList = async () => {
      try {
        const res = await getSpotTypeAPI();
        setspotType(res.data);
      } catch (error) {
        console.error('获取景点类型列表失败', error);
      }
    };

    getScenicSpotsList();
    getSpotTypeList();
  }, []);

  // 下拉菜单 / 搜索框配置
  const scenicSpotsform = [
    {
      type: 'select',
      formConfig: {
        width: 360,
        optionsItem: spotType.map((item) => ({
          value: item.tp_id,
          label: item.type_name,
        })),
        placeholder: '选择景点类型',
        isAllowClear: true,
        isShowSearch: true,
        mode: 2, //1:单选；2:多选
      },
    },
    {
      type: 'search',
      formConfig: {
        placeholder: '搜索景点名称...',
        width: 360,
      },
    },
  ];

  return (
    <div className="w-full px-36">
      <Title titleData={{ title: '荣昌景点' }} />

      {/* 筛选框和搜索框 */}
      <div className="pb-10 flex justify-between ">
        {scenicSpotsform.map((item) => (
          <DataField
            key={item.type}
            type={item.type}
            formConfig={item.formConfig}
          />
        ))}
      </div>

      {/* 景点列表渲染 */}
      <div className="w-full mx-auto grid grid-cols-3 gap-25 justify-content-stretch mb-25">
        {scenicSpotsList.map((item) => {
          // 组装Card组件需要的数据
          const boxStyle = {
            width: 'w-[400px]',
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

          // 给每个Card传递对象并添加key
          return (
            <Card
              key={item.spot_id}
              boxStyle={boxStyle}
              cardData={cardData}
              reservationForm={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScenicSpotsPage;
