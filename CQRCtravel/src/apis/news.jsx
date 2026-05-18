// 封装和新闻相关的接口函数
import { request } from '@/utils';

// 获取新闻列表请求

export function getNewsAPI() {
  return request({
    url: '/news',
    method: 'GET',
  });
}

// 获取新闻详情

export function getNewsDetailAPI(id) {
  return request({
    url: '/news',
    method: 'GET',
    params: {
      news_id: `eq.${id}`,
    },
  });
}

// 新增新闻

export function postNewsAPI(data) {
  return request({
    url: '/news',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 删除新闻

export function deleteNewsAPI(id) {
  return request({
    url: '/news',
    method: 'DELETE',
    params: {
      news_id: `eq.${id}`,
    },
  });
}
