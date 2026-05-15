// axios的封装处理
import axios from 'axios';

// 1.根域名配置
// 2.超时时间
// 3.请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: 'https://cjjcirgfuyytugwdyslf.supabase.co/rest/v1',
  timeout: 10000,
  withCredentials: false, // 解决预检请求超时
});

// 添加请求拦截器（在请求发送之前做拦截，插入一些自定义的配置）
request.interceptors.request.use(
  function (config) {
    // 替换为supabase中的 Publishable Key
    const SUPABASE_ANON_KEY = 'sb_publishable_9ksdc-8S2UXE6Gfp1X89Xw_wLDm0VJc';

    config.headers['apikey'] = SUPABASE_ANON_KEY;
    config.headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器（在响应返回到客户端之前做拦截，重点处理返回的数据）
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    // 只对超时请求重试
    if (error.code === 'ECONNABORTED' && !config.__retryCount) {
      config.__retryCount = 0;
    }

    // 最多重试 3 次
    const maxRetries = 3;
    if (config.__retryCount < maxRetries) {
      config.__retryCount += 1;
      console.log(`请求超时，第 ${config.__retryCount} 次重试`);
      // 等待 1 秒后重试
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return request(config);
    }

    return Promise.reject(error);
  },
);

export { request };
