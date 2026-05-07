// 存放用户个人信息相关的表单配置

import { Form } from 'antd';
import { useMemo } from 'react';

// 用户身份
const identity = {
  1: ['个性签名'],
  2: ['个人简介', '传承级别', '从事领域'],
  3: ['职位', '部门'],
};

export const useUserForm = (params = {}) => {
  // 解构 + 默认值
  const {
    user = {},
    heritageTypeOptions = [],
    adminPositionOptions = [],
    adminDepartmentOptions = [],
  } = params;

  const [form] = Form.useForm();

  const heritageLevelOptions = ['世界级', '国家级', '省级', '市级', '县级'].map(
    (item) => ({
      value: item,
      label: item,
    }),
  );

  const formFields = useMemo(() => {
    // 提前将用户身份相应的特殊label解构出来
    const currentIdentityLabel = identity[user?.identity_type] || [];
    const labelText0 = currentIdentityLabel[0] ?? '';
    const labelText1 = currentIdentityLabel[1] ?? '';
    const labelText2 = currentIdentityLabel[2] ?? '';

    const identityType = user.identity_type;

    return (
      [
        {
          name: 'avatar',
          label: '头像',
          rules: 'optional',
          type: 'upload',
          formConfig: {
            name: 'avatar',
            listType: 2,
            width: 150,
            src: user.avatar || '',
          },
        },
        {
          name: 'user_name',
          label: '用户名',
          rules: 'required',
          type: 'textInput',
          formConfig: {
            placeholder: '',
            isAllowClear: identityType === 1 ? true : false,
            isDisabled: identityType === 1 ? false : true,
            suffix:
              identityType === 1
                ? undefined
                : {
                    title: '用户名一旦注册不可修改！',
                    icon: 'icon-tishifill',
                  },
          },
        },
        {
          name: 'password',
          label: '密码',
          rules: 'required password',
          type: 'password',
          formConfig: {
            placeholder: '',
            isDisabled: true,
          },
        },
        {
          name: 'phone',
          label: '手机号',
          rules: 'required phone',
          type: 'textInput',
          formConfig: {
            placeholder: '',
            isDisabled: true,
          },
        },
        // 将name写成数组形式以便form表单组件爱你识别
        labelText1 && {
          name: ['privacyData', '1'],
          label: labelText1,
          rules: 'optional',
          type: 'dialog',
          formConfig: {
            labelText: labelText1,
            options:
              identityType === 2
                ? heritageLevelOptions
                : identityType === 3
                  ? adminDepartmentOptions
                  : [],
          },
          // 个人信息表单中相关的弹窗信息
          userDialogData: {
            type: 2,
            data: {
              label: labelText1,
              placeholder: `请输入/选择${labelText1}...`,
              title: user.privacyData[1]
                ? `修改${labelText1}`
                : `填写${labelText1}`,
              options:
                identityType === 2
                  ? heritageLevelOptions
                  : identityType === 3
                    ? adminDepartmentOptions
                    : [],
            },
          },
        },
        labelText2 && {
          name: ['privacyData', '2'],
          label: labelText2,
          rules: 'optional',
          type: 'dialog',
          formConfig: {
            labelText: labelText2,
            options: heritageTypeOptions,
          },
          // 个人信息表单中相关的弹窗信息
          userDialogData: {
            type: 2,
            data: {
              label: labelText2,
              placeholder: `请输入/选择${labelText2}...`,
              title: user.privacyData[2]
                ? `修改${labelText2}`
                : `填写${labelText2}`,
              options: heritageTypeOptions,
            },
          },
        },
        {
          name: ['privacyData', '0'],
          label: labelText0,
          rules: 'optional',
          type: identityType === 3 ? 'dialog' : 'textArea',
          formConfig:
            identityType === 3
              ? {
                  labelText: labelText0,
                  options: adminPositionOptions,
                }
              : {
                  placeholder: `请输入你的${labelText0}...`,
                  maxCount: 300,
                },
          // 个人信息表单中相关的弹窗信息
          userDialogData:
            identityType === 3
              ? {
                  type: 2,
                  data: {
                    label: labelText0,
                    placeholder: `请输入/选择${labelText0}...`,
                    title: user.privacyData[0]
                      ? `修改${labelText0}`
                      : `填写${labelText0}`,
                    options: adminPositionOptions,
                  },
                }
              : null,
        },
      ].filter(Boolean) || []
    );
  }, [
    user,
    heritageLevelOptions,
    heritageTypeOptions,
    adminPositionOptions,
    adminDepartmentOptions,
  ]);

  // 个人信息表单中的 privacyData 由于是数组且内含null，使得form组件无法正确识别，需要在传递初始值时进行处理
  const initialValue = useMemo(() => {
    return {
      ...user,
      // 把数组转成对象格式
      privacyData: {
        0: user.privacyData?.[0] ?? '',
        1: user.privacyData?.[1] ?? '',
        2: user.privacyData?.[2] ?? '',
      },
    };
  }, [user]);

  return {
    form,
    formFields,
    initialValues: initialValue,
  };
};
