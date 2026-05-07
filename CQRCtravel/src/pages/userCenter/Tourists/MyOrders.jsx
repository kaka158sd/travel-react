import { Tag, Badge, Collapse, Steps, Button } from 'antd';
import dayjs from 'dayjs';
import './index.less';

// 订单数据
const ordersList = [
  {
    order_id: 1,
    tourist_id: 1,
    inheritor_id: null,
    business_type: 1,
    business_id: 1,
    item_name: '万灵古镇',
    single_price: 40.0,
    reserve_time: '2026-05-11',
    reserve_period: '09:00-12:00',
    contact_people: '刘六',
    contact_phone: '13800001111',
    total_price: 40.0,
    people_num: 1,
    remark: null,
    order_status: 0,
    order_time: '2026-04-19T13:54:35.026635+00:00',
  },
  {
    order_id: 2,
    tourist_id: 1,
    inheritor_id: 1,
    business_type: 2,
    business_id: 1,
    item_name: '荣昌陶烧制技艺',
    single_price: 128.0,
    reserve_time: '2026-05-01',
    reserve_period: '14:00-16:00',
    contact_people: '刘六',
    contact_phone: '13800001111',
    total_price: 256.0,
    people_num: 2,
    remark:
      '师傅您好！我本次专程前来体验荣昌陶制作技艺，内心十分期待沉浸式感受非遗手工的独特魅力。我零基础入门，陶艺动手经验比较欠缺，操作起来可能会有些生疏笨拙，麻烦您教学时可以多一些耐心，放慢讲解节奏，细致示范每一步制作流程。\r\n我希望本次体验以**红色主题**为创作核心，亲手制作一款陶瓷水杯。希望在塑形、雕花、装饰与配色设计上，融入红色文化元素，贴合主题风格。过程中若我操作有误，还请您及时指正、耐心引导，帮我完成这款专属的红色主题陶杯，用心感受荣昌陶千年匠心与红色文化结合的独特韵味。',
    order_status: 0,
    order_time: '2026-04-19T13:54:35.026635+00:00',
  },
];

// 订单的状态通用样式项列表
const statusStyle = [
  { status: 0, color: 'cyan', text: '待支付' },
  { status: 1, color: 'blue', text: '待核销' },
  { status: 2, color: 'green', text: '已完成' },
  { status: 3, color: 'grey', text: '已取消' },
  { status: 4, color: 'orange', text: '已过期' },
  { status: 5, color: 'red', text: '已退款' },
];

// 订单操作按钮样式
const actionsStyle = [
  { key: 1, text: '支付', status: 0, color: 'danger' },
  { key: 2, text: '取消', status: 0, color: '' },
  { key: 3, text: '完成', status: 1, color: 'blue' },
  { key: 4, text: '退款', status: 1, color: 'orange' },
  { key: 5, text: '评论', status: 2, color: '' },
];

// 订单状态映射
// 0：待支付
// 1：待核销
// 2：已完成
// 3：已取消
// 4：已过期
// 5：已退款
// 根据订单状态生成 Steps 步骤条 items
const getOrderStepItems = (orderStatus) => {
  // 基础正常流程步骤
  const baseSteps = [
    {
      title: '提交预约',
      content: '已成功提交项目预约信息，订单已创建',
    },
    {
      title: '支付订单',
      content: '订单待支付，请在有效期内完成付款',
    },
    {
      title: '待核销',
      content: '支付成功，凭核销码前往项目场景使用',
    },
    {
      title: '已完成',
      content: '预约核销成功，本次文旅体验已结束',
    },
  ];

  // 异常状态处理
  if (orderStatus === 3) {
    // 已取消
    return [
      {
        title: '提交预约',
        status: 'finish',
        content: '预约信息提交成功',
      },
      {
        title: '已取消',
        status: 'error',
        content: '订单已主动取消，可重新发起预约',
      },
    ];
  }

  if (orderStatus === 4) {
    // 已过期
    return [
      {
        title: '提交预约',
        status: 'finish',
        content: '预约信息提交成功',
      },
      {
        title: '已过期',
        status: 'error',
        content: '订单已超过支付/使用有效期，已自动关闭',
      },
    ];
  }

  if (orderStatus === 5) {
    // 已退款
    return [
      {
        title: '提交预约',
        status: 'finish',
        content: '预约信息提交成功',
      },
      {
        title: '支付订单',
        status: 'finish',
        content: '已完成订单支付',
      },
      {
        title: '已退款',
        status: 'error',
        content: '订单已申请退款，退款金额将原路退回',
      },
    ];
  }

  // 正常流程状态
  let currentStepIndex;
  switch (orderStatus) {
    case 0:
      currentStepIndex = 1;
      break;
    case 1:
      currentStepIndex = 2;
      break;
    case 2:
      currentStepIndex = 3;
      break;
    default:
      currentStepIndex = 0;
  }

  // 给每个步骤加上状态（finish/process/wait）
  return baseSteps.map((step, index) => {
    let stepStatus;
    if (index < currentStepIndex) {
      stepStatus = 'finish';
    } else if (index === currentStepIndex) {
      stepStatus = 'process';
    } else stepStatus = 'wait';

    return {
      ...step,
      status: stepStatus,
    };
  });
};

