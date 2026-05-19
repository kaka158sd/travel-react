import { DialogCommon, SearchAndFilter } from '@/components';
import { usePageList } from '@/hook';
import { statusStyle } from '@/store';
import { getDetailOrderItems } from '@/utils';
import { Button, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const OrderManage = () => {
  const { orderList = [] } = useOutletContext() || {};

  // 处理传递给表格的数据
  const orders = orderList.map((item) => {
    return {
      ...item,
      key: item.order_id,
    };
  });

  // 订单表格的顶部栏配置
  const tableColumns = [
    {
      title: '订单编号',
      dataIndex: 'order_id',
      key: 'order_id',
      sorter: (a, b) => b.order_id - a.order_id,
      sortDirections: ['descend'],
    },
    {
      title: '客户姓名',
      dataIndex: 'contact_people',
      key: 'contact_people',
      render: (text) => <div className="text-blue-500">{text}</div>,
    },
    { title: '客户电话', dataIndex: 'contact_phone', key: 'contact_phone' },
    {
      title: '非遗项目',
      dataIndex: 'item_name',
      key: 'item_name',
      showSorterTooltip: { target: 'full-header' },
      filters: [...orders]
        .map((item) => ({
          text: item.item_name,
          value: item.item_name,
        }))
        .filter((item, index, self) => {
          return self.findIndex((i) => i.value === item.value) === index;
        }),
      onFilter: (value, record) => record.item_name.indexOf(value) === 0,
    },
    {
      title: '服务时间',
      dataIndex: 'reserve_time',
      key: 'reserve_time',
      sorter: (a, b) => new Date(b.reserve_time) - new Date(a.reserve_time),
      sortDirections: ['descend'],
    },
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
      showSorterTooltip: { target: 'full-header' },
      filters: [...statusStyle].map((item) => ({
        text: item.text,
        value: item.status,
      })),
      onFilter: (value, record) => record.order_status === value,
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

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState({});

  const [inputValue, setInputValue] = useState('');

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

  // 搜索与筛选
  const { currentPage, currentData, total, setCurrentPage, setSearchText } =
    usePageList(orders, 10, ['item_name', 'contact_people']);

  // 下拉菜单 / 搜索框配置
  const OrderConfig = {
    search: {
      placeholder: '搜索项目名称或者客户姓名...',
      width: 360,
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">订单管理</div>
      {/* 搜索框和筛选框 */}
      <div className="mt-6">
        <SearchAndFilter fieldConfig={OrderConfig} />
      </div>

      {/* 订单信息表格 */}
      <div className="my-8">
        <Table
          columns={tableColumns}
          dataSource={currentData}
          showSorterTooltip={{ target: 'sorter-icon' }}
          pagination={{
            pageSize: 10,
            // showSizeChanger: true, // 显示下拉框，允许用户切换每页数量
            // pageSizeOptions: ['10', '20', '30', '50'], // 可选的每页条数
            showTotal: (total) => `共 ${total} 条`,
            current: currentPage,
            total: total,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>

      {/* 弹窗组件 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={() => {
          setIsShowDialog(false);
          setDialogItem({});
        }}
        dialogData={dialogData}
      />
    </div>
  );
};

export default OrderManage;
