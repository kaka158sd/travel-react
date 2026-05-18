// 与活动相关的接口
import { request } from '@/utils';

// 获取活动列表

export function getActivitiesAPI() {
  return request({
    url: '/activities',
    method: 'GET',
  });
}

// 获取活动详情数据

export function getActivitieDetailAPI(id) {
  return request({
    url: '/activities',
    method: 'GET',
    params: {
      activity_id: `eq.${id}`,
    },
  });
}

// 新增活动数据

export function postActivityAPI(data) {
  return request({
    url: '/activities',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 编辑活动数据

export function updateActivityAPI(id, data) {
  return request({
    url: '/activities',
    method: 'PATCH',
    params: {
      activity_id: `eq.${id}`,
    },
    data,
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 删除活动数据

export function deleteActivityAPI(id) {
  return request({
    url: '/activities',
    method: 'DELETE',
    params: {
      activity_id: `eq.${id}`,
    },
  });
}
