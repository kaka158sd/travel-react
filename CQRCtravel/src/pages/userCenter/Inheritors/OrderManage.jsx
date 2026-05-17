import { DialogCommon } from '@/components';
import { statusStyle } from '@/store';
import { getDetailOrderItems } from '@/utils';
import { Button, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const OrderManage = () => {
  const { orderList = [] } = useOutletContext() || {};

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
      key: 'actions',
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

  // 处理传递给表格的数据
  const orders = orderList.map((item) => {
    return {
      ...item,
      key: item.order_id,
    };
  });

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
        <Table columns={tableColumns} dataSource={orders} />
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
