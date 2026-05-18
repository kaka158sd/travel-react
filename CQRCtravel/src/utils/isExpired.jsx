// 日期相关的如过期之类的方法

// 判断订单是否过期
export function isOrderExpired(reserve_time, reserve_period) {
  const now = new Date();
  // 拼接截止日期
  const end = new Date(`${reserve_time} ${reserve_period.slice(-5)}`);

  // 结束时间<当前时间，则已过期
  return end < now;
}

// 判断预约表单中的预约日期是否可行
export function isReserveFeasible(reserve_time, reserve_period) {
  // 解析时间段
  const startTimeStr = reserve_period.slice(0, 5);
  const [hour, minute] = startTimeStr.split(':').map(Number);
  // 拼接开始时间
  const start = reserve_time.clone().hour(hour).minute(minute);
  const now = new Date();

  // 预约订单开始时间>当前时间，则预约订单可行
  if (reserve_time.isSame(now, 'day')) {
    // 今天的预约判断
    return start > now;
  } else {
    // 未来日期的预约：直接通过
    return true;
  }
}

// 在管理员的控制台的table表格上，判断最近活动的开始时间是否晚于今天
// 判断结束时间是否早于今天

export function isTimeBeforeToday(time) {
  if (!time) return false;
  // 今天
  const now = new Date();
  const timeDate = new Date(time);

  // 处理无效日期（比如格式错误的字符串）
  if (isNaN(timeDate.getTime())) return false;

  // 清空时分秒
  now.setHours(0, 0, 0, 0);
  timeDate.setHours(0, 0, 0, 0);

  return timeDate <= now;
}
