// 封装和用户相关的接口函数
import { supabase } from '@/lib/supabase';
import { request } from '@/utils';

// 获取用户列表

export function getUsersAPI() {
  return request({
    url: '/users',
    method: 'GET',
  });
}

// 修改具体用户的信息

export function updateUserAPI(id, data) {
  return request({
    url: '/users',
    method: 'PATCH',
    params: {
      user_id: `eq.${id}`,
    },
    data,
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 新增用户

export async function postUserAPI(data) {
  const { data: insertedData, error } = await supabase
    .from('users')
    .insert([data])
    .select();

  if (error) throw error;
  return insertedData;
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

// 获取游客详情

export function getTouristDetailAPI(id) {
  return request({
    url: '/tourists',
    method: 'GET',
    params: {
      tourist_id: `eq.${id}`,
    },
  });
}

// 更新游客数据

export function updateTouristApi(id, data) {
  return request({
    url: '/tourists',
    method: 'PATCH',
    params: {
      tourist_id: `eq.${id}`,
    },
    data: data,
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 获取文化传承人列表

export function getInheritorsAPI() {
  return request({
    url: '/inheritors',
    method: 'GET',
  });
}

// 更新文化传承人数据

export function updateInheritorAPI(id, data) {
  return request({
    url: '/inheritors',
    method: 'PATCH',
    params: {
      inheritor_id: `eq.${id}`,
    },
    data,
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 获取文旅局管理员列表

export function getAdminsAPI() {
  return request({
    url: '/admins',
    method: 'GET',
  });
}

// 更新文旅局管理员数据

export function updateAdminAPI(id, data) {
  return request({
    url: '/admins',
    method: 'PATCH',
    params: {
      admin_id: `eq.${id}`,
    },
    data,
    headers: {
      Prefer: 'return=representation',
    },
  });
}
