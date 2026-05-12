// 存放与登陆、注册有关的接口请求

import { supabase } from '@/lib/supabase';

// 登陆：手机号 + 密码；返回：Token + 用户信息
// export async function login(phone, password) {
//   // 在supabase中设置的为默认邮箱登陆，需要将手机号变成邮箱
//   const email = `${phone}@demo.com`;

//   const { data: authData, error: authError } =
//     await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//   if (authError) {
//     return { success: false, msg: authError.message };
//   }

//   // 获取users表中的身份信息
//   const { data: userInfo } = await supabase
//     .from('users')
//     .select('*')
//     .eq('auth_id', authData.user.id)
//     .single();

//   return {
//     success: true,
//     token: authData.session.access_token,
//     userInfo,
//   };
// }

// 纯登录，不查业务表，不关联任何外键
// 只要 auth 里有这个用户，就能登录成功！
export async function login(phone, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: phone + '@demo.com', // 关键：只用邮箱登录
    password: password,
  });

  if (error) {
    console.log('登录失败：', error.message);
    return;
  }

  console.log('✅ 登录成功！', data.user.id);
  return data.user;
}

// 注册：手机号 + 密码 + 用户名 + 身份类型
// export async function register(phone, password, userName, identityType) {
//   const email = `${phone}@demo.com`;

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         user_name: userName,
//         identity_type: identityType,
//       },
//     },
//   });

//   if (error) {
//     return { success: false, msg: error.message };
//   }

//   return {
//     success: true,
//     data,
//   };
// }

export async function register(phone, password) {
  const { data, error } = await supabase.auth.signUp({
    email: phone + '@demo.com',
    password: password,
  });

  if (error) {
    console.log('注册失败：', error.message);
    return;
  }

  console.log('✅ 注册成功！');
}

// 登出
export async function logout() {
  await supabase.auth.signOut();
}

// 获取当前登陆状态
export async function getCurrentToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

// 注册一个全新的测试用户
export async function testSimpleRegister() {
  const phone = '13812345678';
  const password = '123456a';

  // 只传email和password，去掉options里的data
  const { data, error } = await supabase.auth.signUp({
    email: `${phone}@demo.com`,
    password: password,
  });

  if (error) {
    console.log('注册失败', error.message);
    return;
  }

  console.log('注册成功！用这个手机号+密码登录：', phone, password);
}

export async function registerUser(
  phone,
  password,
  userName = null,
  identityType = 1,
) {
  // 1. 注册用户（不带任何额外数据）
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: `${phone}@demo.com`,
    password: password,
  });

  if (authError) {
    console.error('注册失败', authError.message);
    return { success: false, error: authError.message };
  }

  const userId = authData.user.id;

  // 2. 手动同步数据到 public.users 表
  const { error: insertError } = await supabase.from('users').insert([
    {
      id: userId,
      phone: phone,
      user_name: userName,
      identity_type: identityType,
    },
  ]);

  if (insertError) {
    console.error('同步用户数据失败', insertError.message);
    return { success: false, error: insertError.message };
  }

  console.log('注册并同步成功！');
  return { success: true, user: authData.user };
}
