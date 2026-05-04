import { Descriptions, Modal, Select } from 'antd';
import './index.less';
import { useEffect, useState } from 'react';
import { CommonForm } from '..';

// 详情弹窗配置
// 新闻详情弹窗配置
// const label = ['新闻图片', '发布者', '发布单位', '新闻内容', '发布时间'];
// const news = {
//   news_id: 1,
//   news_title: '荣昌卤鹅文化节盛大开幕，打响“中国鹅城”品牌',
//   news_image:
//     'https://tse2-mm.cn.bing.net/th/id/OIP-C.kLFnXz5TrBdLv4U-u-8RoQHaDt?w=341&h=175&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   publisher: '文旅宣传科',
//   publish_unit: '荣昌区文旅委',
//   news_content:
//     '荣昌区举办首届卤鹅文化节，活动包含卤鹅美食大赛、非遗展示、文艺演出等，吸引上万游客打卡。',
//   publish_time: '2026-04-19T11:51:42.195248+00:00',
// };

// 订单的状态通用样式项列表
// const statusStyle = [
//   { status: 0, color: 'cyan', text: '待支付' },
//   { status: 1, color: 'blue', text: '待核销' },
//   { status: 2, color: 'green', text: '已完成' },
//   { status: 3, color: 'grey', text: '已取消' },
//   { status: 4, color: 'orange', text: '已过期' },
//   { status: 5, color: 'red', text: '已退款' },
// ];
// 订单详情弹窗配置
// const label1 = [
//   '非遗ID',
//   '非遗名称',
//   '单人价格',
//   '联系人',
//   '联系电话',
//   '预约人数',
//   '预约时间',
//   '预约时段',
//   '订单状态',
//   '订单备注',
//   '订单总价',
//   '下单时间',
// ];
// const orders = {
//   order_id: 2,
//   tourist_id: 1,
//   inheritor_id: 1,
//   business_type: 2,
//   business_id: 1,
//   item_name: '荣昌陶烧制技艺',
//   single_price: 128.0,
//   reserve_time: '2026-05-01',
//   reserve_period: '14:00-16:00',
//   contact_people: '刘六',
//   contact_phone: '13800001111',
//   total_price: 256.0,
//   people_num: 2,
//   remark:
//     '师傅您好！我本次专程前来体验荣昌陶制作技艺，内心十分期待沉浸式感受非遗手工的独特魅力。我零基础入门，陶艺动手经验比较欠缺，操作起来可能会有些生疏笨拙，麻烦您教学时可以多一些耐心，放慢讲解节奏，细致示范每一步制作流程。\r\n我希望本次体验以**红色主题**为创作核心，亲手制作一款陶瓷水杯。希望在塑形、雕花、装饰与配色设计上，融入红色文化元素，贴合主题风格。过程中若我操作有误，还请您及时指正、耐心引导，帮我完成这款专属的红色主题陶杯，用心感受荣昌陶千年匠心与红色文化结合的独特韵味。',
//   order_status: 0,
//   order_time: '2026-04-19T13:54:35.026635+00:00',
// };
// // 订单状态的徽标样式
// const statusBadge = statusStyle.find(
//   (item) => item.status === orders.order_status,
// );

// 活动详情弹窗配置
// const activities = {
//   activity_id: 1,
//   activity_name: '万灵古镇汉服巡游',
//   activity_desc:
//     '本次汉服巡游活动将带领游客身着传统汉服漫步千年古镇，沉浸式感受明清古风韵味，沿途欣赏古桥、流水、老街，参与古风互动、打卡拍照、民俗体验，让游客在历史场景中穿越古今，深度体验荣昌传统文化魅力。',
//   notice: null,
//   relate_type: 1,
//   relate_id: 1,
//   relate_name: '万灵古镇',
//   start_time: '2025-04-25T10:00:00+00:00',
//   end_time: '2025-04-30T16:00:00+00:00',
//   address: '万灵古镇',
//   sponsor: '荣昌文旅委',
//   created_time: '2026-04-20T15:19:30.539685+00:00',
// };
// const label2 = [
//   '活动ID',
//   '活动名称',
//   '关联类型',
//   activities.relate_type === 1 ? '景点ID' : '非遗ID',
//   activities.relate_type === 1 ? '景点名称' : '非遗名称',
//   '活动时间',
//   '活动地址',
//   '主办方',
//   '活动描述',
//   '注意事项',
//   '创建时间',
// ];

