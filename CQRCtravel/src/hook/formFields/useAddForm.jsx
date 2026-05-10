// 存放新增相关的表单配置，如景点、非遗、活动

import {
  heritageLevelOptions,
  openStatusOptions,
  spotStarOptions,
} from '@/store';
import { Form } from 'antd';
import { useMemo } from 'react';
import { dayjs } from 'dayjs';

// 新增景点
export const useAddSpotForm = (params = {}) => {
  const {
    addSpot = {},
    spotTypeOptions = [],
    spotTagsOptions = [],
    humanStoriesOptions = [],
  } = params;

  const [form] = Form.useForm();

  const formFields = [
    {
      name: 'spot_name',
      label: '景点名称',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入景点名称...',
        isAllowClear: true,
        count: { max: 20 },
      },
      column: 'left',
    },
    {
      name: 'spot_image',
      label: '景点图片',
      rules: 'required',
      type: 'upload',
      formConfig: {
        name: 'spot_image',
        listType: 1,
        width: 200,
        src: addSpot.spot_image || '',
      },
      column: 'left',
    },
    {
      name: 'spot_type',
      label: '景点类型',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择/输入景点类型...',
        isAllowClear: true,
        isShowSearch: true,
        options: spotTypeOptions,
      },
      column: 'left',
    },
    {
      name: 'spot_tags',
      label: '景点标签',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择/输入景点标签...',
        isAllowClear: true,
        isShowSearch: true,
        mode: 2,
        options: spotTagsOptions,
      },
      column: 'left',
    },
    {
      name: 'spot_star',
      label: '景点星级',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择景点星级...',
        options: spotStarOptions,
      },
      column: 'left',
    },
    {
      name: 'open_status',
      label: '开放状态',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择景点开放状态...',
        options: openStatusOptions,
      },
      column: 'left',
    },
    {
      name: 'spot_desc',
      label: '景点描述',
      rules: 'required',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入景点描述...',
        isAllowClear: true,
        maxCount: 1000,
      },
      column: 'left',
    },
    {
      name: 'ticket_price',
      label: '门票',
      rules: 'required',
      type: 'number',
      formConfig: {
        placeholder: addSpot.is_ticket ? '请输入门票价格...' : '免费',
        isDisabled: addSpot.is_ticket ? false : true,
        prefix: '￥',
      },
      column: 'right',
    },
    {
      name: 'open_time',
      label: '开放时间',
      rules: 'required',
      type: 'timePicker',
      formConfig: {
        placeholder: '请选择时间...',
      },
      column: 'right',
    },
    {
      name: 'close_time',
      label: '结束时间',
      rules: 'required',
      type: 'timePicker',
      formConfig: {
        placeholder: '请选择时间...',
      },
      column: 'right',
    },
    {
      name: 'story_id',
      label: '关联故事',
      rules: 'optional',
      type: 'select',
      formConfig: {
        placeholder: '请选择关联的人文故事(可不填)',
        options: humanStoriesOptions,
      },
      column: 'right',
    },
    {
      name: 'spot_address',
      label: '景点地址',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入地址...',
        isAllowClear: true,
        count: { max: 50 },
      },
      column: 'right',
    },
    {
      name: 'area',
      label: '占地面积',
      rules: 'required number',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入占地面积(/平方米)...',
      },
      column: 'right',
    },
    {
      name: 'traffic_guide',
      label: '交通指南',
      rules: 'optional',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入交通指南...',
        maxCount: 500,
      },
      column: 'right',
    },
    {
      name: 'notice',
      label: '注意事项',
      rules: 'optional',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入注意事项...',
        maxCount: 500,
      },
      column: 'right',
    },
    {
      name: 'score',
      label: '评分',
      rules: 'required',
      type: 'rate',
      formConfig: {},
      column: 'right',
    },
  ];

  return {
    form,
    formFields,
    initialValues: addSpot,
  };
};

