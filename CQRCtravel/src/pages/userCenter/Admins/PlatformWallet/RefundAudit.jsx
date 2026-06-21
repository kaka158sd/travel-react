import { updateOrderstAPI } from '@/apis/orders';
import {
  postPlatformWalletFlowAPI,
  updatePlatformWalletAPI,
  updateWalletFlowAPI,
  updateWalletRefundAuditAPI,
} from '@/apis/wallet';
import { DialogCommon } from '@/components';
import { Flex, Table, Button, Alert, message, Tooltip } from 'antd';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const RefundAudit = () => {
  const {
    refundList = [],
    auditIds = [],
    adminId,
    walletFlow = [],
    refreshRefund,
  } = useOutletContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    content: '',
    onOk: () => {},
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  // 获取审核驳回的理由
  const [dialogType, setDialogType] = useState(0);
  const [inputValue, setInputValue] = useState('');

  // 操作按钮配置
  const btnConfig = [
    { text: '通过', color: 'primary', onClick: () => handleConfirm() },
    { text: '驳回', color: 'red', onClick: () => handleCancel() },
  ];

  // 审核通过点击事件
  const handleConfirm = () => {
    setConfirmLoading(false);
    const newModalConfig = {
      title: '审核通过',
      content: '是否要通过申请的退款请求？',
      onOk: async () => {
        try {
          // 更新游客钱包流水的状态，更新退款审核状态，更新平台总资金的freeze_fund，新增平台流水数据，订单状态修改为5
          setConfirmLoading(true);
          for (const id of selectedRowKeys) {
            await updateWalletRefundAuditAPI(id, {
              status: 1,
              admin_id: adminId,
            });
            const item = refundList.find((item) => item.audit_id === id);
            if (item) {
              await updateOrderstAPI(item.order_id, { order_status: 5 });
              const flow = walletFlow.find(
                (i) =>
                  i.tourist_id === item.tourist_id &&
                  i.order_id === item.order_id &&
                  i.flow_type === 2,
              );
              if (flow) await updateWalletFlowAPI(flow.flow_id, { status: 0 });
            }
            await updatePlatformWalletAPI({
              freeze_fund: -item.refund_amount,
              available_fund: +0,
            });
            await postPlatformWalletFlowAPI({
              fund_type: 1,
              relation_id: item.order_id,
              flow_desc: '退款支出',
              change_amount: -item.refund_amount,
            });
          }
          messageApi.success(`审核通过 ${selectedRowKeys.length}个 申请！`);
          refreshRefund();
        } catch (error) {
          console.error('审核通过失败！', error);
          messageApi.error('审核失败！');
        } finally {
          setConfirmLoading(false);
          setIsOpenModal(false);
        }
      },
    };
    setModalConfig(newModalConfig);
    setIsOpenModal(true);
  };

  // 审核驳回输入框配置
  const inputConfig = {
    placeholder: '请输入驳回理由...',
    value: inputValue,
    onChange: (value) => {
      setInputValue(value);
    },
  };

  // 审核驳回点击事件
  const handleCancel = () => {
    setDialogType(1);
    setInputValue('');
    setConfirmLoading(false);
    const newModalConfig = {
      title: '审核驳回',
      content: '是否要驳回申请的退款请求？',
      onOk: async () => {
        try {
          setConfirmLoading(true);
          // 更新退款审核,更新订单状态退款失败7，更新平台总资金，新增平台流水，更新订单状态
          for (const id of selectedRowKeys) {
            if (!inputValue) {
              messageApi.error('获取输入失败！');
              return;
            }
            await updateWalletRefundAuditAPI(id, {
              status: 2,
              admin_id: adminId,
              audit_remark: inputValue,
            });
            const item = refundList.find((item) => item.audit_id === id);
            if (item) {
              await updateOrderstAPI(item.order_id, { order_status: 7 });
              const flow = walletFlow.find(
                (i) =>
                  i.tourist_id === item.tourist_id &&
                  i.order_id === item.order_id &&
                  i.flow_type === 2,
              );
              if (flow) await updateWalletFlowAPI(flow.flow_id, { status: 0 });
            }
            await updatePlatformWalletAPI({
              freeze_fund: -item.refund_amount,
              available_fund: +item.refund_amount,
            });
            await postPlatformWalletFlowAPI({
              fund_type: 2,
              relation_id: item.order_id,
              flow_desc: '订单支付',
              change_amount: +item.refund_amount,
            });
          }
          messageApi.info(`已驳回 ${selectedRowKeys.length}个 申请！`);
          refreshRefund();
        } catch (error) {
          console.error('驳回审核失败！', error);
          messageApi.error('驳回审核失败！');
        } finally {
          setConfirmLoading(false);
          setIsOpenModal(false);
          setDialogType(0);
        }
      },
    };
    setModalConfig(newModalConfig);
    setIsOpenModal(true);
  };

  // 表格的栏配置
  const columns = [
    {
      title: '审核编号',
      dataIndex: 'audit_id',
      key: 'audit_id',
      filterMode: 'tree',
      filterSearch: true,
      filters: auditIds,
      onFilter: (value, record) => String(record.audit_id).includes(value),
    },
    {
      title: '游客ID',
      dataIndex: 'tourist_id',
      key: 'tourist_id',
    },
    {
      title: '订单ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '退款金额/元',
      dataIndex: 'refund_amount',
      key: 'refund_amount',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Tooltip
          title={record?.audit_remark?.length > 0 && record.audit_remark}
        >
          <div
            className={`text-sm ${record.status === 0 && 'text-amber-400'} ${record.status === 2 && 'text-red-400'}`}
          >
            {record.status === 0
              ? '待审核'
              : record.status === 1
                ? '审核通过'
                : '审核驳回'}
          </div>
        </Tooltip>
      ),
      filters: [
        { text: '待审核', value: 0 },
        { text: '审核通过', value: 1 },
        { text: '审核驳回', value: 2 },
      ],
      onFilter: (value, record) => String(record.status).includes(value),
    },
    {
      title: '审核提交时间',
      dataIndex: 'audit_time',
      key: 'audit_time',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status !== 0,
      audit_id: record.audit_id,
    }),
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="py-4 pr-8 relative">
      {contextHolder}
      {/* 警告框：提示3天内完成审核，否则将自动退款 */}
      <div className="w-fit absolute -top-13 left-34">
        <Alert
          title="请在3天内完成退款审核，3天后退款申请将自动通过！"
          type="warning"
          closable={{ closeIcon: true, 'aria-label': 'close' }}
        />
      </div>

      {/* 操作按钮 */}
      <div className="absolute -top-8 right-8">
        <Flex gap="large" justify="flex-end">
          {btnConfig.map((item) => (
            <Button
              key={item.text}
              type="text"
              color={item.color}
              variant="filled"
              className="text-sm"
              onClick={item.onClick}
              disabled={!hasSelected}
            >
              {item.text}
            </Button>
          ))}
        </Flex>
      </div>

      <Table
        columns={columns}
        dataSource={refundList}
        locale={{
          filterConfirm: '确定',
          filterReset: '重置',
          selectAll: '全选所有项',
          searchPlaceholder: '在筛选中搜索',
        }}
        rowSelection={rowSelection}
      />

      {/* 弹窗 */}
      <DialogCommon
        isShowDialog={isOpenModal}
        onOk={modalConfig.onOk}
        dialogData={{
          type: 4,
          title: modalConfig.title,
          content: modalConfig.content,
          inputConfig: dialogType ? inputConfig : null,
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          (setIsOpenModal(false), setDialogType(0));
        }}
      />
    </div>
  );
};

export default RefundAudit;
