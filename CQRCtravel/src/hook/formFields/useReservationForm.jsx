// 存放预约、订单相关表单配置

import { Form } from 'antd';

export const useReservationForm = (orders = {}) => {
  const [form] = Form.useForm();

  // 基础字段
  const baseFields = [
    {
      name: 'item_name',
      label: '预约项目',
      rules: 'required',
      type: 'textInput',
      formConfig: {
        placeholder: orders.item_name || '',
        isDisabled: true,
      },
    },
    {
      name: 'single_price',
      label: '项目单价',
      rules: 'required',
      type: 'textInput',
      formConfig: {
        placeholder: orders.single_price || '',
        defaultValue: orders.single_price || '',
        isDisabled: true,
      },
    },
    {
      name: 'reserve_time',
      label: '预约日期',
      rules: 'required date',
      type: 'date',
      formConfig: {
        placeholder: '请选择日期',
      },
    },
    {
      name: 'reserve_period',
      label: '预约时段',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择时段',
        options: [
          '8:00-10:00',
          '10:00-12:00',
          '12:00-14:00',
          '14:00-16:00',
          '16:00-18:00',
        ].map((item) => ({ value: item, label: item })),
        defaultValue: '8:00-10:00',
      },
    },
    {
      name: 'contact_people',
      label: '联系人',
      rules: 'required len1_10',
      type: 'textInput',
      formConfig: { placeholder: '请填写姓名' },
    },
    {
      name: 'contact_phone',
      label: '联系电话',
      rules: 'required phone',
      type: 'textInput',
      formConfig: { placeholder: '请填写联系电话' },
    },
  ];

  // 动态字段（根据 orders 自动变化）
  const dynamicFields = [];
  if (orders.business_type === 1) {
    dynamicFields.push(
      {
        name: 'people_num',
        label: '预约人数',
        rules: 'optional',
        type: 'number',
        formConfig: {
          placeholder: '请填写预约人数',
          defaultValue: 1,
          min: 1,
        },
      },
      {
        name: 'remark',
        label: '留言',
        rules: 'optional',
        type: 'textArea',
        formConfig: {
          placeholder: '请写下想对传承人说的话吧...',
          maxCount: 500,
        },
      },
    );
  }

  // 最终合并
  const formFields = [...baseFields, ...dynamicFields];

  return {
    form,
    formFields,
    initialValues: orders, // 自动带初始值
  };
};
