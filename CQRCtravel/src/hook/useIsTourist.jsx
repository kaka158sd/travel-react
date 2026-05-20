// 判断是否为游客

import { useSelector } from 'react-redux';

export function useIsTourist() {
  const currentUser = useSelector((state) => state.user.currentUser);
  if (!currentUser) return false;

  // 当前用户身份是否为游客
  const isTourist = currentUser?.identity_type === 1;

  return isTourist;
}
