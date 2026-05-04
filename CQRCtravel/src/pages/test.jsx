import { DialogCommon, CommonForm } from '@/components';
import { useState, useEffect } from 'react';
// import { getAdminsDepartmentAPI, getAdminsPositionAPI } from '@/apis/users';
import {
  getScenicSpotsAPI,
  // getSpotTagsAPI,
  // getSpotTypeAPI,
} from '@/apis/scenic_spots';
// import { getHumanStoriesAPI } from '@/apis/human_stories';
import {
  // getHeritageTypeAPI,
  getIntangibleHeritageAPI,
} from '@/apis/intangible_heritage';
// import { useReservationForm } from '@/hook/formFields/useReservationForm';
// import { useEditForm } from '@/hook/formFields/useEditForm';
// import { useUserForm } from '@/hook/formFields/useUserForm';
import {
  useAddActivityForm,
  // useAddSpotForm,
} from '@/hook/formFields/useAddForm';

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
// const user = {
//   // user_id: 1,
//   identity_type: 3,
//   user_name: '荣昌游客',
//   phone: '13800001111',
//   password: '123456a',
//   avatar:
//     'https://tse4-mm.cn.bing.net/th/id/OIP-C.dL40B4NwCkdjug6poBJ6bQAAAA?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   // created_time: '2026-04-20T10:19:55.337782+00:00',
//   privacyData: [
//     null,
//     // '我是一名热爱旅行、尤其钟情于重庆荣昌文旅风光的游客。喜欢打卡每一处古镇老街，探寻非遗背后的匠人故事，品尝地道的荣昌卤鹅、黄凉粉等特色美食，感受山水间的烟火气。每次来到荣昌，都能被这里的历史文化、自然风光和热情的民风打动，希望用脚步丈量荣昌的每一寸土地，用镜头记录这座城市的独特魅力，也期待在旅途中遇见更多志同道合的朋友，一起解锁更多荣昌的隐藏宝藏。',
//     null,
//     null,
//   ],
// };

// 修改表单
// const edit = {
//   // 手机号
//   // oldPhone: '13800001111',
//   // newPhone: '',
//   // code: '', //验证码固定为111111
//   editType: 2, //1：手机号；2：密码
//   // 密码
//   oldPassword: '123456aa',
//   newPassword: '',
//   passwordAgain: '',
// };

// 新增表单
// 景点
// const addSpot = {
//   // spot_id: 1,
//   spot_name: '万灵古镇',
//   spot_image:
//     'https://tse1-mm.cn.bing.net/th/id/OIP-C.kBlSRPpi00LXAXUljsfJ5wHaED?w=319&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   spot_desc:
//     '万灵古镇是宋代始建的千年古镇，依山傍水，明清建筑保存完好，曾为川渝重要水陆驿站，古桥、老街、宗祠遍布，兼具自然风光与厚重历史，是荣昌最具代表性的文化地标与旅游胜地。',
//   spot_tags: ['古风', '历史', '古镇'],
//   spot_type: '古镇',
//   spot_star: '4A',
//   open_status: '正常开放',
//   is_ticket: true,
//   ticket_price: 40.0,
//   open_time: '08:00:00',
//   close_time: '18:00:00',
//   spot_address: '荣昌区万灵镇',
//   story_id: 1,
//   // created_time: '2026-04-19T13:54:35.026635+00:00',
//   // updated_time: '2026-04-19T13:54:35.026635+00:00',
//   area: 126000.0,
//   traffic_guide: '乘106路公交',
//   notice: '文明游览',
//   score: 4.8,
//   comments: null,
// };
// 活动
const addActivity = {
  activity_id: 1,
  activity_name: '',
  activity_desc:
    '本次汉服巡游活动将带领游客身着传统汉服漫步千年古镇，沉浸式感受明清古风韵味，沿途欣赏古桥、流水、老街，参与古风互动、打卡拍照、民俗体验，让游客在历史场景中穿越古今，深度体验荣昌传统文化魅力。',
  notice: '',
  relate_type: null,
  relate_id: null,
  relate_name: null,
  start_time: '',
  end_time: '',
  address: '',
  sponsor: '',
};

