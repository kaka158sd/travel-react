// 匹配活动:景点详情和非遗详情页面需要活动列表来匹配该业务的id

export function matchRelateActivities(activity, type, id) {
  const spotRelate = activity.filter((item) => item.relate_type === type) || [];

  const currentList = spotRelate.filter((item) => item.relate_id === id) || [];

  return currentList;
}
