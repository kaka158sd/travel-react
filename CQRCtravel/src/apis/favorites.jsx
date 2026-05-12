// 封装和收藏相关的接口函数
import { request } from '@/utils';

// 获取收藏列表请求

export function getFavoritesAPI() {
  return request({
    url: '/favorites',
    method: 'GET',
  });
}