// 新增非遗
export const useAddHeritageForm = (params = {}) => {
  const {
    addHeritage = {},
    heritageTypeOptions = [],
    heritageTagsOptions = [],
    humanStoriesOptions = [],
  } = params;

  const [form] = Form.useForm();

  const formFields = [
    {
      name: 'heritage_name',
      label: '非遗名称',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入非遗名称...',
        isAllowClear: true,
        count: { max: 20 },
      },
      column: 'left',
    },
    {
      name: 'heritage_type',
      label: '非遗类型',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择/输入非遗类型...',
        isAllowClear: true,
        isShowSearch: true,
        options: heritageTypeOptions,
      },
      column: 'left',
    },
    {
      name: 'heritage_tags',
      label: '非遗标签',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择/输入非遗标签...',
        isAllowClear: true,
        isShowSearch: true,
        mode: 2,
        options: heritageTagsOptions,
      },
      column: 'left',
    },
    {
      name: 'heritage_image',
      label: '非遗图片',
      rules: 'required',
      type: 'upload',
      formConfig: {
        name: 'heritage_image',
        listType: 1,
        width: 200,
        src: addHeritage.heritage_image || '',
      },
      column: 'left',
    },
    {
      name: 'price',
      label: '单人价格',
      rules: 'required',
      type: 'number',
      formConfig: {
        placeholder: '请输入价格...',
        min: 0,
        prefix: '￥',
      },
      column: 'left',
    },
    {
      name: 'heritage_level',
      label: '非遗等级',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择您的非遗等级...',
        options: heritageLevelOptions,
      },
      column: 'left',
    },
    {
      name: 'heritage_desc',
      label: '非遗描述',
      rules: 'required',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入非遗描述...',
        isAllowClear: true,
        maxCount: 1000,
      },
      column: 'right',
    },
    {
      name: 'reserve_weeks',
      label: '预约周期',
      rules: 'required',
      type: 'number',
      formConfig: {
        placeholder: '请输入需要提前预约的天数...',
        min: 1,
        defaultValue: 1,
      },
      column: 'right',
    },
    {
      name: 'experience_duration',
      label: '体验时长',
      rules: 'required',
      type: 'number',
      formConfig: {
        placeholder: '请输入体验时长...',
        controls: false,
        suffix: '分钟',
      },
      column: 'right',
    },
    {
      name: 'story_id',
      label: '关联故事',
      rules: 'optional',
      type: 'select',
      formConfig: {
        placeholder: '请选择关联的人文故事(可不填)',
        options: humanStoriesOptions,
      },
      column: 'right',
    },
    {
      name: 'heritage_address',
      label: '场地地址',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入地址...',
        isAllowClear: true,
        count: { max: 50 },
      },
      column: 'right',
    },
    {
      name: 'suitable_people',
      label: '适合人群',
      rules: 'required',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入适合人群...',
      },
      column: 'right',
    },
    {
      name: 'notice',
      label: '注意事项',
      rules: 'optional',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入注意事项(可不填)...',
        maxCount: 500,
      },
      column: 'right',
    },
  ];

  return {
    form,
    formFields,
    initialValues: addHeritage,
  };
};

