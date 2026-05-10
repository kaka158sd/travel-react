import { CommonForm, DialogCommon } from '@/components';
import { usePaWEditForm, usePhoneEditForm, useUserForm } from '@/hook';
import { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const InheritorAccount = () => {
  const { user = {}, heritageTypeOptions = [] } = useOutletContext() || {};

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

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1);

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
    const config = getFormConfig(dialogType) || {};

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
  }, [dialogType, getFormConfig]);

  // 打开弹窗点击事件
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setIsShowDialog(true);
  };

  return (
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
            <div className="btn3 mb-5.5" onClick={() => handleOpenDialog(1)}>
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

      {/* 弹窗组件 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={() => setIsShowDialog(false)}
        onOk={() => setIsShowDialog(false)}
        dialogData={dialogData}
      />
    </div>
  );
};

export default InheritorAccount;