const Test = () => {
  // 无表单但需要修改数据 - 从事领域
  // const [show, setShow] = useState(false);

  // const [heritageType, setHeritageType] = useState([]);
  // const [adminDepartment, setAdminDepartment] = useState([]);
  // const [adminPosition, setAdminPosition] = useState([]);
  // const [spotType, setSpotType] = useState([]);
  // const [spotTags, setSpotTags] = useState([]);
  // const [humanStories, setHumanStories] = useState([]);
  const [scenicSpots, setScenicSpots] = useState([]);
  const [intangibleHeritage, setIntangibleHeritage] = useState([]);

  useEffect(() => {
    // const getHeritageType = async () => {
    //   try {
    //     const res = await getHeritageTypeAPI();
    //     setHeritageType(res.data);
    //   } catch (error) {
    //     console.error('获取非遗类型失败', error);
    //   }
    // };
    // const getAdminDepartment = async () => {
    //   try {
    //     const res = await getAdminsDepartmentAPI();
    //     setAdminDepartment(res.data);
    //   } catch (error) {
    //     console.error('获取部门失败', error);
    //   }
    // };
    // const getAdminPosition = async () => {
    //   try {
    //     const res = await getAdminsPositionAPI();
    //     setAdminPosition(res.data);
    //   } catch (error) {
    //     console.error('获取职位失败', error);
    //   }
    // };
    // const getSpotType = async () => {
    //   try {
    //     const res = await getSpotTypeAPI();
    //     setSpotType(res.data);
    //   } catch (error) {
    //     console.error('获取景点类型失败', error);
    //   }
    // };
    // const getSpotTags = async () => {
    //   try {
    //     const res = await getSpotTagsAPI();
    //     setSpotTags(res.data);
    //   } catch (error) {
    //     console.error('获取景点标签失败', error);
    //   }
    // };
    // const getHumanStories = async () => {
    //   try {
    //     const res = await getHumanStoriesAPI();
    //     setHumanStories(res.data);
    //   } catch (error) {
    //     console.error('获取人文故事失败', error);
    //   }
    // };
    const getScenicSpots = async () => {
      try {
        const res = await getScenicSpotsAPI();
        setScenicSpots(res.data);
      } catch (error) {
        console.error('获取景点失败', error);
      }
    };
    const getIntangibleHeritage = async () => {
      try {
        const res = await getIntangibleHeritageAPI();
        setIntangibleHeritage(res.data);
      } catch (error) {
        console.error('获取非遗失败', error);
      }
    };

    // getHeritageType();
    // getAdminDepartment();
    // getAdminPosition();
    // getSpotType();
    // getSpotTags();
    // getHumanStories();
    getScenicSpots();
    getIntangibleHeritage();
  }, []);

  // 弹窗数据传参
  // 无表单但需修改数据的弹窗
  // const dialogData = {
  //   type: 2,
  //   data: {
  //     options: heritageType.map((item) => ({
  //       value: item.type_name,
  //       label: item.type_name,
  //     })),
  //     label: '从事领域',
  //     placeholder: '请输入/选择从事领域...',
  //     title: text ? '修改从事领域' : '填写从事领域',
  //   },
  //   width: 500,
  //   height: 500,
  // };

  // 有表单的弹窗
  // const { form, formFields, initialValues } = useEditForm(edit);
  // const dialogData = {
  //   type: 1,
  //   title: `修改${edit.editType === 1 ? '手机号' : '密码'}`,
  //   data: {
  //     formType: 'edit',
  //     form,
  //     maxWidth: 500,
  //     initialValues,
  //     formFields,
  //   },
  //   width: 500,
  // };

  // 选择器的列表options值-传承级别、从事领域、职位、部门
  // const heritageTypeOptions = heritageType?.map((item) => ({
  //   value: item.type_name,
  //   label: item.type_name,
  // }));
  // const adminDepartmentOptions = adminDepartment?.map((item) => ({
  //   value: item.department_name,
  //   label: item.department_name,
  // }));
  // const adminPositionOptions = adminPosition?.map((item) => ({
  //   value: item.position_name,
  //   label: item.position_name,
  // }));
  // const spotTypeOptions = spotType?.map((item) => ({
  //   value: item.type_name,
  //   label: item.type_name,
  // }));
  // const spotTagsOptions = spotTags?.map((item) => ({
  //   value: item.tag_name,
  //   label: item.tag_name,
  // }));
  // const humanStoriesOptions = humanStories?.map((item) => ({
  //   value: item.story_id,
  //   label: item.story_title,
  // }));
  const scenicSpotsOptions = scenicSpots?.map((item) => ({
    value: item.spot_id,
    label: item.spot_name,
  }));
  const intangibleHeritageOptions = intangibleHeritage?.map((item) => ({
    value: item.heritage_id,
    label: item.heritage_name,
  }));

  const { form, formFields, initialValues } = useAddActivityForm({
    addActivity,
    scenicSpotsOptions,
    intangibleHeritageOptions,
  });

  return (
    <div className="p-20">
      {/* <button className="btn2" onClick={() => setShow(true)}>
        弹窗测试
      </button> */}

      {/* 弹窗测试 */}
      {/* <DialogCommon
        isShowDialog={show}
        onCancel={() => {
          setShow(false);
        }}
        dialogData={dialogData}
        onOk={()=>setShow(false)}
      /> */}

      {/* 表单测试 */}
      <div className="mt-20">
        <CommonForm
          formType="add"
          form={form}
          maxWidth={1200}
          initialValues={initialValues}
          formFields={formFields || {}}
        />
      </div>
    </div>
  );
};

export default Test;
