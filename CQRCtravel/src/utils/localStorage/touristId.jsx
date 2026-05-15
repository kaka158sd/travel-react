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
