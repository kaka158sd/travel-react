import { Tag, Badge, Collapse, Steps, Button, message, Pagination } from 'antd';
import dayjs from 'dayjs';
import './index.less';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { statusStyle } from '@/store';
import { DialogCommon, NoData, SearchAndFilter } from '@/components';
import { useState } from 'react';
import { isOrderExpired } from '@/utils';
import { useSelector } from 'react-redux';
import { usePageList } from '@/hook';
import {
  postPlatformWalletFlowAPI,
  postWalletFlowAPI,
  postWalletRefundAuditAPI,
  updatePlatformWalletAPI,
} from '@/apis/wallet';

// 订单操作按钮样式
const actionsStyle = [
  { key: 1, text: '支付', status: 0, color: 'danger' },
  { key: 2, text: '取消', status: 0, color: '' },
  { key: 3, text: '完成', status: 1, color: 'blue' },
  { key: 4, text: '退款', status: 1, color: 'orange' },
  { key: 5, text: '评论', status: 2, color: '' },
];

// 根据订单状态生成 Steps 步骤条 items
const getOrderStepItems = (orderStatus, isFree) => {
  // 基础正常流程步骤
  let baseSteps;
  if (isFree) {
    baseSteps = [
      {
        title: '提交预约',
        content: '已成功提交项目预约信息，订单已创建',
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
  } else {
    baseSteps = [
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
  }

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
        title: '退款审核中',
        status: 'finish',
        content: '退款申请已提交，等待后台审核处理',
      },
      {
        title: '已退款',
        status: 'error',
        content: '订单已申请退款，退款金额将原路退回',
      },
    ];
  }

  if (orderStatus === 6) {
    // 申请退款
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
        title: '退款审核中',
        status: 'process',
        content: '退款申请已提交，等待后台审核处理',
      },
    ];
  }

  // 正常流程状态
  let currentStepIndex;
  if (isFree) {
    switch (orderStatus) {
      case 0:
        currentStepIndex = 0;
        break;
      case 1:
        currentStepIndex = 1;
        break;
      case 2:
        currentStepIndex = 2;
        break;
      default:
        currentStepIndex = 0;
    }
  } else {
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
  const {
    myOrderData = [],
    touristId = 1,
    updateWalletData,
    updateOrderData,
  } = useOutletContext() || {};

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  // 控制弹窗开关
  const [isOpenModal, setIsOpenModal] = useState(false);
  // 弹窗动态配置
  const [modalConfig, setModalConfig] = useState({
    title: '',
    content: '',
    onOk: () => {},
  });
  // 异步关闭的加载控制
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { wallet = 0 } = useSelector((state) => state.wallet);

  const [inputValue, setInputValue] = useState('');
  // 多选值状态
  const [selectedValues, setSelectedValues] = useState([]);

  // 订单表格的操作
  const handleOrderActions = (key, id, price, type, businessId) => {
    setConfirmLoading(false);
    // 先构建好完整的 config
    let newModalConfig = {};

    switch (key) {
      case 1:
        newModalConfig = {
          title: '支付订单',
          content: '是否确认要支付这笔订单？',
          onOk: () => {
            setConfirmLoading(true);
            handlePay(id, price);
          },
        };
        break;
      case 2:
        newModalConfig = {
          title: '取消订单',
          content: '是否确认取消该笔订单？',
          onOk: () => {
            setConfirmLoading(true);
            handleDelete(id);
          },
        };
        break;
      case 3:
        newModalConfig = {
          title: '完成订单',
          content: '是否确认已经完成了该笔订单？',
          onOk: () => {
            setConfirmLoading(true);
            handleFinish(id, price);
          },
        };
        break;
      case 4:
        newModalConfig = {
          title: '退款',
          content: '请确认是否需要申请退款！',
          onOk: () => {
            setConfirmLoading(true);
            handleRefund(id, price);
          },
        };
        break;
      case 5:
        newModalConfig = {
          title: '评论订单',
          content: '是否需要前往评论该订单?',
          onOk: () => {
            setConfirmLoading(true);
            handleComment(businessId, type);
          },
        };
        break;
      default:
        // 处理未知key的情况，避免newModalConfig为空
        newModalConfig = {
          title: '提示',
          content: '未知操作',
          onOk: () => {},
        };
    }

    setModalConfig(newModalConfig);
    setIsOpenModal(true);
  };

  // 支付操作
  const handlePay = async (id, price) => {
    if (!touristId) {
      messageApi.error('未找到游客信息');
      setIsOpenModal(false);
      return;
    }

    const newMoney = wallet - price;
    if (newMoney < 0) {
      messageApi.error('余额不足');
      setIsOpenModal(false);
      return;
    }

    // 新增游客钱包流水数据，新增平台流水数据，更新更新平台总资金的总资金和冻结资金
    const walletFlowData = {
      tourist_id: touristId,
      order_id: id,
      flow_type: 1,
      amount: -price,
      balance_after: newMoney,
    };
    const platformWalletFlowData = {
      fund_type: 1,
      relation_id: id,
      flow_desc: '订单支付',
      change_amount: +price,
    };

    try {
      await postWalletFlowAPI(walletFlowData);
      await updatePlatformWalletAPI({
        freeze_fund: +price,
        available_fund: +0,
      });
      await postPlatformWalletFlowAPI(platformWalletFlowData);
      await updateWalletData(newMoney);
      messageApi.success('支付成功！');
      await updateOrderData(id, 1);
    } catch (error) {
      console.error('支付失败', error);
    } finally {
      setConfirmLoading(false);
      setIsOpenModal(false);
    }
  };
  // 取消操作
  const handleDelete = async (id) => {
    if (!touristId) {
      messageApi.error('未找到游客信息');
      setIsOpenModal(false);
      return;
    }

    try {
      messageApi.success('已取消订单！');
      await updateOrderData(id, 3);
    } catch (error) {
      console.error('取消失败', error);
    } finally {
      setConfirmLoading(false);
      setIsOpenModal(false);
    }
  };
  // 完成操作
  const handleFinish = async (id, price) => {
    if (!touristId) {
      messageApi.error('未找到游客信息');
      setIsOpenModal(false);
      return;
    }

    try {
      // 更新平台总资金，新增平台流水数据
      if (price > 0) {
        const flatformData = {
          fund_type: 2,
          relation_id: id,
          flow_desc: '订单完成',
          change_amount: +price,
        };

        await updatePlatformWalletAPI({
          freeze_fund: -price,
          available_fund: +price,
        });
        await postPlatformWalletFlowAPI(flatformData);
      }
      messageApi.success('订单已完成！');
      await updateOrderData(id, 2);
    } catch (error) {
      console.error('操作失败', error);
    } finally {
      setConfirmLoading(false);
      setIsOpenModal(false);
    }
  };
  // 退款操作
  const handleRefund = async (id, price) => {
    if (!touristId) {
      messageApi.error('未找到游客信息');
      setIsOpenModal(false);
      return;
    }

    const newMoney = wallet + price;

    // 新增游客钱包流水数据，新增平台流水数据，更新平台总资金数据，新增退款审核数据
    const walletFlowData = {
      tourist_id: touristId,
      order_id: id,
      flow_type: 2,
      amount: +price,
      balance_after: newMoney,
      status: 1,
    };
    const refundAuditData = {
      order_id: id,
      tourist_id: touristId,
      refund_amount: price,
    };

    try {
      await postWalletFlowAPI(walletFlowData);
      await postWalletRefundAuditAPI(refundAuditData);
      await updateOrderData(id, 6);
      messageApi.info('已申请退款，请等待管理员审核！');
    } catch (error) {
      console.error('退款失败', error);
    } finally {
      setConfirmLoading(false);
      setIsOpenModal(false);
    }
  };
  // 评论操作
  const handleComment = (businessId, type) => {
    if (!touristId) {
      messageApi.error('未找到游客信息');
      setIsOpenModal(false);
      return;
    }

    try {
      if (type === 1) {
        navigate(`/scenicSpotsDetail/${businessId}`);
      } else {
        navigate(`/intangibleHeritageDetail/${businessId}`);
      }
    } catch (error) {
      console.error('操作失败', error);
    } finally {
      setConfirmLoading(false);
      setIsOpenModal(false);
    }
  };

  // 搜索和筛选
  const {
    currentPage,
    currentData,
    total,
    setCurrentPage,
    changeFilter,
    setSearchText,
  } = usePageList(myOrderData, 5, ['item_name']);

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    // console.log('当前选中的值：', value);
    setSelectedValues(value);
    changeFilter('business_type', value); // 筛选 type 字段
  };

  // 下拉菜单 / 搜索框配置
  const orderConfig = {
    select: {
      width: 360,
      optionsItem: [
        { value: 1, label: '景点' },
        { value: 2, label: '非遗' },
      ],
      placeholder: '选择订单类型',
      showSearch: true,
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
    search: {
      placeholder: '搜索订单的业务名称...',
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
    <div>
      <div className="max-w-280 min-h-200 mx-auto border-x-2 border-x-amber-400 py-1 px-6">
        {contextHolder}

        <div className="w-full text-xl text-center font-semibold tracking-widest py-4 border my-0 rounded-lg border-amber-500 bg-[#fff7eb]">
          我的订单
        </div>
        {/* 筛选框和搜索框 */}
        <div className="mt-6 px-8">
          <SearchAndFilter fieldConfig={orderConfig} />
        </div>

        {/* 订单列表 */}
        {currentData.length > 0 ? (
          <div className="my-8 px-3 flex flex-col gap-y-4">
            {currentData
              .sort((a, b) => b.order_id - a.order_id)
              .map((item) => {
                const currentStatus = item.order_status;
                const currentType = item.business_type;
                const isFree = item.single_price === 0;
                const stepsItems = getOrderStepItems(currentStatus, isFree);
                const totalPrice = item.total_price;
                const orderId = item.order_id;
                const businessId = item.business_id;

                // 判断是否过期
                const isExpired = isOrderExpired(
                  item.reserve_time,
                  item.reserve_period,
                );
                if (isExpired) updateOrderData(orderId, 4);

                return (
                  <div className="flex justify-between gap-4" key={orderId}>
                    {/* 订单展示部分 */}
                    <div className="w-full">
                      <Badge.Ribbon
                        text={
                          statusStyle.find(
                            (item) => item.status === currentStatus,
                          )?.text || '待支付'
                        }
                        color={
                          statusStyle.find(
                            (item) => item.status === currentStatus,
                          )?.color || 'cyan'
                        }
                      >
                        <div
                          className={`w-full border border-olive-300 rounded-lg px-4 py-2 ${currentType === 1 ? 'order-bgimage1' : 'order-bgimage2'}`}
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
                              价格：
                              {item.single_price > 0
                                ? `￥${item.single_price}元/人`
                                : '免费'}
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
                              <span className="mr-2">
                                {item.contact_people}
                              </span>
                              <span>{item.contact_phone}</span>
                            </span>
                            {item.business_type === 2 && (
                              <span>预约人数：{item.people_num}</span>
                            )}
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              {/* 订单第四行：订单编号 */}
                              <div>订单编号:{orderId}</div>

                              {/* 订单第五行：下单时间 订单总价 */}
                              <span>
                                下单时间：
                                {dayjs(item.order_time).format('YYYY-MM-DD')}
                              </span>
                            </div>
                            <span className="text-right">
                              支付金额：￥
                              <span className="text-2xl mr-1">
                                {totalPrice}
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
                    <div className="flex flex-col gap-4 h-40 justify-center">
                      {actionsStyle.map((item) => {
                        if (item.status !== currentStatus) return;
                        if (isFree && item.key === 4) return;

                        return (
                          <Button
                            key={item.key}
                            color={item.color}
                            variant="solid"
                            onClick={() =>
                              handleOrderActions(
                                item.key,
                                orderId,
                                totalPrice,
                                currentType,
                                businessId,
                              )
                            }
                          >
                            {item.text}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <NoData />
        )}

        {/* 分页组件 */}
        <div>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={5}
            total={total}
            align="end"
            onChange={(page) => setCurrentPage(page)}
            size="large"
          />
        </div>
      </div>

      {/* 弹窗 */}
      <DialogCommon
        isShowDialog={isOpenModal}
        onOk={modalConfig.onOk}
        dialogData={{
          type: 4,
          title: modalConfig.title,
          content: modalConfig.content,
        }}
        confirmLoading={confirmLoading}
        onCancel={() => setIsOpenModal(false)}
      />
    </div>
  );
};

export default MyOrders;
