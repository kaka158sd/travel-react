import { getHumanStoriesAPI } from '@/apis/human_stories';
import { getSpotTagsAPI, getSpotTypeAPI } from '@/apis/scenic_spots';
import { CommonForm, Card } from '@/components';
import { useAddSpotForm } from '@/hook';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

// 数据的时间需要处理
const addSpot = {
  spot_id: 1,
  spot_name: '万灵古镇',
  spot_image:
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.kBlSRPpi00LXAXUljsfJ5wHaED?w=319&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  spot_desc:
    '万灵古镇是宋代始建的千年古镇，依山傍水，明清建筑保存完好，曾为川渝重要水陆驿站，古桥、老街、宗祠遍布，兼具自然风光与厚重历史，是荣昌最具代表性的文化地标与旅游胜地。',
  spot_tags: ['古风', '历史', '古镇'],
  spot_type: '古镇',
  spot_star: '4A',
  open_status: '正常开放',
  is_ticket: true,
  ticket_price: 40.0,
  open_time: dayjs('08:00', 'HH:mm'),
  close_time: dayjs('18:00', 'HH:mm'),
  spot_address: '荣昌区万灵镇',
  story_id: 1,
  area: 126000.0,
  traffic_guide: '乘106路公交',
  notice: '文明游览',
  score: 4.8,
};

const SpotManage = ({ adminNav, scenicSpots }) => {
  const [spotType, setSpotType] = useState([]);
  const [spotTags, setSpotTags] = useState([]);
  const [humanStories, setHumanStories] = useState([]);

  useEffect(() => {
    const getSpotType = async () => {
      try {
        const res = await getSpotTypeAPI();
        setSpotType(res.data);
      } catch (error) {
        console.error('获取景点类型失败', error);
      }
    };
    const getSpotTags = async () => {
      try {
        const res = await getSpotTagsAPI();
        setSpotTags(res.data);
      } catch (error) {
        console.error('获取景点标签失败', error);
      }
    };
    const getHumanStories = async () => {
      try {
        const res = await getHumanStoriesAPI();
        setHumanStories(res.data);
      } catch (error) {
        console.error('获取人文故事失败', error);
      }
    };

    getSpotType();
    getSpotTags();
    getHumanStories();
  }, []);

  const spotTypeOptions = spotType?.map((item) => ({
    value: item.type_name,
    label: item.type_name,
  }));
  const spotTagsOptions = spotTags?.map((item) => ({
    value: item.tag_name,
    label: item.tag_name,
  }));
  const humanStoriesOptions = humanStories?.map((item) => ({
    value: item.story_id,
    label: item.story_title,
  }));

  const { form, formFields, initialValues } = useAddSpotForm({
    addSpot,
    spotTypeOptions,
    spotTagsOptions,
    humanStoriesOptions,
  });

  return (
    <div>
      {/* 新增景点 */}
      {adminNav === 'spotAdd' && (
        <div>
          <div className="text-xl font-semibold">新增景点</div>

          {/* 景点新增表单 */}
          <div className="py-8">
            <div className="-translate-x-10">
              <CommonForm
                formType="add"
                form={form}
                maxWidth={1100}
                initialValues={initialValues || {}}
                formFields={formFields || []}
              />
            </div>

            {/* 新增/编辑按钮 */}
            <div className="w-30 mx-auto -translate-x-16">
              <div className="btn2">新增</div>
            </div>
          </div>
        </div>
      )}

      {/* 景点列表 */}
      {adminNav === 'spotList' && (
        <div>
          <div className="text-xl font-semibold">景点列表</div>

          {/* 搜索框和筛选框 */}

          {/* 景点列表 */}
          <div className="grid grid-cols-3 gap-y-6 gap-x-10 px-4 py-6">
            {scenicSpots.map((item) => {
              // 组装Card组件需要的数据
              const boxStyle = {
                width: 'w-[340px]',
                imgHeight: 'h-[160px]',
              };

              const cardData = {
                mode: 2,
                img: item.spot_image,
                type: item.spot_type,
                title: item.spot_name,
                desc: item.spot_desc,
                tags: item.spot_tags,
                btn: [3, 4],
              };

              // 给每个Card传递对象并添加key
              return (
                <Card
                  key={item.spot_id}
                  boxStyle={boxStyle}
                  cardData={cardData}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotManage;
