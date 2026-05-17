// 与游客ID有关的方法

// 存
export function setTouristIdStorage(id) {
  localStorage.setItem('tourist_id', id);
}

// 取
export function getTouristIdStorage() {
  return Number(localStorage.getItem('tourist_id'));
}

// 删
export function removeTouristIdStorage() {
  localStorage.removeItem('tourist_id');
}

// 与传承人id有关

// 存
export function setInheritorIdStorage(id) {
  localStorage.setItem('inheritor_id', id);
}

// 取
export function getInheritorIdStorage() {
  return Number(localStorage.getItem('inheritor_id'));
}

// 删
export function removeInheritorIdStorage() {
  localStorage.removeItem('inheritor_id');
}

// 与管理员id有关

// 存
export function setAdminIdStorage(id) {
  localStorage.setItem('admin_id', id);
}

// 取
export function getAdminIdStorage() {
  return Number(localStorage.getItem('admin_id'));
}

// 删
export function removeAdminIdStorage() {
  localStorage.removeItem('admin_id');
}
