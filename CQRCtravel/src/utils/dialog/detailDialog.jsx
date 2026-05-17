// 存放详情弹窗相关的描述列表的items配置

import { statusStyle, orderLabel, newLabel } from '@/store';
import dayjs from 'dayjs';
import { Badge } from 'antd';
import { DataField } from '@/components';
import { identity } from '@/store';

// 订单详情弹窗
export const getDetailOrderItems = (dialogItem) => {
  // 订单状态的徽标样式，找不到时返回默认样式
  const statusBadge = statusStyle.find(
    (item) => item.status === dialogItem.order_status,
  ) || { color: 'cyan', text: '未知状态' };

  return [
    { key: '1', label: orderLabel[0], children: dialogItem.business_id },
    { key: '2', label: orderLabel[1], children: dialogItem.item_name },
    {
      key: '3',
      label: orderLabel[2],
      children: `￥${dialogItem.single_price}元`,
    },
    {
      key: '4',
      label: orderLabel[3],
      children: dialogItem.contact_people,
    },
    {
      key: '5',
      label: orderLabel[4],
      children: dialogItem.contact_phone,
    },
    { key: '6', label: orderLabel[5], children: dialogItem.people_num },
    {
      key: '7',
      label: orderLabel[6],
      children: dialogItem.reserve_time,
    },
    {
      key: '8',
      label: orderLabel[7],
      children: dialogItem.reserve_period,
    },
    {
      key: '9',
      label: orderLabel[8],
      children: (
        <div>
          <Badge color={statusBadge.color} text={statusBadge.text} />
        </div>
      ),
    },
    {
      key: '10',
      label: orderLabel[9],
      children: dialogItem.remark || '无',
      span: 3,
    },
    {
      key: '11',
      label: orderLabel[10],
      children: `￥${dialogItem.total_price}元`,
    },
    {
      key: '12',
      label: orderLabel[11],
      children: dayjs(dialogItem.order_time).format('YYYY-MM-DD HH:mm'),
    },
  ];
};

// 活动详情弹窗
export const getDetailActivityItems = (dialogItem) => {
  // 关联类型
  const type = dialogItem.relate_type;

  // 活动的label列表
  const activityLabel = [
    '活动ID',
    '活动名称',
    '关联类型',
    type === 1 ? '景点ID' : '非遗ID',
    type === 1 ? '景点名称' : '非遗名称',
    '活动时间',
    '活动地址',
    '主办方',
    '活动描述',
    '注意事项',
    '创建时间',
  ];

  return [
    { key: '1', label: activityLabel[0], children: dialogItem.activity_id },
    {
      key: '2',
      label: activityLabel[1],
      children: dialogItem.activity_name,
      span: 'filled',
    },
    {
      key: '3',
      label: activityLabel[2],
      children: dialogItem.relate_type === 1 ? '景点' : '非遗',
    },
    { key: '4', label: activityLabel[3], children: dialogItem.relate_id },
    { key: '5', label: activityLabel[4], children: dialogItem.relate_name },
    {
      key: '6',
      label: activityLabel[5],
      children: `${dayjs(dialogItem.start_time).format('YYYY-MM-DD')} - ${dayjs(dialogItem.end_time).format('YYYY-MM-DD')}`,
    },
    { key: '7', label: activityLabel[6], children: dialogItem.address },
    { key: '8', label: activityLabel[7], children: dialogItem.sponsor },
    {
      key: '9',
      label: activityLabel[8],
      children: dialogItem.activity_desc,
      span: 3,
    },
    {
      key: '10',
      label: activityLabel[9],
      children: dialogItem.notice || '无',
      span: 3,
    },
    {
      key: '11',
      label: activityLabel[10],
      children: dayjs(dialogItem.created_time).format('YYYY-MM-DD HH:mm'),
    },
  ];
};

// 新闻详情弹窗
export const getDetailNewItems = (dialogItem) => {
  return [
    {
      key: '1',
      label: newLabel[0],
      children: <img src={dialogItem.news_image} />,
      span: 3,
    },
    {
      key: '2',
      label: newLabel[1],
      children: dialogItem.publisher,
    },
    {
      key: '3',
      label: newLabel[2],
      children: dialogItem.publish_unit,
      span: 'filled',
    },
    {
      key: '4',
      label: newLabel[3],
      children: dialogItem.news_content,
      span: 3,
    },
    {
      key: '5',
      label: newLabel[4],
      children: dayjs(dialogItem.publish_time).format('YYYY-MM-DD HH:mm'),
    },
  ];
};

// 人员详情弹窗
export const getDetailPeopleItems = (dialogItem) => {
  // 增加默认值以避免被判成understand
  const item = dialogItem || {};

  // 当前用户的身份对应的 identity 中的数据
  const currentIdentity = identity[item.identity_type] || identity[1];

  const peopleLabel = [
    '用户ID',
    '用户名称',
    '用户头像',
    '手机号',
    currentIdentity.label[0],
    currentIdentity.label[1],
    '创建时间',
  ];

  return [
    {
      key: '1',
      label: peopleLabel[0],
      children: item.user_id,
      span: 3,
    },
    {
      key: '2',
      label: peopleLabel[1],
      children: item.user_name,
    },
    {
      key: '3',
      label: peopleLabel[2],
      children: (
        <DataField type="avatar" formConfig={{ size: 60, src: item.avatar }} />
      ),
    },
    { key: '4', label: peopleLabel[3], children: item.phone },
    {
      key: '5',
      label: peopleLabel[4],
      children: (
        <div className="w-134 line-clamp-1">{item?.privacyData[0] || '-'}</div>
      ),
      span: 2,
    },
    {
      key: '6',
      label: peopleLabel[5],
      children: item?.privacyData[1] || '-',
    },
    {
      key: '7',
      label: peopleLabel[6],
      children: dayjs(item.created_time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
};
