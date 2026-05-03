import { getHeritageTypeAPI } from '@/apis/intangible_heritage';
import { CommonForm, DialogCommon } from '@/components';
import { Form, Popconfirm } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { getAdminsDepartmentAPI, getAdminsPositionAPI } from '@/apis/users';
import { getSpotTagsAPI, getSpotTypeAPI } from '@/apis/scenic_spots';
import { getHumanStoriesAPI } from '@/apis/human_stories';

// 订单表单
// const orders = {
//   // order_id: 2, //数据库自增
//   // tourist_id: 1, //不在表单范围内
//   // inheritor_id: 1, //不在表单范围内
//   business_type: 1, //需要传参给表单
//   // business_id: 1, //不在表单范围内
//   item_name: '荣昌陶烧制技艺', //需要传参给表单
//   single_price: 128.0, //需要传参给表单
//   // reserve_time: '2026-05-01',
//   // reserve_period: '14:00-16:00',
//   // contact_people: '刘六',
//   // contact_phone: '13800001111',
//   // total_price: 256.0,
//   // people_num: 2,
//   // remark:'师傅您好！我本次专程前来体验荣昌陶制作技艺，内心十分期待沉浸式感受非遗手工的独特魅力。我零基础入门，陶艺动手经验比较欠缺，操作起来可能会有些生疏笨拙，麻烦您教学时可以多一些耐心，放慢讲解节奏，细致示范每一步制作流程。\r\n我希望本次体验以**红色主题**为创作核心，亲手制作一款陶瓷水杯。希望在塑形、雕花、装饰与配色设计上，融入红色文化元素，贴合主题风格。过程中若我操作有误，还请您及时指正、耐心引导，帮我完成这款专属的红色主题陶杯，用心感受荣昌陶千年匠心与红色文化结合的独特韵味。',
//   // order_status: 0, //不在表单范围内
//   // order_time: '2026-04-19T13:54:35.026635+00:00', //数据库自动生成
// };

// 个人信息表单(传递给表单用于渲染的初始值)
const users = {
  // user_id: 1,
  identity_type: 2,
  user_name: '荣昌游客',
  phone: '13800001111',
  password: '123456a',
  avatar:
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.dL40B4NwCkdjug6poBJ6bQAAAA?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  // created_time: '2026-04-20T10:19:55.337782+00:00',
  privacyData: [
    '我是一名热爱旅行、尤其钟情于重庆荣昌文旅风光的游客。喜欢打卡每一处古镇老街，探寻非遗背后的匠人故事，品尝地道的荣昌卤鹅、黄凉粉等特色美食，感受山水间的烟火气。每次来到荣昌，都能被这里的历史文化、自然风光和热情的民风打动，希望用脚步丈量荣昌的每一寸土地，用镜头记录这座城市的独特魅力，也期待在旅途中遇见更多志同道合的朋友，一起解锁更多荣昌的隐藏宝藏。',
    null,
    null,
  ],
};
// 用户身份
const identity = {
  1: ['个性签名'],
  2: ['个人简介', '传承级别', '从事领域'],
  3: ['职位', '部门'],
};

