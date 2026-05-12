import {
  Card,
  DataField,
  DialogCommon,
  LoadError,
  LoadingSkeleton,
  LookMore,
  NoData,
} from '@/components';
import './index.less';
import { Popover, message, Table, Tag, Space, Tooltip } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { getUserStorage, setWalletStorage } from '@/utils';
import { useEffect, useState } from 'react';
import { getTouristsAPI, updateTouristApi } from '@/apis/users';
import { statusStyle } from '@/store';
import { getOrdersAPI } from '@/apis/orders';
import { getFavoritesAPI } from '@/apis/favorites';

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

const TouristCenter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  // 全局消息
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUser, setCurrentUser] = useState(getUserStorage());
  const [tourists, setTourists] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  // 控制弹窗开关
  const [isOpenModal, setIsOpenModal] = useState(false);
  // 弹窗动态配置
  const [modalConfig, setModalConfig] = useState({
    title: '',
    content: '',
    onOk: () => {},
  });
  const [currentTourist, setCurrentTourist] = useState(null);

  useEffect(() => {
    let timer;
    const getTouristsList = async () => {
      try {
        setIsLoading(true);
        const res = await getTouristsAPI();
        setTourists(res.data);
      } catch (error) {
        console.error('获取游客列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 300ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    const getOrdersList = async () => {
      try {
        setIsLoading(true);
        const res = await getOrdersAPI();
        setOrders(res.data);
      } catch (error) {
        console.error('获取订单列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 300ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    const getFavoritesList = async () => {
      try {
        setIsLoading(true);
        const res = await getFavoritesAPI();
        setFavorites(res.data);
      } catch (error) {
        console.error('获取收藏列表失败', error);
        setError(true);
      } finally {
        // 强制等待至少 300ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    getTouristsList();
    getOrdersList();
    getFavoritesList();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (!currentUser?.user_id || tourists.length === 0) return;

    // 获取游客表中的当前用户的数据
    const touristItem = tourists.find(
      (item) => item.user_id === currentUser.user_id,
    );
    if (touristItem) {
      timer = setTimeout(() => {
        setCurrentTourist(touristItem);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [currentUser?.user_id, tourists]);

  // 当前游客的游客id
  const ID = currentTourist?.tourist_id;

  const [wallet, setWallet] = useState(() => {
    return currentTourist?.wallet || 0;
  });

  // 监听 currentTourist 变化，同步更新钱包余额
  useEffect(() => {
    let timer;

    if (currentTourist?.wallet !== undefined) {
      timer = setTimeout(() => {
        setWallet(currentTourist.wallet);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [currentTourist?.wallet]); // 依赖项是钱包余额，变化时自动更新

  // 当前游客的收藏数据
  const favoritesData =
    favorites.filter(
      (item) => item.tourist_id === currentTourist?.tourist_id,
    ) || [];

  // 数据卡片的配置
  const dataCardFields = [
    {
      cardData: {
        iconColor: 0,
        icon: 'icon-favorite',
        title: '我的收藏',
        data: favoritesData?.length,
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
        data: wallet,
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
    if (wallet >= 100) {
      messageApi.warning('余额大于 100 元，暂不支持充值!');
      return;
    }

    if (wallet < 0) {
      messageApi.error('钱包异常！');
      return;
    }

    const rechargeMoney = parseFloat(
      (Math.floor(Math.random() * 301) + 200).toFixed(2),
    );
    const totalmoney = wallet + rechargeMoney;
    try {
      await updateTouristApi(ID, {
        ...currentTourist,
        wallet: totalmoney,
      });

      setWallet(totalmoney);
      setWalletStorage(totalmoney);
      messageApi.success('充值成功！');
    } catch (error) {
      console.error('充值失败，请重试', error);
    }
  };

  // 当前游客的订单数据
  const myOrderData =
    orders.filter((item) => item.tourist_id === currentTourist?.tourist_id) ||
    [];

  // 订单表格数据-筛选该游客的订单的前10项渲染
  const orderDataSource = myOrderData.map((item) => {
    return {
      ...item,
      key: item.order_id,
    };
  });

  // 订单操作按钮样式
  const actionsStyle = [
    {
      key: 1,
      text: '支付',
      status: 0,
      color: 'text-green-500',
    },
    {
      key: 2,
      text: '取消',
      status: 0,
      color: 'text-gray-500',
    },
    {
      key: 3,
      text: '完成',
      status: 1,
      color: 'text-sky-500',
    },
    {
      key: 4,
      text: '申请退款',
      status: 1,
      color: 'text-red-500',
    },
    {
      key: 5,
      text: '查看详情',
      status: 2,
      color: 'text-black',
    },
    {
      key: 6,
      text: '评论',
      status: 2,
      color: 'text-black',
    },
  ];

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
              <div
                key={item.key}
                className={`cursor-pointer ${item.color}`}
                onClick={() => handleOrderActions(item.key, record.total_price)}
              >
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

  // 订单表格的操作
  const handleOrderActions = (key, price) => {
    // 先构建好完整的 config
    let newModalConfig = {};

    if (key === 1) {
      newModalConfig = {
        title: '支付订单',
        content: '是否确认要支付这笔订单',
        onOk: () => handlePay(price),
      };

      console.log(modalConfig);
    }

    setModalConfig(newModalConfig);
    setIsOpenModal(true);
  };

  // 支付操作
  const handlePay = async (price) => {
    const newMoney = wallet - price;
    if (newMoney < 0) {
      messageApi.error('余额不足');
    }
    try {
      await updateTouristApi(ID, {
        ...currentTourist,

        wallet: newMoney,
      });
      setWallet(newMoney);
      setWalletStorage(newMoney);
      messageApi.success('支付成功！');
    } catch (error) {
      console.error('支付失败', error);
    }
    // 关闭弹窗
    setIsOpenModal(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

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
              {currentTourist?.signature}
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
          <Popover content="余额不足 100 时，点击可充值 200-500 元哦！">
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

        {/* 弹窗 */}
        <DialogCommon
          isShowDialog={isOpenModal}
          onOk={modalConfig.onOk}
          dialogData={{
            type: 4,
            title: modalConfig.title,
            content: modalConfig.content,
          }}
          onCancel={() => setIsOpenModal(false)}
        />
      </div>

      <Outlet />
    </div>
  );
};

export default TouristCenter;
