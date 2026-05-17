import { CommonForm, DialogCommon } from '@/components';
import {
  useEditConfirm,
  usePaWEditForm,
  usePhoneEditForm,
  useUserForm,
} from '@/hook';
import { useUserConfirm } from '@/hook/useUserConfirm';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const InheritorAccount = () => {
  const {
    user = {},
    heritageTypeOptions = [],
    currentUser = {},
    inheritorId = 0,
    userPrivacyData = {},
  } = useOutletContext() || {};

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1); //1：手机号；2：密码
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

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

  // 获取个人信息表单
  const {
    form: userForm,
    formFields: userFormFields = [],
    initialValues: userInitialValues,
  } = useUserForm({ user, heritageTypeOptions });
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
    } else {
      // 默认返回表单数据
      return {
        type: 3,
        data: {},
      };
    }
  }, [
    dialogType,
    phoneForm,
    phoneInitialValues,
    phoneFormFields,
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
    }
  };

  const { handleUserConfirm } = useUserConfirm(
    userForm,
    currentUser,
    inheritorId,
    userPrivacyData,
    messageApi,
  );
  // 保存个人信息表单
  const handleSaveForm = () => {
    try {
      handleUserConfirm();
    } catch (error) {
      console.error('保存个人信息失败！请重试！', error);
    }
  };

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold mb-4">账户信息</div>

      {/* 个人信息表单 */}
      <div className="py-3">
        {contextHolder}
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
            <div className="btn3 mb-5.5" onClick={() => handleOpenDialog(2)}>
              修改
            </div>
            <div className="btn3" onClick={() => handleOpenDialog(1)}>
              修改
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="w-26 ml-42">
        <div className="btn2" onClick={handleSaveForm}>
          保存
        </div>
      </div>

      {/* 弹窗组件 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={handleCancel}
        onOk={handleConfirm}
        dialogData={dialogData}
        confirmLoading={confirmLoading}
      />
    </div>
  );
};

export default InheritorAccount;
