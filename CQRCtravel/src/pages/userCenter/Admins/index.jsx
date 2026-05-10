import { useEffect, useState } from 'react';
import './index.less';
import { Menu, Table } from 'antd';
import { Card, LoadError, Loading } from '@/components';
import { getScenicSpotsAPI } from '@/apis/scenic_spots';
import { getIntangibleHeritageAPI } from '@/apis/intangible_heritage';
import { getNewsAPI } from '@/apis/news';
import { getUsersAPI } from '@/apis/users';
import { getActivitiesAPI } from '@/apis/activities';
import dayjs from 'dayjs';
import SpotManage from './SpotManage';
import ActivityManage from './ActivityManage';
import NewsManage from './NewsManage';
import PeopleManage from './PeopleManage';
import Account from './Account';

// 导航菜单栏的导航项
const inlineNavItems = [
  {
    key: 'console',
    label: '控制台',
    icon: (
      <i className="iconfont icon-shouye-zhihui" style={{ fontSize: 20 }} />
    ),
  },
  { type: 'divider' },
  {
    key: 'spot',
    label: '景点管理',
    icon: <i className="iconfont icon-dingwei2" style={{ fontSize: 20 }} />,
    children: [
      {
        key: 'spotAdd',
        label: '新增景点',
      },
      {
        key: 'spotList',
        label: '景点列表',
      },
    ],
  },
  { type: 'divider' },
  {
    key: 'activity',
    label: '活动管理',
    icon: (
      <i className="iconfont icon-RectangleCopy1" style={{ fontSize: 24 }} />
    ),
  },
  { type: 'divider' },
  {
    key: 'new',
    label: '新闻管理',
    icon: (
      <i className="iconfont icon-RectangleCopy" style={{ fontSize: 24 }} />
    ),
  },
  { type: 'divider' },
  {
    key: 'people',
    label: '人员管理',
    icon: (
      <i className="iconfont icon-RectangleCopy3" style={{ fontSize: 24 }} />
    ),
  },
  { type: 'divider' },
  {
    key: 'account',
    label: '个人资料',
    icon: <i className="iconfont icon-shenfen" style={{ fontSize: 20 }} />,
  },
  { type: 'divider' },
  {
    key: 'layout',
    label: '退出登陆',
    icon: <i className="iconfont icon-shut-down" style={{ fontSize: 20 }} />,
  },
];

// 最近活动的表格栏
const activityColumns = [
  {
    title: '活动ID',
    dataIndex: 'activity_id',
    key: 'activity_id',
  },
  {
    title: '活动名称',
    dataIndex: 'activity_name',
    key: 'activity_name',
  },
  {
    title: '关联名称',
    dataIndex: 'relate_name',
    key: 'relate_name',
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
  },
  {
    title: '活动地址',
    dataIndex: 'address',
    key: 'address',
  },
];

