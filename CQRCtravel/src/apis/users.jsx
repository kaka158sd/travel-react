// 封装和用户相关的接口函数
import { request } from '@/utils';

// 获取用户列表

export function getUsersAPI() {
  return request({
    url: '/users',
    method: 'GET',
  });
}

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

// 获取游客列表

export function getTouristsAPI() {
  return request({
    url: '/tourists',
    method: 'GET',
  });
}

// 获取文化传承人列表

export function getInheritorsAPI() {
  return request({
    url: '/inheritors',
    method: 'GET',
  });
}

// 获取文旅局管理员列表

export function getAdminsAPI() {
  return request({
    url: '/admins',
    method: 'GET',
  });
}
