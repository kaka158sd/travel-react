import { Card, DataField, LookMore, NoData } from '@/components';
import './index.less';
import { Popover, message, Table, Tag, Tooltip } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { statusStyle } from '@/store';
import { isOrderExpired } from '@/utils';
import { useSelector } from 'react-redux';

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

// 获取200-500的随机数
const generateRandomRecharge = () => {
  return parseFloat((Math.floor(Math.random() * 301) + 200).toFixed(2));
};

const TouristCenter = () => {
  const {
    currentUser = {},
    currentTourist = {},
    touristId = 1,
    favoritesDataLength = 0,
    myOrderData = [],
    updateWalletData,
  } = useOutletContext() || {};

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { wallet = 0 } = useSelector((state) => state.wallet);

  // 数据卡片的配置
  const dataCardFields = [
    {
      cardData: {
        iconColor: 0,
        icon: 'icon-favorite',
        title: '我的收藏',
        data: favoritesDataLength || 0,
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
        data: wallet || 0,
      },
      onClick: () => {
        messageApi.open({
          type: 'success',
          content: `钱包余额: ￥${wallet} 元`,
        });
      },
    },
  ];

  // 钱包充值功能
  const handleRecharge = async () => {
    if (!touristId) {
      messageApi.error('未找到游客信息');
      return;
    }

    if (wallet < 0) {
      messageApi.error('钱包异常！');
      return;
    }

    const rechargeMoney = generateRandomRecharge();
    const totalmoney = wallet + rechargeMoney;

    try {
      await updateWalletData(totalmoney);
      messageApi.success(`充值金额：${rechargeMoney}，充值成功！`);
    } catch (error) {
      console.error('充值失败，请重试', error);
    }
  };

  // 订单表格数据-筛选该游客的订单的前10项渲染
  const orderDataSource = myOrderData
    .sort((a, b) => b.order_id - a.order_id)
    .slice(0, 10)
    .map((item) => {
      return {
        ...item,
        key: item.order_id,
      };
    });

  // 订单表格的栏
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
      title: '订单总价',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (text) => <div>{text === 0 ? '免费' : text}</div>,
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (_, record) => {
        const { order_status, reserve_time, reserve_period } = record;

        const isExpired = isOrderExpired(reserve_time, reserve_period);
        if (isExpired) {
          return (
            <div>
              <Tag color="orange" variant="filled">
                已过期
              </Tag>
            </div>
          );
        }

        return (
          <div>
            <Tag
              color={
                statusStyle.find((item) => item.status === order_status)
                  ?.color || 'cyan'
              }
              variant="filled"
            >
              {statusStyle.find((item) => item.status === order_status)?.text ||
                '待支付'}
            </Tag>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-slate-100">
      <div className="w-260 h-fit rounded-lg mx-auto border border-amber-300 bg-slate-50 py-0.75 px-8">
        {contextHolder}

        {/* 个人信息展示 */}
        <div className="w-full px-8 py-4 backgroundImage rounded-2xl flex items-center relative">
          {/* 头像 */}
          <DataField
            type="avatar"
            formConfig={{ src: currentUser.avatar, size: 100 }}
            className="cursor-pointer"
          />

          {/* 用户名与个性签名 */}
          <div className="text-white ml-6">
            <div className="text-2xl mb-3">{currentUser.user_name}</div>
            <p className="line-clamp-2 opacity-85">
              {currentTourist?.signature
                ? currentTourist?.signature
                : '暂无个性签名'}
            </p>
          </div>

          <Tooltip title="编辑">
            <i
              className="iconfont icon-bianji1 text-white absolute top-1.5 right-4 cursor-pointer hover:text-orange-600"
              style={{ fontSize: 30 }}
              onClick={() => navigate('/touristCenter/setting')}
            />
          </Tooltip>
        </div>

        {/* 数据卡片 */}
        <div className="flex justify-between items-center my-7 px-6 relative">
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
          <Popover content="点击可充值 200-500 元哦！">
            <i
              className="iconfont icon-icon1 text-yellow-400 absolute -top-5 right-10 cursor-pointer hover:scale-110"
              style={{ fontSize: 36 }}
              onClick={handleRecharge}
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
            <LookMore path="/touristCenter/myOrders" style="no" />
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