const AdminCenter = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // 导航菜单
  const [adminNav, setAdminNav] = useState('console');
  // 获取接口数据
  const [scenicSpots, setScenicSpots] = useState([]);
  const [intangibleHeritage, setIntangibleHeritage] = useState([]);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let timer = [];
    const getScenicSpotsList = async () => {
      try {
        setLoading(true);
        const res = await getScenicSpotsAPI();
        setScenicSpots(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
    const getIntangibleHeritageList = async () => {
      try {
        setLoading(true);

        const res = await getIntangibleHeritageAPI();
        setIntangibleHeritage(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
    const getNewsList = async () => {
      try {
        setLoading(true);

        const res = await getNewsAPI();
        setNews(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
    const getUsersList = async () => {
      try {
        setLoading(true);

        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
    const getActivitiesList = async () => {
      try {
        setLoading(true);

        const res = await getActivitiesAPI();
        setActivities(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    getScenicSpotsList();
    getIntangibleHeritageList();
    getNewsList();
    getUsersList();
    getActivitiesList();

    return () => clearTimeout(timer);
  }, []);

  // 适于select的options
  const scenicSpotsOptions = scenicSpots?.map((item) => ({
    value: item.spot_id,
    label: item.spot_name,
  }));
  const intangibleHeritageOptions = intangibleHeritage?.map((item) => ({
    value: item.heritage_id,
    label: item.heritage_name,
  }));

  // 数据卡片的配置
  const adminDataCard = [
    {
      title: '景点总数',
      icon: 'icon-dujia',
      iconColor: 0,
      data: scenicSpots.length,
    },
    {
      title: '非遗总数',
      icon: 'icon-chuntianran',
      iconColor: 1,
      data: intangibleHeritage.length,
    },
    {
      title: '新闻总数',
      icon: 'icon-notification',
      iconColor: 2,
      data: news.length,
    },
    {
      title: '人员总数',
      icon: 'icon-RectangleCopy2',
      iconColor: 3,
      data: users.length,
    },
  ];

  // 活动的开始、结束时间处理
  const activitiesData = activities
    .map((item) => {
      return {
        ...item,
        key: item.activity_id,
        start_time: dayjs(item.start_time).format('YYYY-MM-DD'),
        end_time: dayjs(item.end_time).format('YYYY-MM-DD'),
      };
    })
    .reverse();

  // 处理导航点击事件，包含退出登陆
  const handleMenuClick = (e) => {
    const key = e.key;

    if (key === 'layout') {
      console.log('退出登陆');
      return;
    }

    setAdminNav(key);
  };

  if (loading)
    return (
      <div className="py-30">
        <Loading />
      </div>
    );

  if (error) return <LoadError />;

  return (
    <div>
      {/* 导航栏 */}
      <div className="py-4 px-6 shadow bglinear flex justify-between items-center">
        <div className="flex gap-4 items-center cursor-default">
          <i
            className="iconfont icon-company-fill w-12 h-12 bg-amber-50 text-color1 text-center rounded"
            style={{ fontSize: 30 }}
          />
          <div className="text-2xl font-semibold">文旅局管理</div>
        </div>

        {/* 返回首页按钮 */}
        <div className="w-20 h-8">
          <div className="btn1 flex items-center justify-center">首页</div>
        </div>
      </div>

      {/* 侧边栏 */}
      <div className="w-full flex py-1">
        <Menu
          selectedKeys={adminNav}
          style={{ width: 240, fontSize: 16 }}
          mode="inline"
          items={inlineNavItems}
          className="h-screen"
          onClick={handleMenuClick}
        />

        <div className="py-8 flex-1 px-10 mr-6">
          {/* 控制台 */}
          {adminNav === 'console' && (
            <div>
              {/* 数据卡片 */}
              <div className="flex justify-between">
                {adminDataCard.map((item) => {
                  const boxStyle = {
                    width: 'w-[280px]',
                    padding: 'py-4 px-10',
                    gap: 'gap-2',
                  };

                  const cardData = {
                    mode: 3,
                    iconType: 3,
                    iconColor: item.iconColor,
                    icon: item.icon,
                    title: item.title,
                    data: item.data,
                  };

                  return (
                    <Card
                      key={item.title}
                      boxStyle={boxStyle}
                      cardData={cardData}
                    />
                  );
                })}
              </div>

              {/* 最近活动 */}
              <div className="py-8">
                <div className="text-xl font-semibold mb-4">最近活动</div>
                <div className="px-4 mr-4">
                  <Table
                    columns={activityColumns}
                    dataSource={activitiesData.slice(0, 10)}
                    pagination={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 景点管理 */}
          <SpotManage adminNav={adminNav} scenicSpots={scenicSpots} />

          {/* 活动管理 */}
          <ActivityManage
            adminNav={adminNav}
            activities={activities}
            scenicSpotsOptions={scenicSpotsOptions}
            intangibleHeritageOptions={intangibleHeritageOptions}
          />

          {/* 新闻管理 */}
          <NewsManage adminNav={adminNav} news={news} />

          {/* 人员管理 */}
          <PeopleManage adminNav={adminNav} users={users} />

          {/* 个人资料 */}
          <Account adminNav={adminNav} />
        </div>
      </div>
    </div>
  );
};

export default AdminCenter;
