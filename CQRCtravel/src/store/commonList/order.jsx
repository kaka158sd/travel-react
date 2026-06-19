// 订单相关

// 订单的状态通用样式项列表
export const statusStyle = [
  { status: 0, color: 'cyan', text: '待支付' },
  { status: 1, color: 'blue', text: '待核销' },
  { status: 2, color: 'green', text: '已完成' },
  { status: 3, color: 'grey', text: '已取消' },
  { status: 4, color: 'orange', text: '已过期' },
  { status: 5, color: 'red', text: '已退款' },
  { status: 6, color: 'magenta', text: '审核中' },
];

// 订单详情弹窗配置
export const orderLabel = [
  '非遗ID',
  '非遗名称',
  '单人价格',
  '联系人',
  '联系电话',
  '预约人数',
  '预约时间',
  '预约时段',
  '订单状态',
  '订单备注',
  '订单总价',
  '下单时间',
];
