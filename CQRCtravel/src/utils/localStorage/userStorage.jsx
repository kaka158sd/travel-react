// 登陆成功则将用户信息存入本地存储中

export function setUserStorage(value) {
  try {
    localStorage.setItem('currentUser', JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

export function getUserStorage() {
  try {
    const item = localStorage.getItem('currentUser');
    return JSON.parse(item);
  } catch (error) {
    console.error(error);
  }
}

export function removeUserStorage() {
  try {
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error(error);
  }
}
