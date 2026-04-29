// 封装和景点相关的接口函数
import { request } from '@/utils';

// 获取景点列表请求
export function getScenicSpotsAPI() {
  return request({
    url: '/scenic_spots',
    method: 'GET',
  });
}

export function getSpotTypeAPI() {
  return request({
    url: '/spot_type',
    method: 'GET',
  });
}
