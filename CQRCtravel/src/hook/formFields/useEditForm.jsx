// 存放修改手机号、密码登修改相关的表单配置

import { Form } from 'antd';

// 手机号
export const usePhoneEditForm = (edit = {}) => {
  const [form] = Form.useForm();

  const formFields = [
    {
      name: 'oldPhone',
      label: '原手机号',
      rules: 'required phone',
      type: 'textInput',
      formConfig: {
        placeholder: edit.oldPhone || '',
        isDisabled: true,
        width: 250,
      },
    },
    {
      name: 'newPhone',
      label: '新手机号',
      rules: 'required phone',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入新的手机号',
        width: 250,
      },
    },
    {
      name: 'code',
      label: '验证码',
      rules: 'required',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入验证码',
        width: 120,
      },
    },
  ];

  return {
    form,
    formFields,
    initialValues: edit,
  };
};

// 密码
export const usePaWEditForm = (edit = {}) => {
  const [form] = Form.useForm();

  const formFields = [
    {
      name: 'oldPassword',
      label: '原密码',
      rules: 'required password',
      type: 'password',
      formConfig: {
        placeholder: edit.oldPassword || '',
        isDisabled: true,
        width: 250,
      },
    },
    {
      name: 'newPassword',
      label: '新密码',
      rules: 'required password',
      type: 'password',
      formConfig: {
        placeholder: '请输入密码',
        width: 250,
      },
    },
    {
      name: 'passwordAgain',
      label: '确认密码',
      rules: 'required password',
      type: 'password',
      formConfig: {
        placeholder: '请再次输入密码',
        width: 250,
      },
    },
  ];

  return {
    form,
    formFields,
    initialValues: edit,
  };
};
