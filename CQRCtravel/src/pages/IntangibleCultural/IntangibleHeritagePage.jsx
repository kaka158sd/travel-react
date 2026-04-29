import {
  getIntangibleHeritageAPI,
  getHeritageTypeAPI,
} from '@/apis/intangible_heritage';
import { Title, Card, DataField } from '@/components';
import { useEffect, useState } from 'react';

const IntangibleHeritagePage = () => {
  const [intangibleHeritageList, setIntangibleHeritageList] = useState([]);
  const [heritageTypeList, setHeritageTypeList] = useState([]);

  useEffect(() => {
    const getIntangibleHeritageList = async () => {
      try {
        const res = await getIntangibleHeritageAPI();
        setIntangibleHeritageList(res.data);
      } catch (error) {
        console.error('获取非遗列表失败', error);
      }
    };

    const getHeritageTypeList = async () => {
      try {
        const res = await getHeritageTypeAPI();
        setHeritageTypeList(res.data);
      } catch (error) {
        console.error('获取非遗类型列表失败', error);
      }
    };

    getIntangibleHeritageList();
    getHeritageTypeList();
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
        {intangibleHeritageList.map((item) => {
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default IntangibleHeritagePage;
