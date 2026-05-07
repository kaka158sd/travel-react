import { Title } from '@/components';
import { rulesParse } from '@/utils';
import {
  Checkbox,
  DatePicker,
  Form,
  InputNumber,
  Radio,
  Select,
  Button,
  Tooltip,
  Tag,
  Divider,
} from 'antd';
import {
  StarOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  SendOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// 标题数据
const titleData = {
  title: '规划行程',
  desc: '',
};

// 定制行程方案表单数据
const tripFromData = {
  trip_id: 7,
  tourist_id: 1,
  travel_days: 2,
  interest_preferences: [1, 2],
  crowd_type: 1,
  planned_departure_time: '2025-10-01',
  people_count: 2,
  created_time: '2026-04-20T14:27:43.516169+00:00',
};
// 行程方案生成数据
const tripData = {
  plan_id: 3,
  trip_id: 7,
  business_items: [
    {
      sort_num: 1,
      trip_day: 1,
      item_name: '古佛山',
      item_time: '8:00-11:00',
      is_custom_item: false,
    },
    {
      sort_num: 2,
      trip_day: 1,
      item_name: '万灵古镇',
      item_time: '14:00-17:00',
      is_custom_item: true,
    },
  ],
  trip_start_time: '2025-10-01',
  trip_end_time: '2025-10-02',
  trip_name: '2天荣昌文化之旅',
  created_time: '2026-04-20T14:27:43.516169+00:00',
};
// 自定义项目数据
const customItemsData = [
  {
    custom_item_id: 7,
    tourist_id: 1,
    business_type: 1,
    business_id: 1,
    business_name: '万灵古镇',
    is_added_to_custom: true,
    is_added_to_trip: true,
  },
  {
    custom_item_id: 8,
    tourist_id: 1,
    business_type: 2,
    business_id: 1,
    business_name: '荣昌陶烧制技艺',
    is_added_to_custom: true,
    is_added_to_trip: false,
  },
];

// 行程预览区的按钮配置
const tripPlanBtnConfig = [
  { title: '收藏', color: 'primary', icon: <StarOutlined /> },
  { title: '清空行程', color: 'danger', icon: <DeleteOutlined /> },
];

// 自定义项目景点、非遗相关配置
const customTypeConfig = [
  {
    icon: 'icon-jingdian',
    title: '景点',
    items: customItemsData.filter((item) => item.business_type === 1),
  },
  {
    icon: 'icon-hot-for-atmosphere',
    title: '非遗',
    items: customItemsData.filter((item) => item.business_type === 2),
  },
];

const MyTrips = () => {
  const [tripForm] = Form.useForm();
  const navigate = useNavigate();

  // 自定义项目中的标签多选
  const [multipleSelectedTags, setMultipleSelectedTags] = useState([]);

  return (
    <div>
      <Title titleData={titleData} />

      <div className="max-w-340 mx-auto">
        <div className="w-full h-135 mx-auto mt-6 flex justify-between gap-10">
          {/* 定制行程方案 */}
          <div className="w-120 h-107.5 border-2 rounded-xl border-amber-600 p-4">
            <div className="text-lg font-semibold">定制你的行程</div>

            {/* 定制行程表单 */}
            <div className="py-6 px-4">
              <Form
                name="tripForm"
                form={tripForm}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Form.Item
                  label="出行天数"
                  name="travel_days"
                  rules={rulesParse('required')}
                >
                  <Select
                    placeholder="请选择你要出行的天数..."
                    options={[1, 2, 3, 4, 5].map((item) => ({
                      value: item,
                      label: `${item}天`,
                    }))}
                    style={{ width: 140 }}
                  />
                </Form.Item>

                <Form.Item
                  label="兴趣偏好"
                  name="interest_preferences"
                  rules={rulesParse('optional')}
                >
                  <Checkbox.Group
                    name="interest"
                    options={[
                      {
                        value: 1,
                        label: '古镇人文',
                      },
                      { value: 2, label: '非遗体验' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="人群类型"
                  name="crowd_type"
                  rules={rulesParse('required')}
                >
                  <Radio.Group
                    name="crowdType"
                    size="large"
                    options={[
                      { value: 1, label: '亲子家庭' },
                      { value: 2, label: '情侣出游' },
                      { value: 3, label: '朋友结伴' },
                      { value: 4, label: '独自旅行' },
                      { value: 5, label: '研学团队' },
                      { value: 6, label: '老少皆宜' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="计划出行时间"
                  name="planned_departure_time"
                  rules={rulesParse('required date')}
                >
                  <DatePicker placeholder="请选择日期" style={{ width: 140 }} />
                </Form.Item>

                <Form.Item
                  label="同行人数"
                  name="people_count"
                  rules={rulesParse('required')}
                  initialValue={1}
                >
                  <InputNumber min={1} precision={0} style={{ width: 140 }} />
                </Form.Item>
              </Form>

              {/* 按钮 */}
              <div className="w-50 flex items-center gap-8 mx-auto">
                {/* 生成行程 */}
                <div className="btn2">生成行程</div>

                {/* 重置 */}
                <Button>重置</Button>
              </div>
            </div>
          </div>

          {/* 行程预览 */}
          <div className="flex-1 border-2 rounded-xl border-amber-600 px-6 py-4">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">行程预览</div>

              {/* 操作按钮：收藏、清空 */}
              <div className="flex gap-2">
                {tripPlanBtnConfig.map((item) => (
                  <Tooltip title={item.title} key={item.title}>
                    <Button
                      color={item.color}
                      shape="circle"
                      variant="solid"
                      size="large"
                      icon={item.icon}
                    />
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* 预览区 */}
            <div className="w-full h-100 border rounded-lg bg-neutral-50 p-4 mt-4">
              {/* 打印行程方案 */}
              <div></div>
            </div>

            {/* 导出行程、路线推荐 */}
            <div className="flex gap-6 mt-4">
              <Button
                color="primary"
                shape="round"
                icon={<FolderOpenOutlined />}
                variant="outlined"
              >
                导出行程
              </Button>
              <Button
                color="primary"
                shape="round"
                icon={<SendOutlined />}
                variant="outlined"
                onClick={() => navigate('/itinerary-planning')}
              >
                路线推荐
              </Button>
            </div>
          </div>
        </div>

        {/* 自定义项目 */}
        <div className="py-6">
          <div className="text-lg font-semibold mb-4">
            自定义项目——
            <span className="text-sm font-normal">点击即可加入行程方案中</span>
          </div>

          <div className="px-4">
            {customTypeConfig.map((item) =>
              item.items.length > 0 ? (
                <div key={item.title}>
                  {/* 自定义项目类型 */}
                  <div className="flex items-center gap-10">
                    <div className="w-20 flex justify-center items-center text-base cursor-pointer border-b-2 border-b-amber-200 hover:border hover:border-amber-500 hover:rounded-lg hover:shadow-lg hover:shadow-amber-200">
                      <i
                        className={`iconfont ${item.icon} text-color1`}
                        style={{ fontSize: 22 }}
                      />
                      <span>{item.title}</span>
                    </div>
                    <Tooltip title="清除全部项目">
                      <ClearOutlined className="cursor-pointer text-xl text-color1" />
                    </Tooltip>
                  </div>

                  {/* 自定义项目内容 */}
                  <div className="flex gap-8 my-4">
                    <Tag.CheckableTagGroup
                      multiple
                      options={item.items.map((item) => item.business_name)}
                      value={multipleSelectedTags}
                      onChange={setMultipleSelectedTags}
                      styles={{ item: { fontSize: 14, padding: '4px 10px' } }}
                    />
                  </div>

                  <Divider
                    style={{
                      borderColor:
                        'rgb(203 213 225 / var(--tw-text-opacity, 1))',
                    }}
                  />
                </div>
              ) : (
                <></>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
