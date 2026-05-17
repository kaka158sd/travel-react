// 将游客的规划行程生成的方案存如本地以便渲染页面

export function setItineraryStorage(value) {
  try {
    localStorage.setItem('itineraryPlan', JSON.stringify(value));
  } catch (error) {
    console.error('存入规划行程计划失败！', error);
  }
}

export function getItineraryStorage() {
  try {
    const item = localStorage.getItem('itineraryPlan');
    return JSON.parse(item);
  } catch (error) {
    console.error('取本地存储的规划行程方案失败！', error);
  }
}

export function removeItineraryStorage() {
  try {
    localStorage.removeItem('itineraryPlan');
  } catch (error) {
    console.error('移除本地存储中的规划行程方案失败！', error);
  }
}