const MyOrders = () => {
  return (
    <div>
      <div className="max-w-280 min-h-200 mx-auto border-x-2 border-x-amber-400 py-1 px-6">
        <div className="w-full text-xl text-center font-semibold tracking-widest py-4 border my-0 rounded-lg border-amber-500 bg-[#fff7eb]">
          我的订单
        </div>
        {/* 筛选框和搜索框 */}

        {/* 订单列表 */}
        <div className="my-8 px-3 flex flex-col gap-y-4">
          {ordersList.map((item) => {
            const currentStatus = item.order_status;
            const currentType = item.business_type;
            const stepsItems = getOrderStepItems(currentStatus);

            return (
              <div
                className="flex justify-between gap-4 items-center"
                key={item.order_id}
              >
                {/* 订单展示部分 */}
                <div className="w-full">
                  <Badge.Ribbon
                    text={
                      statusStyle.find((item) => item.status === currentStatus)
                        ?.text || '待支付'
                    }
                    color={
                      statusStyle.find((item) => item.status === currentStatus)
                        ?.color || 'cyan'
                    }
                  >
                    <div
                      className={`w-full border border-olive-300 rounded-lg px-4 py-2 ${item.business_type === 1 ? 'order-bgimage1' : 'order-bgimage2'}`}
                    >
                      {/* 订单第一行：业务类型+ 项目名称     订单状态 */}
                      <div className="mb-2">
                        <Tag
                          color={currentType === 1 ? '#87d068' : '#2db7f5'}
                          variant="solid"
                        >
                          {currentType === 1 ? '景点' : '非遗'}
                        </Tag>
                        <span className="ml-2 text-lg font-semibold opacity-85">
                          {item.item_name}
                        </span>
                      </div>

                      {/* 订单第二行：单人价格  预约时间 + 预约时段 */}
                      <div className="flex justify-between">
                        <span>
                          {currentType === 1 ? '门票' : '非遗体验'}
                          价格：￥{item.single_price}元/人
                        </span>
                        <div>
                          预约时间：
                          <span className="mr-2">{item.reserve_time}</span>
                          <span>{item.reserve_period}</span>
                        </div>
                      </div>

                      {/* 订单第三行：联系人 + 联系电话 + 预约人数 */}
                      <div className="flex justify-between items-center">
                        <span className="text-base py-2">
                          <span className="mr-2">{item.contact_people}</span>
                          <span>{item.contact_phone}</span>
                        </span>
                        {item.business_type === 2 && (
                          <span>预约人数：{item.people_num}</span>
                        )}
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          {/* 订单第四行：订单编号 */}
                          <div>订单编号:{item.order_id}</div>

                          {/* 订单第五行：下单时间 订单总价 */}
                          <span>
                            下单时间：
                            {dayjs(item.order_time).format('YYYY-MM-DD')}
                          </span>
                        </div>
                        <span className="text-right">
                          支付金额：￥
                          <span className="text-2xl mr-1">
                            {item.total_price}
                          </span>
                          元
                        </span>
                      </div>
                    </div>

                    {/* 折叠面板：展示进度 */}
                    <div>
                      <Collapse
                        size="small"
                        bordered={false}
                        items={[
                          {
                            key: '1',
                            label: (
                              <div className="flex justify-between">
                                <span />
                                <span>展开</span>
                              </div>
                            ),
                            showArrow: false,
                            children: (
                              <Steps
                                orientation="vertical"
                                items={stepsItems}
                                current={stepsItems.findIndex(
                                  (item) => item.status === 'process',
                                )}
                                size="small"
                              />
                            ),
                          },
                        ]}
                      />
                    </div>
                  </Badge.Ribbon>
                </div>

                {/* 按钮部分 */}
                <div className="flex flex-col gap-4">
                  {actionsStyle.map(
                    (item) =>
                      item.status === currentStatus && (
                        <Button
                          key={item.key}
                          color={item.color}
                          variant="solid"
                        >
                          {item.text}
                        </Button>
                      ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