// 新增活动
export const useAddActivityForm = (params = {}) => {
  const {
    addActivity = {},
    scenicSpotsOptions = [],
    intangibleHeritageOptions = [],
  } = params;

  const [form] = Form.useForm();

  // 用 useWatch 直接监听表单值，不需要 useState
  const relateType = Form.useWatch('relate_type', form);

  // 先计算出relate_name的options
  const relateNameOptions = useMemo(() => {
    if (!relateType) return [];

    return relateType === 1 ? scenicSpotsOptions : intangibleHeritageOptions;
  }, [relateType, scenicSpotsOptions, intangibleHeritageOptions]);

  const formFields = useMemo(() => {
    return [
      {
        name: 'activity_name',
        label: '活动名称',
        rules: 'required string len4_20',
        type: 'textInput',
        formConfig: {
          placeholder: '请输入活动名称...',
          isAllowClear: true,
          count: {
            max: 20,
          },
        },
        column: 'left',
      },
      {
        name: 'relate_type',
        label: '关联类型',
        rules: 'required',
        type: 'radio',
        formConfig: {
          options: [
            { value: 1, label: '景点' },
            { value: 2, label: '非遗' },
          ],
        },
        //切换类型时，清空关联名称的值
        onChange: () => {
          form.setFieldsValue({ relate_name: undefined });
        },
        column: 'left',
      },
      {
        name: 'relate_name',
        label: '关联名称',
        rules: 'required',
        type: 'select',
        formConfig: {
          placeholder: '请选择关联的项目的名称...',
          isShowSearch: true,
          notFoundContent: '请先选择关联的类型',
          options: relateNameOptions,
        },
        column: 'left',
      },
      {
        name: 'start_time',
        label: '开始时间',
        rules: 'required date',
        type: 'date',
        formConfig: {
          placeholder: '请选择活动开始时间...',
        },
        column: 'left',
      },
      {
        name: 'end_time',
        label: '结束时间',
        rules: 'required date',
        type: 'date',
        formConfig: {
          placeholder: '请选择活动结束时间...',
        },
        column: 'left',
      },
      {
        name: 'address',
        label: '活动地址',
        rules: 'required',
        type: 'textInput',
        formConfig: {
          placeholder: '请输入活动地址...',
          isAllowClear: true,
          count: {
            max: 50,
          },
        },
        column: 'right',
      },
      {
        name: 'sponsor',
        label: '主办方',
        rules: 'required',
        type: 'textInput',
        formConfig: {
          placeholder: '请输入主办方...',
          isAllowClear: true,
          count: {
            max: 30,
          },
        },
        column: 'right',
      },
      {
        name: 'activity_desc',
        label: '活动描述',
        rules: 'required',
        type: 'textArea',
        formConfig: {
          placeholder: '请输入活动描述...',
          maxCount: 1000,
        },
        column: 'right',
      },
      {
        name: 'notice',
        label: '注意事项',
        rules: 'optional',
        type: 'textArea',
        formConfig: {
          placeholder: '请输入注意事项（可不填）...',
          maxCount: 500,
        },
        column: 'right',
      },
    ];
  }, [relateNameOptions, form]);

  const initialValues = useMemo(() => {
    return {
      ...addActivity,
      start_time: addActivity.start_time ? dayjs(addActivity.start_time) : null,
      end_time: addActivity.end_time ? dayjs(addActivity.end_time) : null,
    };
  }, [addActivity]);

  return {
    form,
    formFields,
    initialValues,
  };
};

// 新增新闻
export const useAddNewsForm = (params = {}) => {
  const { addNew = {}, userData } = params;

  const [form] = Form.useForm();

  const formFields = [
    {
      name: 'news_title',
      label: '新闻标题',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入新闻标题...',
        isAllowClear: true,
        count: { max: 50 },
      },
      column: 'left',
    },
    {
      name: 'news_image',
      label: '新闻图片',
      rules: 'required',
      type: 'upload',
      formConfig: {
        name: 'news_image',
        listType: 1,
        width: 200,
      },
      column: 'left',
    },
    {
      name: 'publisher',
      label: '发布者',
      rules: 'required',
      type: 'textInput',
      formConfig: {
        placeholder: userData.userName,
        isDisabled: true,
      },
      column: 'left',
    },
    {
      name: 'publish_unit',
      label: '发布单位',
      rules: 'required',
      type: 'textInput',
      formConfig: {
        placeholder: userData.department,
        isDisabled: true,
      },
      column: 'left',
    },
    {
      name: 'news_content',
      label: '新闻内容',
      rules: 'required',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入新闻公告的内容...',
        maxCount: 1000,
      },
      column: 'left',
    },
  ];

  return {
    form,
    formFields,
    initialValues: addNew,
  };
};
