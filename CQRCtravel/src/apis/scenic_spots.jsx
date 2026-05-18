// 封装和景点相关的接口函数
import { request } from '@/utils';

// 获取景点列表请求

export function getScenicSpotsAPI() {
  return request({
    url: '/scenic_spots',
    method: 'GET',
  });
}

// 获取景点类型列表请求

export function getSpotTypeAPI() {
  return request({
    url: '/spot_type',
    method: 'GET',
  });
}

// 获取景点标签列表请求

export function getSpotTagsAPI() {
  return request({
    url: '/spot_tags',
    method: 'GET',
  });
}

// 获取景点详情请求
export function getScenicSpotDetailAPI(spotId) {
  return request({
    url: '/scenic_spots',
    method: 'GET',
    params: {
      spot_id: `eq.${spotId}`,
    },
  });
}

// 新增景点请求

export function postScenicSpotAPI(data) {
  return request({
    url: '/scenic_spots',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 更新景点数据

export function updateScenicSpotAPI(id, data) {
  return request({
    url: '/scenic_spots',
    method: 'PATCH',
    data: {
      ...data,
      updated_time: new Date(),
    },
    params: {
      spot_id: `eq.${id}`,
    },
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 删除景点

export function deleteScenicSpotAPI(id) {
  return request({
    url: '/scenic_spots',
    method: 'DELETE',
    params: {
      spot_id: `eq.${id}`,
    },
  });
}