// 用户详情弹窗配置
// const users = {
//   user_id: 1,
//   identity_type: 1,
//   user_name: '荣昌游客',
//   phone: '13800001111',
//   password: '123456a',
//   avatar:
//     'https://tse4-mm.cn.bing.net/th/id/OIP-C.dL40B4NwCkdjug6poBJ6bQAAAA?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   created_time: '2026-04-20T10:19:55.337782+00:00',
//   privacyData: [
//     '我是一名热爱旅行、尤其钟情于重庆荣昌文旅风光的游客。喜欢打卡每一处古镇老街，探寻非遗背后的匠人故事，品尝地道的荣昌卤鹅、黄凉粉等特色美食，感受山水间的烟火气。每次来到荣昌，都能被这里的历史文化、自然风光和热情的民风打动，希望用脚步丈量荣昌的每一寸土地，用镜头记录这座城市的独特魅力，也期待在旅途中遇见更多志同道合的朋友，一起解锁更多荣昌的隐藏宝藏。',
//     'visitor@rc.com',
//   ],
// };
// // 用户身份
// const identity = {
//   1: { identity: '游客', label: ['个性签名', '邮箱'] },
//   2: { identity: '文化传承人', label: ['传承级别', '从事领域'] },
//   3: { identity: '文旅局管理员', label: ['单位', '部门'] },
// };
// const label3 = [
//   '用户ID',
//   '用户名称',
//   '用户头像',
//   '手机号',
//   identity[users.identity_type].label[0],
//   identity[users.identity_type].label[1],
//   '创建时间',
// ];

// // 详情弹窗数据
// // 新闻
// const dialogData = {
//   items: [
//     {
//       key: '1',
//       label: label[0],
//       children: <img src={news.news_image} />,
//       span: 3,
//     },
//     {
//       key: '2',
//       label: label[1],
//       children: news.publisher,
//     },
//     {
//       key: '3',
//       label: label[2],
//       children: news.publish_unit,
//       span: 'filled',
//     },
//     {
//       key: '4',
//       label: label[3],
//       children: news.news_content,
//       span: 3,
//     },
//     {
//       key: '5',
//       label: label[4],
//       children: dayjs(news.publish_time).format('YYYY-MM-DD HH:mm'),
//     },
//   ],
//   title: news.news_title,
//   width: 1000,
// };
// // 订单
// const dialogData = {
//   items: [
//     { key: '1', label: label1[0], children: orders.business_id },
//     { key: '2', label: label1[1], children: orders.item_name },
//     { key: '3', label: label1[2], children: `￥${orders.single_price}元` },
//     { key: '4', label: label1[3], children: orders.contact_people },
//     { key: '5', label: label1[4], children: orders.contact_phone },
//     { key: '6', label: label1[5], children: orders.people_num },
//     { key: '7', label: label1[6], children: orders.reserve_time },
//     { key: '8', label: label1[7], children: orders.reserve_period },
//     {
//       key: '9',
//       label: label1[8],
//       children: (
//         <div>
//           <Badge color={statusBadge.color} text={statusBadge.text} />
//         </div>
//       ),
//     },
//     {
//       key: '10',
//       label: label1[9],
//       children: orders.remark || '无',
//       span: 3,
//     },
//     { key: '11', label: label1[10], children: `￥${orders.total_price}元` },
//     {
//       key: '12',
//       label: label1[11],
//       children: dayjs(orders.order_time).format('YYYY-MM-DD HH:mm'),
//     },
//   ],
//   title: `${orders.item_name}-#${orders.order_id}`,
//   width: 1000,
// };
// // 活动
// const dialogData = {
//   items: [
//     { key: '1', label: label2[0], children: activities.activity_id },
//     {
//       key: '2',
//       label: label2[1],
//       children: activities.activity_name,
//       span: 'filled',
//     },
//     {
//       key: '3',
//       label: label2[2],
//       children: activities.relate_type === 1 ? '景点' : '非遗',
//     },
//     { key: '4', label: label2[3], children: activities.relate_id },
//     { key: '5', label: label2[4], children: activities.relate_name },
//     {
//       key: '6',
//       label: label2[5],
//       children: `${dayjs(activities.start_time).format('YYYY-MM-DD')} - ${dayjs(activities.end_time).format('YYYY-MM-DD')}`,
//     },
//     { key: '7', label: label2[6], children: activities.address },
//     { key: '8', label: label2[7], children: activities.sponsor },
//     { key: '9', label: label2[8], children: activities.activity_desc, span: 3 },
//     {
//       key: '10',
//       label: label2[9],
//       children: activities.notice || '无',
//       span: 3,
//     },
//     {
//       key: '11',
//       label: label2[10],
//       children: dayjs(activities.created_time).format('YYYY-MM-DD HH:mm'),
//     },
//   ],
//   title: `活动详情-${activities.activity_name}`,
//   width: 1000,
// };
// // 人员
// const dialogData = {
//   items: [
//     { key: '1', label: label3[0], children: users.user_id, span: 3 },
//     {
//       key: '2',
//       label: label3[1],
//       children: users.user_name,
//     },
//     {
//       key: '3',
//       label: label3[2],
//       children: (
//         <DataField type="avatar" formConfig={{ size: 60, src: users.avatar }} />
//       ),
//     },
//     { key: '4', label: label3[3], children: users.phone },
//     {
//       key: '5',
//       label: label3[4],
//       children: (
//         <div className="w-134 line-clamp-1">{users.privacyData[0]}</div>
//       ),
//       span: 2,
//     },
//     {
//       key: '6',
//       label: label3[5],
//       children: users.privacyData[1],
//     },
//     {
//       key: '7',
//       label: label3[6],
//       children: dayjs(users.created_time).format('YYYY-MM-DD HH:mm:ss'),
//     },
//   ],
//   title: `${identity[users.identity_type].identity}-${users.user_name}`,
//   width: 1000,
// };

