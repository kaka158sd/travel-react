// 封装和美食相关的接口函数
import { request } from '@/utils';

// 获取美食列表请求

export function getFoodsAPI() {
  return request({
    url: '/foods',
    method: 'GET',
  });
}
