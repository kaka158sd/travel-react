// 存放与游客的规划行程有关的接口请求

import { request } from '@/utils';

// 获取自定义项目列表

export function getCustomItemsAPI() {
  return request({
    url: '/custom_items',
    method: 'GET',
  });
}

// 修改自定义项目数据

export function updateCustomItemAPI(id, data) {
  return request({
    url: '/custom_items',
    method: 'PATCH',
    params: {
      custom_item_id: `eq.${id}`,
    },
    data,
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 新增自定义项目

export function postCustomItemAPI(data) {
  return request({
    url: '/custom_items',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 获取行程方案的列表

export function getTripPlansAPI() {
  return request({
    url: '/trip_plans',
    method: 'GET',
  });
}

// 获取某个行程方案详情

export function getTripPlanDetailAPI(id) {
  return request({
    url: '/trip_plans',
    method: 'GET',
    params: {
      plan_id: `eq.${id}`,
    },
  });
}

// 新增行程方案

export function postTripPlanAPI(data) {
  return request({
    url: '/trip_plans',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
