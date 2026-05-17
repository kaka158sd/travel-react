// str：需要转换的字符串；separator：转换字符串的分隔符

// 字符串转数组（按分隔符切割）

export function strToArray(str, separator = '、') {
  if (!str) return [];

  return str.split(separator).filter((item) => item.trim());
}

// 数组转字符串（用分隔符拼接）

export function arrayToStr(arr, separator = '、') {
  if (!Array.isArray(arr) || arr.length === 0) return '';

  return arr.filter((item) => item != null).join(separator);
}
