import { useEffect, useState } from 'react';
import './index.less';
import { Menu } from 'antd';
import { LoadError, Loading } from '@/components';
import { getScenicSpotsAPI } from '@/apis/scenic_spots';
import { getIntangibleHeritageAPI } from '@/apis/intangible_heritage';
import { getNewsAPI } from '@/apis/news';
import { getUsersAPI } from '@/apis/users';
import { getActivitiesAPI } from '@/apis/activities';
import dayjs from 'dayjs';
import { Outlet, useNavigate } from 'react-router-dom';
import { useNavKey } from '@/hook/useNavKey';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setHeritage, setSpotList } from '@/store';
import { clearLocalStorage } from '@/utils';

// 导航菜单栏的导航项
const inlineNavItems = [
  {
    key: '/adminCenter',
    label: '控制台',
    icon: (
      <i className="iconfont icon-shouye-zhihui" style={{ fontSize: 20 }} />
    ),
  },
  { type: 'divider' },
  {
    key: '/adminCenter/spotManage',
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
    key: '/adminCenter/activityManage',
    label: '活动管理',
    icon: (
      <i className="iconfont icon-RectangleCopy1" style={{ fontSize: 24 }} />
    ),
  },
  { type: 'divider' },
  {
    key: '/adminCenter/newsManage',
    label: '新闻管理',
    icon: (
      <i className="iconfont icon-RectangleCopy" style={{ fontSize: 24 }} />
    ),
  },
  { type: 'divider' },
  {
    key: '/adminCenter/peopleManage',
    label: '人员管理',
    icon: (
      <i className="iconfont icon-RectangleCopy3" style={{ fontSize: 24 }} />
    ),
  },
  { type: 'divider' },
  {
    key: '/adminCenter/account',
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

const AdminCenter = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const { currentUser, adminId, userPrivacyData } = useSelector(
    (state) => state.user,
  );
  const { heritage = [] } = useSelector((state) => state.heritage);
  const { spotList = [] } = useSelector((state) => state.spot);
  // 导航菜单
  const { activeNav: adminNav, updateActiveNav: setAdminNav } = useNavKey(
    inlineNavItems,
    'adminNav',
    '/adminCenter',
  );

  const [spotNav, setSpotNav] = useState('spotAdd');
  const navigate = useNavigate();
  // 获取接口数据
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let timer = [];
    setLoading(true);

    const getNewsList = async () => {
      try {
        const res = await getNewsAPI();
        setNews(res.data);
      } catch (error) {
        console.error('获取新闻列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
    const getUsersList = async () => {
      try {
        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (error) {
        console.error('获取用户列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
    const getActivitiesList = async () => {
      try {
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

    getNewsList();
    getUsersList();
    getActivitiesList();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  // 给全局变量赋值
  useEffect(() => {
    let timer = [];
    setLoading(true);

    const getScenicSpotsList = async () => {
      try {
        const res = await getScenicSpotsAPI();
        dispatch(setSpotList(res.data));
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
        const res = await getIntangibleHeritageAPI();
        dispatch(setHeritage(res.data));
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
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [dispatch]);

  // 封装刷新景点列表的方法
  async function refreshSpotList() {
    try {
      const res = await getScenicSpotsAPI();
      dispatch(setSpotList(res.data));
    } catch (error) {
      console.error('获取景点列表失败', error);
      setError(true);
    }
  }

  // 封装刷新活动列表的方法
  async function refreshActivities() {
    try {
      const res = await getActivitiesAPI();
      setActivities(res.data);
    } catch (error) {
      console.error('获取景点列表失败', error);
      setError(true);
    }
  }

  // 封装刷新新闻列表的方法
  async function refreshNews() {
    try {
      const res = await getNewsAPI();
      setNews(res.data);
    } catch (error) {
      console.error('获取新闻列表失败', error);
      setError(true);
    }
  }

  // 适于select的options
  const scenicSpotsOptions = spotList?.map((item) => ({
    value: item.spot_id,
    label: item.spot_name,
  }));
  const intangibleHeritageOptions = heritage?.map((item) => ({
    value: item.heritage_id,
    label: item.heritage_name,
  }));

  // 数据卡片需要的data
  const cardData = {
    spots: spotList?.length || 0,
    heritage: heritage?.length || 0,
    news: news?.length || 0,
    user: users?.length || 0,
  };

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
    .sort((a, b) => b.activity_id - a.activity_id);

  // 处理导航点击事件，包含退出登陆
  const handleMenuClick = (e) => {
    const key = e.key;

    if (key === 'layout') {
      clearLocalStorage();
      dispatch(clearUser());
      navigate('/');
      return;
    }

    if (key === 'spotAdd' || key === 'spotList') {
      setSpotNav(key);
      navigate('/adminCenter/spotManage');
      setAdminNav(spotNav);
      return;
    }

    setAdminNav(key);
    setSpotNav('spotAdd');
    navigate(`${key}`);
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
          <div
            className="btn1 flex items-center justify-center"
            onClick={() => navigate('/')}
          >
            首页
          </div>
        </div>
      </div>

      {/* 侧边栏 */}
      <div className="w-full flex py-1">
        <Menu
          selectedKeys={
            adminNav === '/adminCenter/spotManage' ? spotNav : adminNav
          }
          style={{ width: 240, fontSize: 16 }}
          mode="inline"
          items={inlineNavItems}
          className="h-screen"
          onClick={handleMenuClick}
        />

        <div className="py-8 flex-1 px-10 mr-6">
          <Outlet
            context={{
              cardData,
              activitiesData,
              adminNav: spotNav || 'spotAdd',
              scenicSpots: spotList || [],
              activities,
              scenicSpotsOptions,
              intangibleHeritageOptions,
              news,
              users,
              refreshSpotList,
              refreshActivities,
              currentUser,
              adminId,
              userPrivacyData,
              refreshNews,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminCenter;