const Test = () => {
  // 无表单但需要修改数据 - 从事领域
  const [text, setText] = useState(null);
  const [show, setShow] = useState(false);

  const [heritageType, setHeritageType] = useState([]);
  const [adminDepartment, setAdminDepartment] = useState([]);
  const [adminPosition, setAdminPosition] = useState([]);
  const [spotType, setSpotType] = useState([]);
  const [spotTags, setSpotTags] = useState([]);
  const [humanStories, setHumanStories] = useState([]);

  useEffect(() => {
    const getHeritageType = async () => {
      try {
        const res = await getHeritageTypeAPI();
        setHeritageType(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getAdminDepartment = async () => {
      try {
        const res = await getAdminsDepartmentAPI();
        setAdminDepartment(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getAdminPosition = async () => {
      try {
        const res = await getAdminsPositionAPI();
        setAdminPosition(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getSpotType = async () => {
      try {
        const res = await getSpotTypeAPI();
        setSpotType(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getSpotTags = async () => {
      try {
        const res = await getSpotTagsAPI();
        setSpotTags(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getHumanStories = async () => {
      try {
        const res = await getHumanStoriesAPI();
        setHumanStories(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };

    getHeritageType();
    getAdminDepartment();
    getAdminPosition();
    getSpotType();
    getSpotTags();
    getHumanStories();
  }, []);

  // 弹窗数据传参
  const dialogData = {
    type: 2,
    data: {
      options: heritageType.map((item) => ({
        value: item.type_name,
        label: item.type_name,
      })),
      label: '从事领域',
      placeholder: '请输入/选择从事领域...',
      title: text ? '修改从事领域' : '填写从事领域',
    },
    width: 500,
    height: 500,
  };

  // 获取选择的数据并关闭弹窗
  const handleConfirm = (value) => {
    setText(value);
    setShow(false);
  };

  // 选择器的列表options值-传承级别、从事领域、职位、部门
  const heritageLevelOptions = ['世界级', '国家级', '省级', '市级', '县级'].map(
    (item) => ({
      value: item,
      label: item,
    }),
  );
  const heritageTypeOptions = heritageType?.map((item) => ({
    value: item.type_name,
    label: item.type_name,
  }));
  const adminDepartmentOptions = adminDepartment?.map((item) => ({
    value: item.department_name,
    label: item.department_name,
  }));
  const adminPositionOptions = adminPosition?.map((item) => ({
    value: item.position_name,
    label: item.position_name,
  }));
  const spotTypeOptions = spotType?.map((item) => ({
    value: item.type_name,
    label: item.type_name,
  }));
  const spotTagsOptions = spotTags?.map((item) => ({
    value: item.tag_name,
    label: item.tag_name,
  }));
  const humanStoriesOptions = humanStories?.map((item) => ({
    value: item.story_id,
    label: item.story_title,
  }));

  const [form] = Form.useForm();
  // 预约表单传递数据
  // const formFields = [
  //   {
  //     name: 'item_name',
  //     label: '预约项目',
  //     rules: 'required',
  //     type: 'textInput',
  //     formConfig: {
  //       placeholder: orders.item_name,
  //       isDisabled: true,
  //     },
  //   },
  //   {
  //     name: 'single_price',
  //     label: '项目单价',
  //     rules: 'required',
  //     type: 'textInput',
  //     formConfig: {
  //       placeholder: orders.single_price,
  //       defaultValue: orders.single_price,
  //       isDisabled: true,
  //     },
  //   },
  //   {
  //     name: 'reserve_time',
  //     label: '预约日期',
  //     rules: 'required date',
  //     type: 'date',
  //     formConfig: {
  //       placeholder: '请选择日期',
  //     },
  //   },
  //   {
  //     name: 'reserve_period',
  //     label: '预约时段',
  //     rules: 'required',
  //     type: 'select',
  //     formConfig: {
  //       placeholder: '请选择时段',
  //       options: [
  //         '8:00-10:00',
  //         '10:00-12:00',
  //         '12:00-14:00',
  //         '14:00-16:00',
  //         '16:00-18:00',
  //       ].map((item) => ({
  //         value: item,
  //         label: item,
  //       })),
  //       defaultValue: '8:00-10:00',
  //     },
  //   },
  //   {
  //     name: 'contact_people',
  //     label: '联系人',
  //     rules: 'required len1_10',
  //     type: 'textInput',
  //     formConfig: {
  //       placeholder: '请填写姓名',
  //     },
  //   },
  //   {
  //     name: 'contact_phone',
  //     label: '联系电话',
  //     rules: 'required phone',
  //     type: 'textInput',
  //     formConfig: {
  //       placeholder: '请填写联系电话',
  //     },
  //   },
  //   orders.business_type === 1 && {
  //     name: 'people_num',
  //     label: '预约人数',
  //     rules: 'optional',
  //     type: 'number',
  //     formConfig: {
  //       placeholder: '请填写预约人数',
  //       defaultValue: 1,
  //       min: 1,
  //     },
  //   },
  //   orders.business_type === 1 && {
  //     name: 'remark',
  //     label: '留言',
  //     rules: 'optional',
  //     type: 'textArea',
  //     formConfig: {
  //       placeholder: '请写下想对传承人说的话吧...',
  //       maxCount: 500,
  //     },
  //   },
  // ];

  // 个人信息表单的数据项
  const formFields = useMemo(() => {
    // 提前将用户身份相应的特殊label解构出来
    const currentIdentityLabel = identity[users.identity_type];
    const [labelText0, labelText1, labelText2] = currentIdentityLabel || [];

    return (
      [
        {
          name: 'avatar',
          label: '头像',
          rules: 'optional',
          type: 'upload',
          formConfig: {
            name: 'avatarUpload',
            listType: 2,
            width: 150,
            src: users.avatar,
          },
        },
        {
          name: 'user_name',
          label: '用户名',
          rules: 'required',
          type: 'textInput',
          formConfig: {
            placeholder: '',
            isAllowClear: users.identity_type === 1 ? true : false,
            isDisabled: users.identity_type === 1 ? false : true,
            suffix:
              users.identity_type === 1
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
          },
        },
        {
          name: 'phone',
          label: '手机号',
          rules: 'required phone',
          type: 'textInput',
          formConfig: {
            placeholder: '',
            allowClear: true,
          },
        },
        labelText1
          ? {
              name: 'privacyData[1]',
              label: labelText1,
              rules: 'optional',
              type: 'dialog',
              formConfig: {
                labelText: labelText1,
                options:
                  users.identity_type === 2
                    ? heritageLevelOptions
                    : adminPositionOptions,
              },
              // 个人信息表单中相关的弹窗信息
              userDialogData: {
                type: 2,
                data: {
                  label: labelText1,
                  placeholder: `请输入/选择${labelText1}...`,
                  title: users.privacyData[1]
                    ? `修改${labelText1}`
                    : `填写${labelText1}`,
                  options:
                    users.identity_type === 2
                      ? heritageLevelOptions
                      : adminPositionOptions,
                },
              },
            }
          : null,
        labelText2
          ? {
              name: 'privacyData[2]',
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
                  title: users.privacyData[2]
                    ? `修改${labelText2}`
                    : `填写${labelText2}`,
                  options: heritageTypeOptions,
                },
              },
            }
          : null,
        {
          name: 'privacyData[0]',
          label: labelText0,
          rules: 'optional',
          type: users.identity_type === 3 ? 'dialog' : 'textArea',
          formConfig:
            users.identity_type === 3
              ? {
                  labelText: labelText0,
                  options: adminDepartmentOptions,
                }
              : {
                  placeholder: `请输入你的${labelText0}...`,
                  maxCount: 300,
                },
          // 个人信息表单中相关的弹窗信息
          userDialogData:
            users.identity_type === 3
              ? {
                  type: 2,
                  data: {
                    label: labelText0,
                    placeholder: `请输入/选择${labelText0}...`,
                    title: users.privacyData[0]
                      ? `修改${labelText0}`
                      : `填写${labelText0}`,
                    options: adminDepartmentOptions,
                  },
                }
              : null,
        },
      ].filter(Boolean) || []
    );
  }, [users, adminDepartment, adminPosition, heritageType]);

  return (
    <div className="p-20">
      {/* 弹窗测试 */}
      <div className="w-80 flex items-center">
        <p className="w-24">从事领域:</p>
        <div className="input-style flex justify-between relative">
          {/* 拿到值后渲染页面 */}
          <p className={`${text ? 'text-black' : ''}`}>
            {text ? text : '请填写从事领域'}
          </p>
          {/* 当第一次点击按钮时直接打开弹窗，之后都需要经过气泡确认框才能打开弹窗 */}
          {text ? (
            <Popconfirm
              title="确认要修改吗？"
              description="请慎重选择是否要修改你的从事领域！"
              onConfirm={() => setShow(true)}
              okText="是"
              cancelText="否"
            >
              <i className="iconfont icon-chuangzuo absolute top-0.5 right-3 cursor-pointer hover:text-[#d97706]" />
            </Popconfirm>
          ) : (
            <i
              onClick={() => setShow(true)}
              className="iconfont icon-chuangzuo text-color1 hover:scale-110 absolute top-0.5 right-3 cursor-pointer"
            />
          )}
        </div>
      </div>

      <DialogCommon
        isShowDialog={show}
        onCancel={() => {
          setShow(false);
        }}
        dialogData={dialogData}
        onOk={handleConfirm}
      />

      {/* 表单测试 */}
      <div className="mt-20">
        {/* <CommonForm formType={'user'} />'reservation'
        <CommonForm formType={'edit'} />
        <CommonForm formType={'add'} /> */}
        <CommonForm
          formType="user"
          form={form}
          maxWidth={600}
          initialValues={users}
          formFields={formFields}
        />
      </div>
    </div>
  );
};

export default Test;
