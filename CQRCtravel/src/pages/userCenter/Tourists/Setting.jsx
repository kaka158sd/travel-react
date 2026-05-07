import { CommonForm, DialogCommon } from '@/components';
import { useFirstEnterNav } from '@/hook';
import {
  usePaWEditForm,
  usePhoneEditForm,
} from '@/hook/formFields/useEditForm';
import { useUserForm } from '@/hook/formFields/useUserForm';
import { Menu, Radio, Switch } from 'antd';
import { useState, useMemo, useCallback } from 'react';

// 导航菜单项
const items = [
  {
    key: 'personal',
    label: '个人信息',
    icon: <i className="iconfont icon-user" style={{ fontSize: 26 }} />,
  },
  { type: 'divider' },
  {
    key: 'security',
    label: '安全设置',
    icon: <i className="iconfont icon-guanli" style={{ fontSize: 26 }} />,
  },
  { type: 'divider' },
  {
    key: 'notify',
    label: '通知设置',
    icon: <i className="iconfont icon-notification" style={{ fontSize: 26 }} />,
  },
  { type: 'divider' },
  {
    key: 'privacy',
    label: '隐私设置',
    icon: <i className="iconfont icon-yinsibaohu" style={{ fontSize: 26 }} />,
  },
  { type: 'divider' },
];

// 个人信息
const user = {
  // user_id: 1,
  identity_type: 1,
  user_name: '荣昌游客',
  phone: '13800001111',
  password: '123456a',
  avatar:
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.dL40B4NwCkdjug6poBJ6bQAAAA?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  // created_time: '2026-04-20T10:19:55.337782+00:00',
  privacyData: [
    '我是一名热爱旅行、尤其钟情于重庆荣昌文旅风光的游客。喜欢打卡每一处古镇老街，探寻非遗背后的匠人故事，品尝地道的荣昌卤鹅、黄凉粉等特色美食，感受山水间的烟火气。每次来到荣昌，都能被这里的历史文化、自然风光和热情的民风打动，希望用脚步丈量荣昌的每一寸土地，用镜头记录这座城市的独特魅力，也期待在旅途中遇见更多志同道合的朋友，一起解锁更多荣昌的隐藏宝藏。',
  ],
  tourists: {
    email: 'visitor@rc.com',
    // email: null,
    wallet: 500.0,
    privacy_settings: true,
    notify_settings: null,
  },
};
// 修改表单
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

// 通知设置的开关配置
const notifySwitchItems = [
  { key: 'system', text: '系统通知' },
  { key: 'order', text: '订单通知' },
  { key: 'activity', text: '活动通知' },
  { key: 'comment', text: '评论回复' },
];
// 通知设置的数组
const notifySettings = {
  system: true,
  order: true,
  activity: true,
  comment: true,
};

