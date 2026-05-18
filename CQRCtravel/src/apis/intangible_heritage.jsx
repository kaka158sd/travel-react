// 封装和非遗相关的接口函数
import { request } from '@/utils';

// 获取非遗列表请求

export function getIntangibleHeritageAPI() {
  return request({
    url: '/intangible_heritage',
    method: 'GET',
  });
}

// 获取非遗类型列表请求

export function getHeritageTypeAPI() {
  return request({
    url: '/heritage_type',
    method: 'GET',
  });
}

// 获取非遗标签列表请求

export function getHeritageTagsAPI() {
  return request({
    url: '/heritage_tags',
    method: 'GET',
  });
}

// 获取非遗详情请求

export function getIntangibleHeritageDetailAPI(id) {
  return request({
    url: '/intangible_heritage',
    method: 'GET',
    params: {
      heritage_id: `eq.${id}`,
    },
  });
}

// 新增非遗数据

export function postIntangibleHeritageAPI(data) {
  return request({
    url: '/intangible_heritage',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 编辑非遗数据

export function updateIntangibleHeritageAPI(id, data) {
  return request({
    url: '/intangible_heritage',
    method: 'PATCH',
    params: {
      heritage_id: `eq.${id}`,
    },
    data: {
      ...data,
      updated_time: new Date(),
    },
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 删除非遗数据

export function deleteIntangibleHeritageAPI(id) {
  return request({
    url: '/intangible_heritage',
    method: 'DELETE',
    params: {
      heritage_id: `eq.${id}`,
    },
  });
}
