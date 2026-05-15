// 封装和订单相关的接口函数
import { request } from '@/utils';

// 获取订单列表请求

export function getOrdersAPI() {
  return request({
    url: '/orders',
    method: 'GET',
  });
}

// 获取订单详情

export function getOrderDetailAPI(id) {
  return request({
    url: '/orders',
    method: 'GET',
    params: {
      order_id: `eq.${id}`,
    },
  });
}

// 编辑订单数据

export function updateOrderstAPI(id, data) {
  return request({
    url: '/orders',
    method: 'PATCH',
    params: {
      order_id: `eq.${id}`,
    },
    data: data,
  });
}

// 新增订单数据

export function postOrderAPI(data) {
  return request({
    url: '/orders',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
