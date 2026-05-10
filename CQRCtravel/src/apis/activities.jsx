// 与活动相关的接口
import { request } from '@/utils';

// 获取活动列表

export function getActivitiesAPI() {
  return request({
    url: '/activities',
    method: 'GET',
  });
}
