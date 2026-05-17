import { Menu } from 'antd';
import './index.less';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  getHeritageTagsAPI,
  getHeritageTypeAPI,
  getIntangibleHeritageAPI,
} from '@/apis/intangible_heritage';
import { getHumanStoriesAPI } from '@/apis/human_stories';
import { useNavKey } from '@/hook/useNavKey';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setHeritage } from '@/store';
import { clearLocalStorage } from '@/utils';
import { getOrdersAPI } from '@/apis/orders';

// 导航菜单栏的导航项
const inlineNavItems = [
  {
    key: '/inheritorCenter',
    label: '控制台',
    icon: (
      <i className="iconfont icon-shouye-zhihui" style={{ fontSize: 20 }} />
    ),
  },
  { type: 'divider' },
  {
    key: '/inheritorCenter/orderManage',
    label: '订单管理',
    icon: <i className="iconfont icon-dingdan" style={{ fontSize: 20 }} />,
  },
  { type: 'divider' },
  {
    key: '/inheritorCenter/heritageManage',
    label: '传承项目管理',
    icon: <i className="iconfont icon-zhiwu" style={{ fontSize: 20 }} />,
    children: [
      {
        key: '/inheritorCenter/heritageManage/heritageAdd',
        label: '新增传承项目',
      },
      {
        key: '/inheritorCenter/heritageManage/heritageList',
        label: '传承项目列表',
      },
    ],
  },
  { type: 'divider' },
  {
    key: '/inheritorCenter/inheritorAccount',
    label: '账户信息',
    icon: <i className="iconfont icon-shenfen" style={{ fontSize: 20 }} />,
  },
  { type: 'divider' },
  {
    key: 'layout',
    label: '退出登陆',
    icon: <i className="iconfont icon-shut-down" style={{ fontSize: 20 }} />,
  },
];

const InheritorCenter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    inheritorId = 0,
    currentUser = {},
    userPrivacyData = {},
  } = useSelector((state) => state.user);
  const { heritage = [] } = useSelector((state) => state.heritage);

  // 传承人用户信息
  const user = {
    identity_type: currentUser.identity_type,
    user_name: currentUser.user_name,
    phone: currentUser.phone,
    password: currentUser.password,
    avatar: currentUser.avatar,
    // 传承人特有的数据-个人简介,传承级别.从事领域
    privacyData: [
      userPrivacyData.personal_profile,
      userPrivacyData.inherit_level,
      userPrivacyData.field,
    ],
  };

  // 菜单导航
  const { activeNav: inheritorNav, updateActiveNav: setInheritorNav } =
    useNavKey(inlineNavItems, 'inheritorNav', '/inheritorCenter');
  // 传承项目二级菜单
  const [heritageNav, setHeritageNav] = useState(
    '/inheritorCenter/heritageManage/heritageAdd',
  );

  // 新增传承项目中的相关接口数据
  const [heritageType, setHeritageType] = useState([]);
  const [heritageTags, setHeritageTags] = useState([]);
  const [humanStories, setHumanStories] = useState([]);
  // 获取非遗列表
  const [orders, setOrders] = useState([]);

  // 封装获取非遗列表的方法
  const getIntangibleHeritageList = async () => {
    try {
      const res = await getIntangibleHeritageAPI();
      dispatch(setHeritage(res.data));
    } catch (error) {
      console.error('获取非遗列表失败', error);
    }
  };

  useEffect(() => {
    const getHeritageType = async () => {
      try {
        const res = await getHeritageTypeAPI();
        setHeritageType(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getHeritageTags = async () => {
      try {
        const res = await getHeritageTagsAPI();
        setHeritageTags(res.data);
      } catch (error) {
        console.error('获取非遗标签失败', error);
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
    const getOrdersList = async () => {
      try {
        const res = await getOrdersAPI();
        setOrders(res.data);
      } catch (error) {
        console.error('获取订单列表失败', error);
      }
    };

    getHeritageType();
    getHeritageTags();
    getHumanStories();
    getOrdersList();
  }, []);

  useEffect(() => {
    const getheritageList = async () => {
      try {
        const res = await getIntangibleHeritageAPI();
        dispatch(setHeritage(res.data));
      } catch (error) {
        console.error('获取非遗列表失败', error);
      }
    };

    getheritageList();
  }, [dispatch]);

  const heritageTypeOptions = heritageType
    ?.filter((item) => userPrivacyData?.field?.includes?.(item.type_name))
    .map((item) => ({
      value: item.type_name,
      label: item.type_name,
    }));
  const heritageTagsOptions = heritageTags?.map((item) => ({
    value: item.tag_name,
    label: item.tag_name,
  }));
  const humanStoriesOptions = humanStories?.map((item) => ({
    value: item.story_id,
    label: item.story_title,
  }));

  // 获取传承列表
  const myHeritageList = useMemo(() => {
    // 先判断是否为数组
    if (!Array.isArray(heritage)) return [];
    // 匹配当前传承人的id的传承项目
    return heritage?.filter((item) => item.inheritor_id === inheritorId);
  }, [heritage, inheritorId]);

  const heritageLength = myHeritageList?.length;

  // 菜单的点击事件，含退出登陆
  const handleMenuClick = (e) => {
    const key = e.key;

    // 退出登陆处理
    if (key === 'layout') {
      dispatch(clearUser());
      clearLocalStorage();
      navigate('/');
      return;
    }

    if (
      key === '/inheritorCenter/heritageManage/heritageAdd' ||
      key === '/inheritorCenter/heritageManage/heritageList'
    ) {
      setHeritageNav(key);
      setInheritorNav(key);
      navigate('/inheritorCenter/heritageManage');
      return;
    }

    // 其他菜单点击后切换菜单
    setInheritorNav(key);
    navigate(`${key}`);
  };

  // 该传承人的订单
  const orderList = orders
    .filter(
      (item) => item.business_type === 2 && item.inheritor_id === inheritorId,
    )
    .sort((a, b) => b.order_id - a.order_id);

  return (
    <div>
      {/* 顶部栏 */}
      <div className="flex justify-between py-4 shadow-xl px-6">
        <div className="text-xl cursor-default">
          <i
            className="iconfont icon-chuntianran text-color1 mr-2 bg-amber-50"
            style={{ fontSize: 26 }}
          />
          <span>文化传承人管理</span>
        </div>

        {/* 返回首页按钮 */}
        <div className="w-20">
          <button className="btn1 text-center" onClick={() => navigate('/')}>
            首页
          </button>
        </div>
      </div>

      {/* 导航菜单 */}
      <div className="mt-1 bg-slate-50 flex">
        <Menu
          selectedKeys={
            inheritorNav === '/inheritorCenter/heritageManage'
              ? heritageNav
              : inheritorNav
          }
          style={{ width: 240, fontSize: 16 }}
          mode="inline"
          items={inlineNavItems}
          className="h-screen"
          onClick={handleMenuClick}
        />

        <div className="w-full pl-10 pr-20 py-6">
          <Outlet
            context={{
              user: user || {},
              currentUser,
              inheritorNav:
                heritageNav || '/inheritorCenter/heritageManage/heritageAdd',
              heritageTypeOptions: heritageTypeOptions || [],
              heritageTagsOptions: heritageTagsOptions || [],
              humanStoriesOptions: humanStoriesOptions || [],
              myHeritageList: myHeritageList || [],
              heritageLength,
              orderList: orderList || [],
              inheritorId,
              userPrivacyData,
              heritage,
              getIntangibleHeritageList,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InheritorCenter;
