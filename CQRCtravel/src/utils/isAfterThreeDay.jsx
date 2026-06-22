// 判断当前时间是否是目标时间戳的三天后（仅精确到小时，忽略分秒）
export function isAfterThreeDays(targetTimestamp) {
  if (!targetTimestamp || typeof targetTimestamp !== 'number') {
    console.warn('参数必须为有效数字时间戳');
    return false;
  }

  // 1. 处理目标时间：清零分秒，只保留 年-月-日 时
  const targetDate = new Date(targetTimestamp);
  const targetClean = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    targetDate.getHours(),
    0,
    0,
    0,
  );

  // 2. 目标时间 + 3天（同小时）
  const threeDaysLater = new Date(targetClean);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  // 3. 获取当前时间，同样清零分秒
  const now = new Date();
  const nowClean = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    0,
    0,
    0,
  );

  // 4. 当前清洗后时间 >= 目标+3天 则返回true
  return nowClean.getTime() >= threeDaysLater.getTime();
}
