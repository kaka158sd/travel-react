import { Card, CommonForm, NoData } from '@/components';
import { useAddHeritageForm } from '@/hook';
import { useNavigate, useOutletContext } from 'react-router-dom';

// 传承项目数据
const addHeritage = {
  heritage_id: 5,
  heritage_name: '荣昌缠丝拳',
  heritage_type: '传统武术',
  heritage_tags: ['非遗', '武术', '健身'],
  heritage_image:
    'https://tse3-mm.cn.bing.net/th/id/OIP-C.LHTSPRtPI1ZcHyPfKg5--AHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  heritage_desc:
    '荣昌缠丝拳是重庆市级非遗，民间传统武术，刚柔并济、攻防兼备，可强身健体，历史悠久，是地方民俗体育与传统武学文化重要载体。',
  score: 4.5,
  price: 58.0,
  reserve_weeks: 5,
  experience_duration: 60,
  notice: '穿着舒适运动鞋，动作幅度适中，听从教练口令。',
  suitable_people: '青少年、成人',
  heritage_level: '市级',
  heritage_address: '荣昌区体育馆',
  story_id: 13,
  inheritor_id: 1,
  shelf_status: 1,
  created_time: '2026-04-19T13:54:35.026635+00:00',
  updated_time: '2026-04-19T13:54:35.026635+00:00',
  comments: null,
};

const HeritageManage = () => {
  const navigate = useNavigate();
  const {
    inheritorNav = '/inheritorCenter/heritageManage/heritageAdd',
    heritageTypeOptions = [],
    heritageTagsOptions = [],
    humanStoriesOptions = [],
    myHeritageList = [],
  } = useOutletContext() || {};

  // 传承项目表单
  const { form, formFields, initialValues } = useAddHeritageForm({
    addHeritage,
    heritageTypeOptions,
    heritageTagsOptions,
    humanStoriesOptions,
  });

  return (
    <div>
      {/* 新增页面 */}
      {inheritorNav === '/inheritorCenter/heritageManage/heritageAdd' && (
        <div>
          <div className="text-2xl font-semibold mb-4">新增传承项目</div>

          {/* 新增表单 */}
          <div className="w-310 py-6 border border-slate-200 bg-white rounded-2xl">
            <CommonForm
              formType="add"
              form={form}
              maxWidth={1000}
              initialValues={initialValues || {}}
              formFields={formFields || []}
            />

            {/* 新增/编辑按钮 */}
            <div className="w-30 mx-auto">
              <div className="btn2">新增</div>
            </div>
          </div>
        </div>
      )}

      {/* 传承项目列表 */}
      {inheritorNav === '/inheritorCenter/heritageManage/heritageList' && (
        <div>
          <div className="text-2xl font-semibold mb-4">传承项目列表</div>

          {/* 筛选和搜索 */}

          {myHeritageList.length > 0 ? (
            <div className="w-full px-8 py-4 mx-auto grid grid-cols-3 gap-y-10 gap-x-30">
              {myHeritageList.map((item) => {
                // 组装Card组件需要的数据
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
                  category: 1,
                  content: {
                    label: ['预约周期', '体验时长', '适合人群'],
                    contents: [
                      `提前${item.reserve_weeks}天`,
                      `${item.experience_duration}分钟`,
                      `${item.suitable_people}`,
                    ],
                  },
                  btn: [3, 4],
                };

                // 给每个Card传递对象并添加key
                return (
                  <Card
                    key={item.heritage_id}
                    boxStyle={boxStyle}
                    cardData={cardData}
                    onClick={() =>
                      navigate(`/intangibleHeritageDetail/${item.heritage_id}`)
                    }
                  />
                );
              })}
            </div>
          ) : (
            <NoData />
          )}
        </div>
      )}
    </div>
  );
};

export default HeritageManage;