const Setting = () => {
  // 当前激活的导航
  const [menuSelectedKey, setMenuSelectedKey] = useFirstEnterNav(
    '/touristCenter',
    'personal',
    'touristNav',
  );
  // 获取个人信息表单
  const {
    form: userForm,
    formFields: userFormFields = [],
    initialValues: userInitialValues,
  } = useUserForm({ user });

  // 获取个人信息修改表单
  const [editType, setEditType] = useState(1);
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

  // 控制个人信息修改弹窗开关
  const [isShowDialog, setIsShowDialog] = useState(false);
  // 游客的个人信息中的邮箱是否已经填写（是否有初始值）
  const touristsEmail = user.tourists.email;

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

  // 个人信息修改弹窗数据
  const dialogData = useMemo(() => {
    if (editType === 1 || editType === 2) {
      const config = getFormConfig(editType);

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
    } else if (editType === 3) {
      return {
        type: 2,
        data: {
          label: '邮箱',
          placeholder: '请输入邮箱...',
          title: touristsEmail ? '修改邮箱' : '绑定邮箱',
        },
        width: 400,
      };
    }
  }, [editType, getFormConfig, touristsEmail]);

  // 打开弹窗点击事件
  const handleOpenDialog = (type) => {
    setEditType(type);
    setIsShowDialog(true);
  };

  // 保存个人信息表单
  const handleSaveForm = () => {
    userForm.validateFields().then((values) => {
      console.log('保存个人信息:', values);
    });
  };

  // 隐私设置中的公开评论单选框
  const [privacyComment, setPrivacyComment] = useState(
    user.tourists.privacy_settings,
  );

  return (
    <div>
      {/* 顶部栏 */}
      <div className="w-full py-2 px-10 bg-amber-50 text-black flex gap-9 items-end shadow-lg">
        <div className="text-3xl font-semibold">账户设置</div>
        <p className="text-base">管理您的个人信息、安全设置和通知、隐私偏好</p>
      </div>

      {/* 导航菜单 */}
      <div className="mt-10 mx-20 rounded-lg overflow-hidden flex">
        <Menu
          onClick={(e) => {
            setMenuSelectedKey(e.key);
          }}
          style={{ width: 300, fontSize: 18, padding: 4 }}
          selectedKeys={[menuSelectedKey]}
          mode="inline"
          items={items}
        />

        {/* 个人信息页面 */}
        {menuSelectedKey === 'personal' && (
          <div className="mt-10">
            <div className="flex">
              <CommonForm
                formType="user"
                form={userForm}
                maxWidth={600}
                initialValues={userInitialValues}
                formFields={userFormFields || {}}
              />

              {/* 修改按钮 */}
              <div className="mt-57 ml-26">
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

            {/* 保存按钮 */}
            <div className="w-34 mt-6 ml-20">
              <div className="btn2" onClick={handleSaveForm}>
                保存
              </div>
            </div>
          </div>
        )}

        {/* 安全设置页面 */}
        {menuSelectedKey === 'security' && (
          <div className="ml-15 py-10">
            <div className="text-xl font-semibold">
              {touristsEmail ? '修改' : '绑定'}邮箱
            </div>
            <div className="flex ml-8 py-4 gap-36 text-base items-end">
              <div>
                <p className="mb-1.5">绑定邮箱可用于找回密码、接收通知</p>
                <p>当前邮箱：{touristsEmail ? touristsEmail : '未绑定'}</p>
              </div>
              <div className="btn3 w-15" onClick={() => handleOpenDialog(3)}>
                {touristsEmail ? '修改' : '绑定'}
              </div>
            </div>
          </div>
        )}

        {/* 通知设置页面 */}
        {menuSelectedKey === 'notify' && (
          <div className="ml-15 py-10">
            <div className="text-xl font-semibold">通知设置</div>
            <div className="ml-8 py-4">
              {notifySwitchItems.map((item) => (
                <div
                  key={item.key}
                  className="py-4 flex items-center text-base"
                >
                  <span className="mr-5">{item.text}</span>
                  <Switch
                    defaultChecked
                    onChange={() => !notifySettings[item.key]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 隐私设置页面 */}
        {menuSelectedKey === 'privacy' && (
          <div className="ml-15 py-10">
            <div className="text-xl font-semibold">隐私设置</div>
            <div className="text-base ml-10 py-10">
              <span className="mr-8">公开我的评论</span>
              <Radio.Group
                size="large"
                value={privacyComment}
                onChange={(e) => setPrivacyComment(e.target.value)}
                defaultValue={true}
                options={[
                  { value: true, label: '所有人可见' },
                  { value: false, label: '仅自己可见' },
                ]}
              />
            </div>
          </div>
        )}

        {/* 个人信息修改弹窗和邮箱弹窗 */}
        <DialogCommon
          isShowDialog={isShowDialog}
          onCancel={() => {
            setIsShowDialog(false);
          }}
          dialogData={dialogData}
          onOk={() => setIsShowDialog(false)}
          initialValue={touristsEmail && touristsEmail}
        />
      </div>
    </div>
  );
};

export default Setting;
