// 封装和收藏相关的接口函数
import { request } from '@/utils';

// 获取收藏列表请求

export function getFavoritesAPI() {
  return request({
    url: '/favorites',
    method: 'GET',
  });
}

// 获取收藏详情

export function getFavoriteDetailAPI(id) {
  return request({
    url: '/favorites',
    method: 'GET',
    params: {
      favorite_id: `eq.${id}`,
    },
  });
}

// 编辑收藏数据

export function updateFavoriteAPI(id, data) {
  return request({
    url: '/favorites',
    method: 'PATCH',
    params: {
      favorite_id: `eq.${id}`,
    },
    data: data,
  });
}

// 新增收藏数据

export function postFavoriteAPI(data) {
  return request({
    url: '/favorites',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
