import { Button, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DialogCommon } from '@/components';

const TouristWallet = () => {
  const {
    touristWalletData = [],
    touristUserName = [],
    walletFlow = [],
  } = useOutletContext();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [idx, setIdx] = useState(null);

  // 表单的栏配置
  const columns = [
    {
      title: '游客ID',
      dataIndex: 'tourist_id',
      key: 'tourist_id',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.tourist_id - b.tourist_id,
      sortDirections: ['descend'],
    },
    {
      title: '昵称',
      dataIndex: 'user_name',
      key: 'user_name',
      filters: touristUserName,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.user_name.includes(value),
      width: '20%',
    },
    {
      title: '钱包余额',
      dataIndex: 'wallet',
      key: 'wallet',
    },
    {
      title: '总充值',
      dataIndex: 'charge',
      key: 'charge',
    },
    {
      title: '总消费',
      dataIndex: 'pay',
      key: 'pay',
    },
    {
      title: '总退款',
      dataIndex: 'refund',
      key: 'refund',
    },
    {
      title: '查看流水',
      key: 'action',
      render: (_, record) => (
        <Button
          shape="circle"
          variant="outlined"
          icon={<SearchOutlined />}
          onClick={() => {
            (setIsShowDialog(true), setIdx(record.tourist_id));
          }}
        />
      ),
    },
  ];

  // 获取游客流水
  const getWalletFlow = useMemo(() => {
    if (!idx) return [];
    const data = walletFlow.filter((item) => item.tourist_id === idx);
    if (!data) return [];
    return data;
  }, [walletFlow, idx]);

  return (
    <div className="py-4 pr-8">
      {/* 游客钱包列表 */}
      <Table
        columns={columns}
        loading={touristWalletData.length <= 0 && true}
        dataSource={touristWalletData
          .filter(Boolean)
          .sort((a, b) => a.tourist_id - b.tourist_id)}
        showSorterTooltip={{ target: 'sorter-icon' }}
        locale={{
          filterConfirm: '确定',
          filterReset: '重置',
          selectAll: '全选所有项',
          searchPlaceholder: '在筛选中搜索',
        }}
      />

      {/* 查看流水弹窗 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={() => {
          (setIsShowDialog(false), setIdx(null));
        }}
        closable={1}
        dialogData={{
          type: 3,
          width: 600,
          dataList: getWalletFlow,
        }}
      />
    </div>
  );
};

export default TouristWallet;
