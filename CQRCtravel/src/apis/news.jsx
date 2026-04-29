// 封装和新闻相关的接口函数
import { request } from '@/utils';

// 获取新闻列表请求

export function getNewsAPI() {
  return request({
    url: '/news',
    method: 'GET',
  });
}
