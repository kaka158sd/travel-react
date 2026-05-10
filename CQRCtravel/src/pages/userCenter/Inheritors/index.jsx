import { Menu } from 'antd';
import './index.less';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  getHeritageTagsAPI,
  getHeritageTypeAPI,
  getIntangibleHeritageAPI,
} from '@/apis/intangible_heritage';
import { getHumanStoriesAPI } from '@/apis/human_stories';
import { useNavKey } from '@/hook/useNavKey';

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

// 传承人用户信息
const user = {
  // user_id: 2,
  identity_type: 2,
  user_name: '李传',
  phone: '13800002222',
  password: '123456b',
  avatar:
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.j5tE037__FV15bFR0zwjhgAAAA?w=234&h=212&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  // created_time: '2026-04-20T10:19:55.337782+00:00',
  // 传承人特有的数据-个人简介,传承级别.从事领域
  privacyData: [
    '我是一名热爱旅行、尤其钟情于重庆荣昌文旅风光的游客。喜欢打卡每一处古镇老街，探寻非遗背后的匠人故事，品尝地道的荣昌卤鹅、黄凉粉等特色美食，感受山水间的烟火气。每次来到荣昌，都能被这里的历史文化、自然风光和热情的民风打动，希望用脚步丈量荣昌的每一寸土地，用镜头记录这座城市的独特魅力，也期待在旅途中遇见更多志同道合的朋友，一起解锁更多荣昌的隐藏宝藏。',
    null,
    null,
  ],
};

const InheritorCenter = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
  const [intangibleHeritageList, setIntangibleHeritageList] = useState([]);

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
    const getIntangibleHeritageList = async () => {
      try {
        const res = await getIntangibleHeritageAPI();
        setIntangibleHeritageList(res.data);
      } catch (error) {
        console.error('获取非遗列表失败', error);
      }
    };

    getHeritageType();
    getHeritageTags();
    getHumanStories();
    getIntangibleHeritageList();
  }, []);

  const heritageTypeOptions = heritageType?.map((item) => ({
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
    // 匹配当前传承人的id的传承项目
    return intangibleHeritageList.filter((item) => item.inheritor_id === 1);
  }, [intangibleHeritageList]);

  // 根据二级路由，传递不同参数
  const getShareData = () => {
    // 控制台需要的数据
    if (
      location.pathname === '/inheritorCenter' ||
      location.pathname === '/inheritorCenter/'
    ) {
      return { user: user || {} };
    }

    // 订单管理需要的数据
    if (location.pathname.startsWith('/inheritorCenter/orderManage')) {
      return {};
    }

    // 传承项目管理需要的数据
    if (location.pathname.startsWith('/inheritorCenter/heritageManage')) {
      return {
        inheritorNav:
          heritageNav || '/inheritorCenter/heritageManage/heritageAdd',
        heritageTypeOptions: heritageTypeOptions || [],
        heritageTagsOptions: heritageTagsOptions || [],
        humanStoriesOptions: humanStoriesOptions || [],
        myHeritageList: myHeritageList || [],
      };
    }

    // 账户信息需要的数据
    if (location.pathname.startsWith('/inheritorCenter/inheritorAccount')) {
      return {
        user: user || {},
        heritageTypeOptions: heritageTypeOptions || [],
      };
    }

    // 其他情况
    return {};
  };

  // 菜单的点击事件，含退出登陆
  const handleMenuClick = (e) => {
    const key = e.key;

    // 退出登陆处理
    if (key === 'layout') {
      console.log('退出登陆');
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
          selectedKeys={[inheritorNav]}
          style={{ width: 240, fontSize: 16 }}
          mode="inline"
          items={inlineNavItems}
          className="h-screen"
          onClick={handleMenuClick}
        />

        <div className="w-full pl-10 pr-20 py-6">
          <Outlet context={getShareData()} />
        </div>
      </div>
    </div>
  );
};

export default InheritorCenter;
