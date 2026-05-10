import { DialogCommon } from '@/components';
import { statusStyle } from '@/store';
import { getDetailOrderItems } from '@/utils';
import { Button, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';

// 订单数据列表
const orderList = [
  {
    key: 2,
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

const OrderManage = () => {
  // 订单表格的顶部栏配置
  const tableColumns = [
    {
      title: '订单编号',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '客户姓名',
      dataIndex: 'contact_people',
      key: 'contact_people',
      render: (text) => <div className="text-blue-500">{text}</div>,
    },
    { title: '客户电话', dataIndex: 'contact_phone', key: 'contact_phone' },
    { title: '非遗项目', dataIndex: 'item_name', key: 'item_name' },
    { title: '服务时间', dataIndex: 'reserve_time', key: 'reserve_time' },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (_, { order_status }) => (
        <div>
          <Tag
            color={
              statusStyle.find((item) => item.status === order_status)?.color ||
              'cyan'
            }
            variant="filled"
          >
            {statusStyle.find((item) => item.status === order_status)?.text ||
              '待支付'}
          </Tag>
        </div>
      ),
    },
    {
      title: '订单操作',
      key: 'age',
      render: (record) => (
        <Button
          variant="text"
          color="blue"
          onClick={() => handleOpenDetailDialog(record.order_id)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState({});

  // 弹窗数据
  const dialogData = useMemo(() => {
    // 先判断是否有数据,初次渲染时dialogItem无数据，返回默认值
    if (!dialogItem?.order_id)
      return {
        type: 3,
        items: [],
        title: '',
      };

    // 获取订单详情弹窗的描述列表配置项
    const items = getDetailOrderItems(dialogItem);

    return {
      type: 3,
      items,
      title: `${dialogItem.item_name}-#${dialogItem.order_id}`,
      width: 1000,
    };
  }, [dialogItem]);

  // 订单详情弹窗点击事件
  const handleOpenDetailDialog = (id) => {
    const item = orderList.find((item) => item.order_id === id);
    setDialogItem(item || {});
    setIsShowDialog(true);
  };

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">订单管理</div>
      {/* 搜索框和筛选框 */}

      {/* 订单信息表格 */}
      <div className="my-8">
        <Table columns={tableColumns} dataSource={orderList} />
      </div>

      {/* 弹窗组件 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={() => setIsShowDialog(false)}
        dialogData={dialogData}
      />
    </div>
  );
};

export default OrderManage;
