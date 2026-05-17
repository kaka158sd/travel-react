// 判断是否为游客

import { useSelector } from 'react-redux';

export function useIsTourist() {
  const { currentUser = {} } = useSelector((state) => state.user);

  // 当前用户身份是否为游客
  const isTourist = currentUser.identity_type === 1;

  return isTourist;
}
