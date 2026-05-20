import { updateTouristApi } from '@/apis/users';
import { CommonForm, DialogCommon } from '@/components';
import { useEditConfirm, useFirstEnterNav } from '@/hook';
import {
  usePaWEditForm,
  usePhoneEditForm,
} from '@/hook/formFields/useEditForm';
import { useUserForm } from '@/hook/formFields/useUserForm';
import { useUserConfirm } from '@/hook/useUserConfirm';
import { setUserPrivacyData } from '@/store';
import { Menu, message, Radio, Switch } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

// 通知设置的开关配置
const notifySwitchItems = [
  { key: 'system', text: '系统通知' },
  { key: 'order', text: '订单通知' },
  { key: 'activity', text: '活动通知' },
  { key: 'comment', text: '评论回复' },
];

const Setting = () => {
  // 当前激活的导航
  const [menuSelectedKey, setMenuSelectedKey] = useFirstEnterNav(
    '/touristCenter',
    'personal',
    'touristNav',
  );
  const dispatch = useDispatch();
  // 获取个人信息表单
  const { currentUser, userPrivacyData, touristId } = useSelector(
    (state) => state.user,
  );
  // 邮箱的全局消息
  const [messageApi, contextHolder] = message.useMessage();

  const user = {
    identity_type: currentUser.identity_type,
    user_name: currentUser.user_name,
    phone: currentUser.phone,
    password: currentUser.password,
    avatar: currentUser.avatar,
    privacyData: [userPrivacyData.signature],
    tourists: {
      email: userPrivacyData.email,
      wallet: userPrivacyData.wallet,
      privacy_settings: userPrivacyData.privacy_settings,
      notify_settings: userPrivacyData.notify_settings,
    },
  };

  // 通知设置于隐私设置单独赋予值给一个常量
  const notify_settings = userPrivacyData.notify_settings;
  const privacy_settings = userPrivacyData.privacy_settings;
  // 通知设置的数组
  const [notifySettings, setNotifySettings] = useState(
    notify_settings || {
      system: true,
      order: true,
      activity: true,
      comment: true,
    },
  );
  // 隐私设置中的公开评论单选框
  const [privacyComment, setPrivacyComment] = useState(privacy_settings);

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

  const {
    form: userForm,
    formFields: userFormFields = [],
    initialValues: userInitialValues,
  } = useUserForm({ user });

  // 组件挂载后，强制设置表单初始值
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userForm) {
        userForm.setFieldsValue(userInitialValues);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [userForm, userInitialValues]);

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

  // 确保表单挂载后再设置值，以免表单还未挂载但初始值研究渲染完成
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneForm) {
        phoneForm.setFieldsValue(phoneInitialValues);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [phoneForm, phoneInitialValues]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (paWForm) {
        paWForm.setFieldsValue(paWInitialValues);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [paWForm, paWInitialValues]);

  // 控制个人信息修改弹窗开关
  const [isShowDialog, setIsShowDialog] = useState(false);
  // 游客的个人信息中的邮箱是否已经填写（是否有初始值）
  const touristsEmail = user.tourists.email;
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 个人信息修改弹窗数据
  const dialogData = useMemo(() => {
    if (editType === 1) {
      return {
        type: 1,
        title: '修改手机号',
        data: {
          formType: 'edit',
          form: phoneForm,
          initialValues: phoneInitialValues,
          formFields: phoneFormFields,
          maxWidth: 500,
        },

        width: 500,
      };
    } else if (editType === 2) {
      return {
        type: 1,
        title: '修改密码',
        data: {
          formType: 'edit',
          form: paWForm,
          initialValues: paWInitialValues,
          formFields: paWFormFields,
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
    } else {
      return {
        type: 2,
        data: {},
        width: 400,
      };
    }
  }, [
    editType,
    touristsEmail,
    phoneForm,
    phoneInitialValues,
    phoneFormFields,
    paWForm,
    paWInitialValues,
    paWFormFields,
  ]);

  // 打开弹窗点击事件
  const handleOpenDialog = (type) => {
    setEditType(type);
    setIsShowDialog(true);
  };

  const { handleUserConfirm } = useUserConfirm(
    userForm,
    currentUser,
    touristId,
    userPrivacyData,
    messageApi,
  );
  // 保存个人信息表单
  const handleSaveForm = async () => {
    const loadingKey = 'tourist-loading';
    let isLoadingOpened = false;

    try {
      messageApi.open({
        key: loadingKey, // 固定 key，避免重复创建
        type: 'loading',
        content: '正在保存中...',
        duration: 0,
      });
      isLoadingOpened = true;

      await handleUserConfirm();

      // 删除加载状态的全局消息
      messageApi.destroy(loadingKey);
      isLoadingOpened = false;
    } catch (error) {
      console.error('保存个人信息失败！请重试！', error);
    } finally {
      if (isLoadingOpened) {
        messageApi.destroy(loadingKey);
      }
    }
  };

  // 封装修改游客的特殊身份信息的方法，同步本地和全局变量
  async function fetchTouristData(key, newData) {
    try {
      await updateTouristApi(touristId, {
        [key]: newData,
      });
      dispatch(
        setUserPrivacyData({
          ...userPrivacyData,
          [key]: newData,
        }),
      );
    } catch (error) {
      console.error('修改游客数据的方法调用失败！', error);
    }
  }

  // 弹窗关闭事件
  const handleCancel = () => {
    switch (editType) {
      case 1:
        phoneForm.resetFields();
        break;
      case 2:
        paWForm.resetFields();
        break;
    }

    setIsShowDialog(false);
  };

  const { phoneConfirm, passwordConfirm } = useEditConfirm(
    phoneForm,
    paWForm,
    currentUser,
    setConfirmLoading,
    setIsShowDialog,
    messageApi,
  );
  // 弹窗提交事件
  const handleConfirm = (formValue) => {
    try {
      if (editType === 1) {
        phoneConfirm();
      }

      if (editType === 2) {
        passwordConfirm();
      }

      if (editType === 3) {
        try {
          setConfirmLoading(true);
          // console.log(formValue);
          // 邮箱正则
          const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

          const oldEmail = userPrivacyData.email;

          // 验证邮箱格式
          if (!regEmail.test(formValue)) {
            messageApi.error('邮箱格式不正确，请重新填写！');
            return;
          }

          // 新的邮箱不能与旧的相同
          if (formValue === oldEmail) {
            messageApi.info('新的邮箱与旧的邮箱相同，未发生改变！');
            return;
          }

          fetchTouristData('email', formValue);
          messageApi.success(`${touristsEmail ? '修改' : '添加'}邮箱成功!`);
          setIsShowDialog(false);
        } catch (error) {
          console.error(('保存邮箱数据失败！', error));
        } finally {
          setConfirmLoading(false);
        }
      }
    } catch (error) {
      console.error('表单提交失败', error);
    }
  };

  // 通知开关的onChange事件
  const handleNotifyConfirm = (key) => {
    try {
      const item = notifySettings[key];
      const updateData = {
        ...notifySettings,
        [key]: !item,
      };
      setNotifySettings(updateData);

      fetchTouristData('notify_settings', updateData);

      // console.log('updateData', updateData);
    } catch (error) {
      console.error('修改通知开关失败！', error);
    }
  };

  // 隐私设置的多选框onChange事件
  const handlePrivacyConfirm = (e) => {
    try {
      // console.log(e.target.value);
      setPrivacyComment(e.target.value);
      fetchTouristData('privacy_settings', e.target.value);
    } catch (error) {
      console.error('修改隐私失败', error);
    }
  };

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
        {contextHolder}

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
                  onClick={() => handleOpenDialog(2)}
                >
                  修改
                </div>
                <div className="btn3" onClick={() => handleOpenDialog(1)}>
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
                    value={notifySettings[item.key]}
                    onChange={() => handleNotifyConfirm(item.key)}
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
                onChange={handlePrivacyConfirm}
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
          onCancel={handleCancel}
          dialogData={dialogData}
          onOk={handleConfirm}
          initialValue={touristsEmail && touristsEmail}
          confirmLoading={confirmLoading}
        />
      </div>
    </div>
  );
};

export default Setting;
