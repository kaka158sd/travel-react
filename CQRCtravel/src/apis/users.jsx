// 封装和用户相关的接口函数
import { request } from '@/utils';

// 获取单位列表请求

export function getAdminsDepartmentAPI() {
  return request({
    url: '/admins_department',
    method: 'GET',
  });
}

// 获取部门列表请求

export function getAdminsPositionAPI() {
  return request({
    url: '/admins_position',
    method: 'GET',
  });
}
