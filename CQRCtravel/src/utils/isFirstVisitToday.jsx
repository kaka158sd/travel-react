//  获取今天日期（用于判断是否是当天第一次进入）
const getTodayDate = () => new Date().toISOString().split('T')[0];

//  检查是否当天首次进入
export const isFirstVisitToday = () => {
  const lastVisit = localStorage.getItem('last_visit_date');
  const today = getTodayDate();

  if (lastVisit !== today) {
    // 记录今天日期
    localStorage.setItem('last_visit_date', today);
    return true;
  }
  return false;
};
