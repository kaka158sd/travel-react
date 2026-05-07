import { Card, DataField, LookMore, NoData } from '@/components';
import './index.less';
import { Popover, message, Table, Tag, Space, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

// 功能卡片配置
const featureCardFields = [
  {
    key: 'myTrips',
    icon: 'icon-kongzhonghuayuan',
    title: '规划行程',
    desc: '定制您的荣昌深度游路线',
  },
  {
    key: 'myOrders',
    icon: 'icon-order',
    title: '我的订单',
    desc: '查看您的荣昌旅游订单',
  },
  {
    key: 'myComments',
    icon: 'icon-yanziwancheng',
    title: '我的评论',
    desc: '分享体验，帮助更多游客',
  },
];

// 订单的状态通用样式项列表
const statusStyle = [
  { status: 0, color: 'cyan', text: '待支付' },
  { status: 1, color: 'blue', text: '待核销' },
  { status: 2, color: 'green', text: '已完成' },
  { status: 3, color: 'grey', text: '已取消' },
  { status: 4, color: 'orange', text: '已过期' },
  { status: 5, color: 'red', text: '已退款' },
];
// 订单操作按钮样式
const actionsStyle = [
  { key: 1, text: '支付', status: 0, color: 'text-green-500' },
  { key: 2, text: '取消', status: 0, color: 'text-gray-500' },
  { key: 3, text: '完成', status: 1, color: 'text-sky-500' },
  { key: 4, text: '申请退款', status: 1, color: 'text-red-500' },
  { key: 5, text: '查看详情', status: 2, color: 'text-black' },
  { key: 6, text: '评论', status: 2, color: 'text-black' },
];

// 订单表格数据-筛选该游客的订单的前10项渲染
const orderDataSource = [
  {
    key: 1,
    order_id: 1,
    tourist_id: 1,
    inheritor_id: null,
    business_type: 1,
    business_id: 1,
    item_name: '万灵古镇',
    single_price: 40.0,
    reserve_time: '2026-05-11',
    reserve_period: '09:00-12:00',
    contact_people: '刘六',
    contact_phone: '13800001111',
    total_price: 40.0,
    people_num: 1,
    remark: null,
    order_status: 0,
    order_time: '2026-04-19T13:54:35.026635+00:00',
  },
  {
    key: 2,
    order_id: 2,
    tourist_id: 1,
    inheritor_id: 1,
    business_type: 2,
    business_id: 1,
    item_name: '荣昌陶烧制技艺',
    single_price: 128.0,
    reserve_time: '2026-05-01',
    reserve_period: '14:00-16:00',
    contact_people: '刘六',
    contact_phone: '13800001111',
    total_price: 256.0,
    people_num: 2,
    remark:
      '师傅您好！我本次专程前来体验荣昌陶制作技艺，内心十分期待沉浸式感受非遗手工的独特魅力。我零基础入门，陶艺动手经验比较欠缺，操作起来可能会有些生疏笨拙，麻烦您教学时可以多一些耐心，放慢讲解节奏，细致示范每一步制作流程。\r\n我希望本次体验以**红色主题**为创作核心，亲手制作一款陶瓷水杯。希望在塑形、雕花、装饰与配色设计上，融入红色文化元素，贴合主题风格。过程中若我操作有误，还请您及时指正、耐心引导，帮我完成这款专属的红色主题陶杯，用心感受荣昌陶千年匠心与红色文化结合的独特韵味。',
    order_status: 0,
    order_time: '2026-04-19T13:54:35.026635+00:00',
  },
];

const orderColumns = [
  {
    title: '项目名称',
    dataIndex: 'item_name',
    key: 'item_name',
  },
  {
    title: '预约时间',
    dataIndex: 'reserve_time',
    key: 'reserve_time',
  },
  {
    title: '预约时段',
    dataIndex: 'reserve_period',
    key: 'reserve_period',
  },
  {
    title: '订单状态',
    dataIndex: 'order_status',
    key: 'order_status',
    render: (_, { order_status }) => (
      <div>
        <Tag
          color={
            statusStyle.find((item) => item.status === order_status)?.color ||
            'cyan'
          }
          variant="filled"
        >
          {statusStyle.find((item) => item.status === order_status)?.text ||
            '待支付'}
        </Tag>
      </div>
    ),
  },
  {
    title: '订单操作',
    key: 'actions',
    render: (_, record) => (
      <Space size="large">
        {actionsStyle.map((item) =>
          item.status === record.order_status ? (
            <div key={item.key} className={`cursor-pointer ${item.color}`}>
              {item.text}
            </div>
          ) : (
            <></>
          ),
        )}
      </Space>
    ),
  },
];

const TouristCenter = () => {
  // 全局消息
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // 数据卡片的配置
  const dataCardFields = [
    {
      cardData: {
        iconColor: 0,
        icon: 'icon-favorite',
        title: '我的收藏',
        data: 2,
      },
      onClick: () => navigate('/touristCenter/myFavorites'),
    },
    {
      cardData: {
        iconColor: 2,
        icon: 'icon-quanqiukuajing',
        title: '我的好友',
        data: 22,
      },
      onClick: () => {
        messageApi.info(`你目前有 22 个好友~`);
      },
    },
    {
      cardData: {
        iconColor: 3,
        icon: 'icon-financial_fill',
        title: '我的钱包',
        data: 158,
      },
      onClick: () => {
        messageApi.open({
          type: 'success',
          content: `钱包余额: ￥158 元`,
        });
      },
    },
  ];

  return (
    <div className="bg-slate-100">
      <div className="w-260 h-fit rounded-lg mx-auto border border-amber-300 bg-slate-50 py-0.75 px-8">
        {/* 个人信息展示 */}
        <div className="w-full px-8 py-4 backgroundImage rounded-2xl flex items-center relative">
          {/* 头像 */}
          <DataField
            type="avatar"
            formConfig={{ src: '', size: 100 }}
            className="cursor-pointer"
          />

          {/* 用户名与个性签名 */}
          <div className="text-white ml-6">
            <div className="text-2xl mb-3">游客</div>
            <p className="line-clamp-2 opacity-85">
              我的个性签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名
            </p>
          </div>

          <Tooltip title="编辑">
            <i
              className="iconfont icon-bianji1 text-white absolute top-1.5 right-4 cursor-pointer hover:text-orange-600"
              style={{ fontSize: 30 }}
            />
          </Tooltip>
        </div>

        {/* 数据卡片 */}
        <div className="flex justify-between items-center my-7 px-6 relative">
          {contextHolder}
          {dataCardFields.map((item, index) => {
            const boxStyle = {
              width: 'w-[260px]',
            };
            const cardData = {
              mode: 3,
              iconType: 1,
              iconColor: item.cardData.iconColor,
              icon: item.cardData.icon,
              title: item.cardData.title,
              data: item.cardData.data,
            };

            return (
              <Card
                key={index}
                boxStyle={boxStyle}
                cardData={cardData}
                className={`shrink-0 ${index === 2 ? 'ml-auto' : ''}`}
                onClick={item.onClick}
              />
            );
          })}

          <span className="absolute right-0 w-0 h-0" />
          {/* 钱包充值按钮 */}
          <Popover content="点击可充值200-500元哦！">
            <i
              className="iconfont icon-icon1 text-yellow-400 absolute -top-5 right-10 cursor-pointer hover:scale-110"
              style={{ fontSize: 36 }}
            />
          </Popover>
        </div>

        {/* 功能卡片 */}
        <div className="flex justify-between items-center my-7">
          {featureCardFields.map((item) => {
            const boxStyle = {
              width: 'w-[300px]',
            };
            const cardData = {
              mode: 1,
              iconType: 3,
              icon: item.icon,
              title: item.title,
              desc: item.desc,
            };

            return (
              <Card
                key={item.key}
                boxStyle={boxStyle}
                cardData={cardData}
                onClick={() => navigate(`/touristCenter/${item.key}`)}
              />
            );
          })}
        </div>

        {/* 订单表格 */}
        <div className="border border-gray-200 rounded-lg shadow-sm mb-20">
          <div className="w-full flex justify-between items-center py-4 px-6">
            <div className="title2">最近订单</div>
            <LookMore path={''} style="no" />
          </div>

          <Table
            dataSource={orderDataSource}
            columns={orderColumns}
            size="large"
            pagination={false}
            locale={{ emptyText: <NoData width="my-14" /> }}
          />
        </div>
      </div>
    </div>
  );
};

export default TouristCenter;
