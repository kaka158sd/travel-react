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
