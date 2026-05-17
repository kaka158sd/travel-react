import { NoData, Title } from '@/components';
import {
  generateItinerary,
  getItineraryStorage,
  isFirstVisitToday,
  rulesParse,
  setItineraryStorage,
} from '@/utils';
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
  message,
} from 'antd';
import {
  DeleteOutlined,
  FolderOpenOutlined,
  SendOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCustomItemsAPI, updateCustomItemAPI } from '@/apis/trip';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomItem } from '@/store';
import { useWatch } from 'antd/es/form/Form';
import { getScenicSpotsAPI } from '@/apis/scenic_spots';
import { getIntangibleHeritageAPI } from '@/apis/intangible_heritage';

// 标题数据
const titleData = {
  title: '规划行程',
  desc: '',
};

const MyTrips = () => {
  const [tripForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 获取规划行程相关的数据
  const { customItem = [] } = useSelector((state) => state.customItem);
  // 选择的人群类型，控制人数的输入禁止与否
  const crowdType = useWatch('crowd_type', tripForm);
  // 判断是否为单人模式
  const isSinglePerson = crowdType === 4;

  const [spotList, setSpotList] = useState([]);
  const [heritageList, setHeritageList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // 行程方案
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  // 每天第一次进入清空，否则读取本地
  useEffect(() => {
    let timer;

    // 判断是否是今天第一次进入
    const firstVisit = isFirstVisitToday();

    if (firstVisit) {
      console.log('今天第一次进入页面->清空行程');
      timer = setTimeout(() => {
        setGeneratedItinerary(null);
        setItineraryStorage('');
      }, 0);
    } else {
      console.log('读取本地存储');
      const localData = getItineraryStorage();
      if (localData) {
        timer = setTimeout(() => {
          setGeneratedItinerary(localData);
        }, 0);
      }
    }

    return () => clearTimeout(timer);
  }, []);
  // 监听方案变化，从本地中读取
  useEffect(() => {
    let timer;
    const item = getItineraryStorage();
    if (generatedItinerary !== item) {
      timer = setTimeout(() => {
        setGeneratedItinerary(item);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [generatedItinerary]);

  // 获取接口数据
  useEffect(() => {
    const getSpotList = async () => {
      try {
        const res = await getScenicSpotsAPI();
        setSpotList(res.data);
      } catch (error) {
        console.error('获取景点列表失败！', error);
      }
    };
    const getHeritageList = async () => {
      try {
        const res = await getIntangibleHeritageAPI();
        setHeritageList(res.data);
      } catch (error) {
        console.error('获取非遗列表失败！', error);
      }
    };

    getSpotList();
    getHeritageList();
  }, []);

  // 在页面渲染之前给自定义全局变量赋值
  useEffect(() => {
    const getCustomItemsList = async () => {
      try {
        const res = await getCustomItemsAPI();
        dispatch(setCustomItem(res.data));
        // console.log(res.data);
      } catch (err) {
        console.error('获取自定义接口数据失败！', err);
      }
    };

    getCustomItemsList();
  }, [dispatch]);

  // 监听表单的人群类型是否为独自，实则设置人数为 1
  useEffect(() => {
    if (isSinglePerson) {
      tripForm.setFieldValue('people_count', 1);
    }
  }, [isSinglePerson, tripForm]);

  // 自定义项目景点、非遗相关配置
  const customTypeConfig = [
    {
      icon: 'icon-jingdian',
      title: '景点',
      items: Array.isArray(customItem)
        ? customItem
            .filter(
              (item) => item.business_type === 1 && item.is_added_to_custom,
            )
            .map((item) => ({ ...item, key: item.custom_item_id }))
        : [],
    },
    {
      icon: 'icon-hot-for-atmosphere',
      title: '非遗',
      items: Array.isArray(customItem)
        ? customItem
            .filter(
              (item) => item.business_type === 2 && item.is_added_to_custom,
            )
            .map((item) => ({ ...item, key: item.custom_item_id }))
        : [],
    },
  ];

  // 自定义项目中的标签多选
  const [multipleSelectedTags, setMultipleSelectedTags] = useState([]);
  useEffect(() => {
    let timer;

    if (Array.isArray(customItem)) {
      const selectedIds = customItem
        .filter((item) => item.is_added_to_trip === true)
        .map((item) => item.custom_item_id);

      timer = setTimeout(() => {
        setMultipleSelectedTags(selectedIds);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [customItem]);

  // 封装更新数据的接口请求，并异步全局变量
  async function fetchData(id, data) {
    // 自定义项目
    try {
      await updateCustomItemAPI(id, data);

      const updatedItems = customItem.map((item) =>
        item.custom_item_id === id ? { ...item, ...data } : item,
      );

      dispatch(setCustomItem(updatedItems));
    } catch (error) {
      console.error('更新自定义数据失败！', error);
    }
  }

  // 处理需要传递的数据
  const customData =
    customItem.length > 0
      ? customItem.map((item) => {
          return {
            ...item,
            is_custom_item: true,
          };
        })
      : [];
  const spotData = spotList.map((item) => {
    return {
      business_type: 1,
      business_id: item.spot_id,
      business_name: item.spot_name,
      price: item.ticket_price,
      is_custom_item: false,
    };
  });
  const heritageData = heritageList.map((item) => {
    return {
      business_type: 2,
      business_id: item.heritage_id,
      business_name: item.heritage_name,
      price: item.price,
      is_custom_item: false,
    };
  });
  const systemData = [...spotData, ...heritageData];

  // 生成生成点击事件:获取生成行程表单数据
  const handleGenerateIhinerary = async () => {
    try {
      const values = await tripForm.validateFields();
      // console.log('生成行程表单的全部值', values);
      // console.log('实际传递给生成器的自定义项目：', customData);

      const itinerary = await generateItinerary(values, customData, systemData);

      if (itinerary) {
        // console.log('最终行程：', itinerary);
        setGeneratedItinerary(itinerary);
        setItineraryStorage(itinerary);
      }
    } catch (error) {
      console.error('生成行程表单操作失败！', error);
    }
  };

  // 自定义项目区的onChange事件
  const handleCheckTag = (value) => {
    setMultipleSelectedTags(value);

    // 拿到上一次的选中状态
    const prevSelected = multipleSelectedTags;

    // 找到新增的项
    const clickedTagValue = value.find((v) => !prevSelected.includes(v));
    // 找到移除的项
    const removedTagValue = prevSelected.find((v) => !value.includes(v));

    // console.log('你点击的标签ID：', clickedTagValue);
    // console.log('你点击removedTagValue：', removedTagValue);
    if (clickedTagValue) {
      fetchData(clickedTagValue, { is_added_to_trip: true });
    }
    if (removedTagValue) {
      fetchData(removedTagValue, { is_added_to_trip: false });
    }
    // console.log('value', value);
    // console.log('标签：', multipleSelectedTags);
  };

  // 行程预览区的按钮配置
  const tripPlanBtnConfig = [
    {
      title: '清空行程',
      color: 'danger',
      icon: <DeleteOutlined />,
      onClick: () => {
        setGeneratedItinerary(null);
        setItineraryStorage(null);
      },
    },
  ];

  // 处理导出行程方案点击事件
  const handleExportPlan = () => {
    if (!generatedItinerary) {
      messageApi.info('还未生成行程方案，请点击左侧「生成行程」按钮');
      return;
    }

    // 自定义文本格式
    let text = `${generatedItinerary.trip_name}\n`;
    text += `出行人数：${generatedItinerary.people_count}人\n`;
    text += `总价：${generatedItinerary.totalPrice}元\n`;
    text += `出行日期：${generatedItinerary.trip_start_time} ~ ${generatedItinerary.trip_end_time}\n`;
    text += `\n===== 行程明细 =====\n`;

    // 按天数分组整理
    const days = {};
    generatedItinerary.business_items.forEach((item) => {
      if (!days[item.trip_day]) days[item.trip_day] = [];
      days[item.trip_day].push(item);
    });

    // 生成按天的行程文本
    Object.keys(days)
      .sort()
      .forEach((day) => {
        text += `\n第${day}天：\n`;
        days[day].forEach((item) => {
          const priceStr = item.price === 0 ? '免费' : `￥${item.price}元`;
          text += `📅  ${item.item_time} ${item.item_name} (${priceStr})\n`;
        });
      });

    // 创建 Blob
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    // 创建下载链接并触发下载
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedItinerary.trip_name}.txt`;
    a.click();

    // 释放内存
    URL.revokeObjectURL(url);
  };

  // 处理自定义项目区的清空自定义项目点击事件
  const handleClearCustom = async (title, items) => {
    // 提示框
    const confirm = window.confirm(`是否要清空自定义区的${title}项目?`);

    // 需要清空则将该类型下的所有数据都进行修改
    // console.log('items', items);

    if (confirm) {
      await Promise.all(
        items.map((item) =>
          fetchData(item.custom_item_id, {
            is_added_to_custom: false,
            is_added_to_trip: false,
          }),
        ),
      );

      messageApi.success(`清空${title}自定义项目成功！`);
    }
  };

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
                  <InputNumber
                    min={1}
                    precision={0}
                    style={{ width: 140 }}
                    disabled={isSinglePerson}
                  />
                </Form.Item>

                <Form.Item>
                  {/* 按钮 */}
                  <div className="w-50 flex items-center gap-8 mx-auto">
                    {/* 生成行程 */}
                    <div className="btn2" onClick={handleGenerateIhinerary}>
                      生成行程
                    </div>

                    {/* 重置 */}
                    <Button onClick={() => tripForm.resetFields()}>重置</Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>

          {/* 行程预览 */}
          <div className="flex-1 border-2 rounded-xl border-amber-600 px-6 py-4">
            {contextHolder}

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
                      onClick={() => item.onClick()}
                    />
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* 预览区 */}
            <div className="w-full h-100 border rounded-lg bg-neutral-50 p-4 mt-4 overflow-y-auto">
              {/* 打印行程方案 */}
              {/* 预览区 */}
              {generatedItinerary ? (
                <div className="space-y-4">
                  {/* 行程标题 */}
                  <div className="text-center border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">
                      {generatedItinerary.trip_name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      旅行时间：{generatedItinerary.trip_start_time} -{' '}
                      {generatedItinerary.trip_end_time}
                    </p>
                  </div>

                  {/* 按天分组的行程列表 */}
                  <div className="space-y-6">
                    {
                      // 先按 trip_day 分组
                      Object.entries(
                        generatedItinerary.business_items.reduce(
                          (acc, item) => {
                            if (!acc[item.trip_day]) acc[item.trip_day] = [];
                            acc[item.trip_day].push(item);
                            return acc;
                          },
                          {},
                        ),
                      ).map(([day, items]) => (
                        <div key={day} className="space-y-2">
                          {/* 第几天的标题 */}
                          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                              第{day}天
                            </span>
                          </h3>
                          {/* 当天项目列表 */}
                          <div className="space-y-2 pl-4">
                            {items.map((item) => (
                              <div
                                key={item.sort_num}
                                className="flex justify-between items-center py-2 border-b border-gray-100"
                              >
                                <div className="flex items-center gap-3">
                                  {/* 时间 + 项目名 */}
                                  <span className="text-gray-600 text-sm">
                                    📅 {item.item_time}
                                  </span>
                                  <span className="text-gray-800">
                                    {item.item_name}
                                    {item.is_custom_item && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                        自定义
                                      </span>
                                    )}
                                  </span>
                                </div>
                                {/* 价格 */}
                                {item.price > 0 ? (
                                  <span className="text-gray-600 text-sm">
                                    ￥{item.price}/人
                                  </span>
                                ) : (
                                  <span className="text-gray-600 text-sm">
                                    免费
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  {/* 总价区域 */}
                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="font-medium">
                        行程项目总价：
                        {generatedItinerary.business_items
                          .map((item) => `${item.item_name} ¥${item.price}`)
                          .join(' + ')}
                        {'  '}x
                        <span className="text-base text-blue-400 ml-2">
                          {generatedItinerary.people_count} 人
                        </span>
                      </span>
                      <span className="font-bold text-lg text-amber-700">
                        = ￥{generatedItinerary.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full text-gray-400 flex justify-center items-center text-base">
                  请点击「生成行程」按钮预览行程方案
                </div>
              )}
            </div>

            {/* 导出行程、路线推荐 */}
            <div className="flex gap-6 mt-4">
              <Button
                color="primary"
                shape="round"
                icon={<FolderOpenOutlined />}
                variant="outlined"
                onClick={handleExportPlan}
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
            {customTypeConfig
              .filter((item) => item.items.length > 0)
              .map((item) =>
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
                        <ClearOutlined
                          className="cursor-pointer text-xl text-color1"
                          onClick={() =>
                            handleClearCustom(item.title, item.items)
                          }
                        />
                      </Tooltip>
                    </div>

                    {/* 自定义项目内容,只能清空全部 */}
                    <div className="flex gap-8 my-4">
                      <Tag.CheckableTagGroup
                        multiple
                        options={item.items.map((item) => {
                          return {
                            label: item.business_name,
                            value: item.custom_item_id,
                          };
                        })}
                        value={multipleSelectedTags}
                        onChange={handleCheckTag}
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
                  <NoData key={item.title} />
                ),
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
