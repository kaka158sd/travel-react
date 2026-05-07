// 封装和评论相关的接口函数
import { request } from '@/utils';

// 获取评论列表请求

export function getCommentsAPI() {
  return request({
    url: '/comments',
    method: 'GET',
  });
}
