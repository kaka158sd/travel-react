//  深度对比两个数据是否相同

export function deepEqual(a, b) {
  //  类型不同直接返回false
  if (typeof a !== typeof b) return false;

  // 当其中有空值或者是基础类型时
  if (a === null || typeof a !== 'object') return a === b;

  // 数组
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // 对象
  // Object.keys(a) 返回的是一个包含对象a的所有键（对象内的变量名）的数组
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]));
}
