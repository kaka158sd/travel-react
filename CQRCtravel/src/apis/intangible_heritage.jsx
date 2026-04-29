// 封装和非遗相关的接口函数
import { request } from '@/utils';

// 获取非遗列表请求

export function getIntangibleHeritageAPI() {
  return request({
    url: '/intangible_heritage',
    method: 'GET',
  });
}

export function getHeritageTypeAPI() {
  return request({
    url: '/heritage_type',
    method: 'GET',
  });
}
