import { Descriptions, Input, Modal, Select } from 'antd';
import './index.less';
import { useEffect, useState } from 'react';
import { CommonForm } from '..';

// 详情弹窗配置
// 新闻详情弹窗配置
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

// // 详情弹窗数据
// // 人员
// const dialogData = {
//   items:
//   title: `${identity[users.identity_type].identity}-${users.user_name}`,
//   width: 1000,
// };

const DialogCommon = ({
  dialogData,
  isShowDialog,
  onCancel,
  onOk,
  initialValue,
}) => {
  // 绑定无表单需要修改数据的弹窗的内部值
  const [formValue, setFormValue] = useState(initialValue || null);

  // 每一次弹窗打开时，同步表单中选择的表单项数据最新值给弹窗
  useEffect(() => {
    let timer = null;
    if (isShowDialog) {
      // 使用定时器延迟执行setState，以免状态更新循环
      timer = setTimeout(() => {
        setFormValue(initialValue ?? null);
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
          onClick={(e) => e.stopPropagation()}
          maskProps={{
            onClick: (e) => e.stopPropagation(),
          }}
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
          onOk={() => onOk?.(formValue)} //把值暴露出去
          style={{
            width: dialogData?.width || 500,
            height: dialogData?.height || 191,
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

            {dialogData?.data.options ? (
              <Select
                placeholder={dialogData?.data.placeholder || ''}
                showSearch={{ optionFilterProp: 'label' }}
                style={{ width: '100%' }}
                options={dialogData?.data.options || []}
                value={formValue}
                onChange={(value) => setFormValue(value)}
              />
            ) : (
              <Input
                placeholder={dialogData?.data.placeholder || ''}
                style={{ width: '100%' }}
                value={formValue}
                onChange={(value) => setFormValue(value)}
              />
            )}
          </div>
        </Modal>
      )}

      {/* 详情弹窗 */}
      {dialogData?.type === 3 && (
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

      {/* 确认框弹窗 */}
      {dialogData?.type === 4 && (
        <Modal
          title={dialogData.title}
          open={isShowDialog}
          onCancel={onCancel}
          onOk={onOk}
          cancelText="取消"
          okText="提交"
          style={{ maxWidth: 400 }}
        >
          <div className="py-4">{dialogData.content}</div>
        </Modal>
      )}
    </div>
  );
};

export default DialogCommon;
