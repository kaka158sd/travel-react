// axios的封装处理
import axios from 'axios';

// 1.根域名配置
// 2.超时时间
// 3.请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: 'https://cjjcirgfuyytugwdyslf.supabase.co/rest/v1',
  timeout: 5000,
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
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export { request };
