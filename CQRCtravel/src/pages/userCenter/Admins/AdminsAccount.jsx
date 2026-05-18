import { getAdminsDepartmentAPI, getAdminsPositionAPI } from '@/apis/users';
import { CommonForm, DialogCommon } from '@/components';
import {
  useEditConfirm,
  usePaWEditForm,
  usePhoneEditForm,
  useUserForm,
} from '@/hook';
import { useUserConfirm } from '@/hook/useUserConfirm';
import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const ActivityManage = () => {
  const {
    currentUser = {},
    adminId = 0,
    userPrivacyData = {},
  } = useOutletContext() || {};
  const [adminDepartment, setAdminDepartment] = useState([]);
  const [adminPosition, setAdminPosition] = useState([]);

  useEffect(() => {
    const getAdminDepartment = async () => {
      try {
        const res = await getAdminsDepartmentAPI();
        setAdminDepartment(res.data);
      } catch (error) {
        console.error('获取部门失败', error);
      }
    };
    const getAdminPosition = async () => {
      try {
        const res = await getAdminsPositionAPI();
        setAdminPosition(res.data);
      } catch (error) {
        console.error('获取职位失败', error);
      }
    };

    getAdminDepartment();
    getAdminPosition();
  }, []);

  const adminDepartmentOptions = adminDepartment?.map((item) => ({
    value: item.department_name,
    label: item.department_name,
  }));
  const adminPositionOptions = adminPosition?.map((item) => ({
    value: item.position_name,
    label: item.position_name,
  }));

  // 管理员数据
  const user = {
    identity_type: currentUser.identity_type,
    user_name: currentUser.user_name,
    phone: currentUser.phone,
    password: currentUser.password,
    avatar: currentUser.avatar,
    privacyData: [userPrivacyData.position, userPrivacyData.department],
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

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const timerRef = useRef(null);

  // 获取管理员个人信息表单
  const { form, formFields, initialValues } = useUserForm({
    user,
    adminDepartmentOptions,
    adminPositionOptions,
  });
  // 组件挂载后，强制设置表单初始值
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form) {
        form.setFieldsValue(initialValues);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [form, initialValues]);

  // 获取修改手机号和密码的表单
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

  // 弹窗数据
  const dialogData = useMemo(() => {
    if (dialogType === 1) {
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
    } else if (dialogType === 2) {
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
    }
    // 其他未匹配的 dialogType 也返回默认值，避免传递给弹窗的是未定义
    return {
      type: 3,
      items: [],
      title: '',
    };
  }, [
    dialogType,
    phoneForm,
    phoneFormFields,
    phoneInitialValues,
    paWForm,
    paWInitialValues,
    paWFormFields,
  ]);

  // 弹窗关闭事件
  const handleCancel = () => {
    switch (dialogType) {
      case 1:
        phoneForm.resetFields();
        break;
      case 2:
        paWForm.resetFields();
        break;
    }

    setIsShowDialog(false);
  };

  // 打开弹窗点击事件
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setIsShowDialog(true);
  };

  const { phoneConfirm, passwordConfirm } = useEditConfirm(
    phoneForm,
    paWForm,
    currentUser,
    setConfirmLoading,
    setIsShowDialog,
    messageApi,
  );
  // 修改弹窗提交事件
  const handleConfirm = () => {
    try {
      if (dialogType === 1) {
        phoneConfirm();
      }

      if (dialogType === 2) {
        passwordConfirm();
      }
    } catch (error) {
      console.error('修改表单提交失败', error);
      messageApi.error('修改表单提交失败');
    }
  };

  const { handleUserConfirm } = useUserConfirm(
    form,
    currentUser,
    adminId,
    userPrivacyData,
    messageApi,
  );
  // 保存个人信息表单
  const handleSaveForm = () => {
    // 先清理之前的定时器，防止重复调用
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      messageApi.open({
        type: 'loading',
        content: '正在删除中..',
        duration: 0,
      });
      timerRef.current = setTimeout(() => {
        messageApi.destroy();
        timerRef.current = null; // 执行后清空引用
      }, 1000);

      handleUserConfirm();
    } catch (error) {
      console.error('保存个人信息失败！请重试！', error);
    } finally {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        messageApi.destroy(); // 同时销毁消息实例
      }
    }
  };

  return (
    <div>
      <div className="text-xl font-semibold">个人资料</div>
      {contextHolder}
      <div className="py-10 -translate-x-12">
        <div className="flex">
          <CommonForm
            formType="user"
            form={form}
            maxWidth={600}
            initialValues={initialValues}
            formFields={formFields || {}}
          />

          <div className="mt-58.5 ml-26">
            <div className="btn3 mb-5.5" onClick={() => handleOpenDialog(2)}>
              修改
            </div>
            <div className="btn3" onClick={() => handleOpenDialog(1)}>
              修改
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="w-26 ml-40 mt-4">
          <div className="btn2" onClick={handleSaveForm}>
            保存
          </div>
        </div>
      </div>

      {/* 弹窗组件 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        onOk={handleConfirm}
        dialogData={dialogData}
      />
    </div>
  );
};

export default ActivityManage;
