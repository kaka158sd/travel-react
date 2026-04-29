// 封装和人文故事集相关的接口函数
import { request } from '@/utils';

// 获取人文故事集列表请求

export function getHumanStoriesAPI() {
  return request({
    url: '/human_stories',
    method: 'GET',
  });
}
