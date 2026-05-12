// 与钱包有关的方法

// 存储本地存储的钱包金额
export function setWalletStorage(wallet) {
  localStorage.setItem('wallet', wallet);
}

// 取
export function getWalletStorage() {
  return localStorage.getItem('wallet');
}

// 删
export function removeWalletStorage() {
  localStorage.removeItem('wallet');
}
