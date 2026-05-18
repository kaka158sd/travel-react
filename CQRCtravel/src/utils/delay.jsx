// 干净、无残留、不占内存的 Promise 等待

export const delay = (ms) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve();
    }, ms);

    // Promise 完成后自动清除定时器
    return () => clearTimeout(timer);
  });
};
