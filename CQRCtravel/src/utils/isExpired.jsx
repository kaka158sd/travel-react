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