//

const DialogCommon = ({
  dialogData,
  isShowDialog,
  onCancel,
  onOk,
  initialValue,
}) => {
  // 绑定无表单需要修改数据的弹窗的内部值
  const [selectedValue, setSelectedValue] = useState(initialValue || null);

  // 每一次弹窗打开时，同步表单中选择的表单项数据最新值给弹窗
  useEffect(() => {
    let timer = null;
    if (isShowDialog) {
      // 使用定时器延迟执行setState，以免状态更新循环
      timer = setTimeout(() => {
        setSelectedValue(initialValue ?? null);
      }, 0);
    }

    // 清除定时器：组件卸载/依赖变化
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isShowDialog, initialValue]);

  return (
    <div>
      {/* 有表单的弹窗 */}
      {dialogData.type === 1 && (
        <Modal
          title={dialogData.title}
          open={isShowDialog}
          onCancel={onCancel}
          onOk={onOk}
          width={dialogData.width || 500}
          cancelText="取消"
          okText="提交"
          className="dialogStyle"
        >
          <div className="border border-amber-500 py-4 rounded-lg">
            <CommonForm
              formType={dialogData.data.formType}
              form={dialogData.data.form}
              maxWidth={dialogData.data.maxWidth}
              initialValues={dialogData.data.initialValues}
              formFields={dialogData.data.formFields}
            />
          </div>
        </Modal>
      )}

      {/* 无表单但需修改数据弹窗 */}
      {dialogData?.type === 2 && (
        <Modal
          title={dialogData?.data.title || ''}
          open={isShowDialog}
          onCancel={onCancel}
          onOk={() => onOk?.(selectedValue)} //把值暴露出去
          style={{
            width: dialogData?.width || 500,
            height: dialogData?.height || 500,
          }}
          cancelText="取消"
          okText="确认"
        >
          <div className="my-8 flex gap-2 items-center">
            <div
              className={`${dialogData?.data.label.length <= 2 ? 'w-12' : 'w-20'}`}
            >
              {dialogData?.data.label || ''} :
            </div>
            <Select
              placeholder={dialogData?.data.placeholder || ''}
              showSearch={{ optionFilterProp: 'label' }}
              style={{ width: '100%' }}
              options={dialogData?.data.options}
              value={selectedValue}
              onChange={(value) => setSelectedValue(value)}
            />
          </div>
        </Modal>
      )}

      {/* 详情弹窗 */}
      {dialogData.type === 3 && (
        <Modal
          open={isShowDialog}
          onCancel={onCancel}
          footer={<></>}
          width={dialogData.width || 1000}
          className="dialogStyle"
        >
          <Descriptions
            title={dialogData.title}
            bordered
            items={dialogData.items}
          />
        </Modal>
      )}
    </div>
  );
};

export default DialogCommon;
