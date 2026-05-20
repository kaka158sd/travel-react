// 自定义强制刷新hook方法

import { useState } from 'react';

export function useForceUpdate() {
  const [, setUpdate] = useState(0);
  return () => setUpdate((prev) => prev + 1);
}
