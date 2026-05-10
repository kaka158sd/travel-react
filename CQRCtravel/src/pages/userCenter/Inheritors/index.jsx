import {
  useFirstEnterNav,
  usePaWEditForm,
  usePhoneEditForm,
  useUserForm,
} from '@/hook';
import { Avatar, Button, Menu, Table, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.less';
import { Card, DialogCommon, CommonForm, NoData } from '@/components';
import { statusStyle, inheritLevelTagsConfig } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDetailOrderItems } from '@/utils/detailDialog/detailDialog';
import {
  getHeritageTagsAPI,
  getHeritageTypeAPI,
  getIntangibleHeritageAPI,
} from '@/apis/intangible_heritage';
import { getHumanStoriesAPI } from '@/apis/human_stories';
import { useAddHeritageForm } from '@/hook/formFields/useAddForm';

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
    key: 'order',
    label: '订单管理',
    icon: <i className="iconfont icon-dingdan" style={{ fontSize: 20 }} />,
  },
  { type: 'divider' },
  {
    key: 'heritage',
    label: '传承项目管理',
    icon: <i className="iconfont icon-zhiwu" style={{ fontSize: 20 }} />,
    children: [
      {
        key: 'heritageAdd',
        label: '新增传承项目',
      },
      {
        key: 'heritageList',
        label: '传承项目列表',
      },
    ],
  },
  { type: 'divider' },
  {
    key: 'account',
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

// 订单数据列表
const orderList = [
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

// 个人信息修改表单
// 手机号
const editPhone = {
  oldPhone: user.phone,
  newPhone: '',
  code: '', //验证码固定为111111
};
// 密码
const editPaW = {
  oldPassword: user.password,
  newPassword: '',
  passwordAgain: '',
};

const InheritorCenter = () => {
  const navigate = useNavigate();

  // 菜单导航
  const [inheritorNav, setInheritorNav] = useFirstEnterNav(
    '/inheritorCenter',
    'console',
    'inheritorNav',
  );

  // 数据卡片的配置
  const dataCardFields = [
    {
      iconColor: 0,
      icon: 'icon-renminbi',
      title: '月销售额',
      data: 2000,
    },
    {
      iconColor: 1,
      icon: 'icon-survey',
      title: '月订单量',
      data: 22,
    },
    {
      iconColor: 3,
      icon: 'icon-zhenshikexin',
      title: '传承项目数量',
      data: 2,
    },
  ];

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(3);
  const [dialogItem, setDialogItem] = useState({});

  // 订单表格的顶部栏配置
  const tableColumns = [
    {
      title: '订单编号',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '客户姓名',
      dataIndex: 'contact_people',
      key: 'contact_people',
      render: (text) => <div className="text-blue-500">{text}</div>,
    },
    { title: '客户电话', dataIndex: 'contact_phone', key: 'contact_phone' },
    { title: '非遗项目', dataIndex: 'item_name', key: 'item_name' },
    { title: '服务时间', dataIndex: 'reserve_time', key: 'reserve_time' },
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
      key: 'age',
      render: (record) => (
        <Button
          variant="text"
          color="blue"
          onClick={() => handleOpenDetailDialog(record.order_id)}
        >
          查看详情
        </Button>
      ),
    },
  ];

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

  // 获取个人信息表单
  const {
    form: userForm,
    formFields: userFormFields = [],
    initialValues: userInitialValues,
  } = useUserForm({ user, heritageTypeOptions });

  // 获取个人信息修改表单
  const {
    form: phoneForm,
    formFields: phoneFormFields = [],
    initialValues: phoneInitialValues,
  } = usePhoneEditForm(editPhone);

  const {
    form: paWForm,
    formFields: paWFormFields = [],
    initialValues: paWInitialValues,
  } = usePaWEditForm(editPaW);

  // 封装根据弹窗类型获取表单配置的函数
  const getFormConfig = useCallback(
    (type) => {
      if (type === 1) {
        return {
          form: phoneForm,
          formFields: phoneFormFields,
          initialValues: phoneInitialValues,
          title: '手机号',
        };
      } else if (type === 2) {
        return {
          form: paWForm,
          formFields: paWFormFields,
          initialValues: paWInitialValues,
          title: '密码',
        };
      } else return {};
    },
    [
      phoneForm,
      phoneFormFields,
      phoneInitialValues,
      paWForm,
      paWFormFields,
      paWInitialValues,
    ],
  );

  // 弹窗数据
  const dialogData = useMemo(() => {
    if (dialogType === 1 || dialogType === 2) {
      const config = getFormConfig(dialogType);

      return {
        type: 1,
        title: `修改${config.title}`,
        data: {
          formType: 'edit',
          form: config.form,
          initialValues: config.initialValues,
          formFields: config.formFields,
          maxWidth: 500,
        },

        width: 500,
      };
    } else if (dialogType === 3) {
      // 先判断是否有数据,初次渲染时dialogItem无数据，返回默认值
      if (!dialogItem?.order_id)
        return {
          type: 3,
          items: [],
          title: '',
        };

      // 获取订单详情弹窗的描述列表配置项
      const items = getDetailOrderItems(dialogItem);

      return {
        type: 3,
        items,
        title: `${dialogItem.item_name}-#${dialogItem.order_id}`,
        width: 1000,
      };
    }

    // 其他未匹配的 dialogType 也返回默认值，避免传递给弹窗的是未定义
    return {
      type: 3,
      items: [],
      title: '',
    };
  }, [dialogItem, dialogType, getFormConfig]);

  // 订单详情弹窗点击事件
  const handleOpenDetailDialog = (id) => {
    setDialogType(3);

    const item = orderList.find((item) => item.order_id === id);
    setDialogItem(item || {});
    setIsShowDialog(true);
  };

  // 传承项目表单
  const { form, formFields, initialValues } = useAddHeritageForm({
    addHeritage,
    heritageTypeOptions,
    heritageTagsOptions,
    humanStoriesOptions,
  });

  // 获取传承列表
  const myHeritageList = useMemo(() => {
    // 匹配当前传承人的id的传承项目
    return intangibleHeritageList.filter((item) => item.inheritor_id === 1);
  }, [intangibleHeritageList]);

  // 打开弹窗点击事件
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setIsShowDialog(true);
  };

  // 菜单的点击事件，含退出登陆
  const handleMenuClick = (e) => {
    const key = e.key;

    // 退出登陆处理
    if (key === 'layout') {
      console.log('退出登陆');
      return;
    }

    // 其他菜单点击后切换菜单
    setInheritorNav(key);
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
          selectedKeys={inheritorNav}
          style={{ width: 240, fontSize: 16 }}
          mode="inline"
          items={inlineNavItems}
          className="h-screen"
          onClick={handleMenuClick}
        />

        <div className="w-full pl-10 pr-20 py-6">
          {/* 控制台页面 */}
          {inheritorNav === 'console' && (
            <div>
              {/* 个人信息展示 */}
              <div className="w-full bg-white rounded-xl shadow px-8 py-4 bgImage flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="border border-slate-100 w-fit">
                    <Avatar
                      src={user.avatar}
                      size={120}
                      icon={<UserOutlined />}
                      shape="square"
                    />
                  </div>

                  <div className="pr-4">
                    <div className="text-xl font-semibold">
                      {user.user_name}
                    </div>
                    <div className="text-base py-2">{user.phone}</div>
                    <div className="flex gap-4">
                      {user.privacyData[1] &&
                        inheritLevelTagsConfig
                          .filter((item) => item.text === user.privacyData[1])
                          .map((item) => (
                            <Tag
                              key={item.text}
                              variant="solid"
                              color={item.color}
                            >
                              {item.text}
                            </Tag>
                          ))}
                      {user.privacyData[2] && (
                        <Tag variant="filled" color="#f50">
                          {user.privacyData[2]}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>

                {/* 编辑个人信息按钮 */}
                <i
                  className="iconfont icon-qianshuxieyi editIcon h-fit"
                  style={{ fontSize: 26 }}
                  onClick={() => setInheritorNav('account')}
                />
              </div>

              {/* 数据卡片 */}
              <div className="flex justify-between items-center py-10 ">
                {dataCardFields.map((item, index) => {
                  const boxStyle = {
                    width: 'w-[320px]',
                    padding: 'py-8 px-12',
                    gap: 'gap-4',
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
                      key={index}
                      boxStyle={boxStyle}
                      cardData={cardData}
                      onClick={item.onClick}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 订单管理页面 */}
          {inheritorNav === 'order' && (
            <div>
              <div className="text-2xl font-semibold">订单管理</div>
              {/* 搜索框和筛选框 */}

              {/* 订单信息表格 */}
              <div className="my-8">
                <Table columns={tableColumns} dataSource={orderList} />
              </div>
            </div>
          )}

          {/* 传承项目管理页面 */}
          {/* 新增页面 */}
          {inheritorNav === 'heritageAdd' && (
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
          {inheritorNav === 'heritageList' && (
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
                      />
                    );
                  })}
                </div>
              ) : (
                <NoData />
              )}
            </div>
          )}

          {/* 账户信息页面 */}
          {inheritorNav === 'account' && (
            <div className="w-full">
              <div className="text-2xl font-semibold mb-4">账户信息</div>

              {/* 个人信息表单 */}
              <div className="py-3">
                <div className="flex">
                  <CommonForm
                    formType="user"
                    form={userForm}
                    maxWidth={600}
                    initialValues={userInitialValues}
                    formFields={userFormFields || {}}
                  />

                  {/* 修改按钮 */}
                  <div className="mt-58.5 ml-26">
                    <div
                      className="btn3 mb-5.5"
                      onClick={() => handleOpenDialog(1)}
                    >
                      修改
                    </div>
                    <div className="btn3" onClick={() => handleOpenDialog(2)}>
                      修改
                    </div>
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="w-26 ml-42">
                <div className="btn2">保存</div>
              </div>
            </div>
          )}

          {/* 弹窗组件 */}
          <DialogCommon
            isShowDialog={isShowDialog}
            onCancel={() => setIsShowDialog(false)}
            onOk={() => setIsShowDialog(false)}
            dialogData={dialogData}
          />
        </div>
      </div>
    </div>
  );
};

export default InheritorCenter;
