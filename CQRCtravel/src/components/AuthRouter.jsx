// 封装高阶组件

import { getToken, getUserStorage } from '@/utils';
import { message } from 'antd';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// 有token 正常跳转，无token去登陆
function AuthRouter({ children }) {
  const token = typeof window !== 'undefined' ? getToken() : null;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) {
      messageApi.error('还没有登陆，请登陆！');
      return;
    }
  }, [token, contextHolder, messageApi]);

  if (!token) {
    // token 不存在时，直接跳转到登录页
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}

// 需要token和用户身份为游客
function AuthTourist({ children }) {
  const token = typeof window !== 'undefined' ? getToken() : null;
  const currentUser = typeof window !== 'undefined' ? getUserStorage() : null;
  // const identity = currentUser.identity_type === 1;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) {
      messageApi.error('您还没有登陆，请登陆！');
      return;
    }

    if (!currentUser) {
      messageApi.error('您还没有登陆，请登陆！');
      return;
    }

    // 已登录且用户信息存在，再判断身份
    if (currentUser.identity_type !== 1) {
      messageApi.error('您不是游客，禁止操作！');
    }
  }, [messageApi, contextHolder, token, currentUser]);

  // 只在 token 存在且身份为游客时，才渲染 children
  if (!token) {
    // token 不存在时，直接跳转到登录页
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }

  if (currentUser?.identity_type !== 1) {
    // 身份不符时，不渲染 children，也不跳转
    return <>{contextHolder}</>;
  }

  // 校验通过，渲染子组件
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}

// 需要token和用户身份为传承人
function AuthInheritor({ children }) {
  const token = typeof window !== 'undefined' ? getToken() : null;
  const currentUser = typeof window !== 'undefined' ? getUserStorage() : null;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) {
      messageApi.error('您还没有登陆，请登陆！');
      return;
    }

    if (!currentUser) {
      messageApi.error('您还没有登陆，请登陆！');
      return;
    }

    if (currentUser.identity_type !== 2) {
      messageApi.error('您不是传承人，禁止操作！');
    }
  }, [messageApi, contextHolder, token, currentUser]);

  if (!token) {
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }

  if (currentUser?.identity_type !== 2) {
    // 身份不符时，不渲染 children，也不跳转
    return <>{contextHolder}</>;
  }

  // 校验通过，渲染子组件
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}

// 需要token和用户身份为管理员
function AuthAdmin({ children }) {
  const token = typeof window !== 'undefined' ? getToken() : null;
  const currentUser = typeof window !== 'undefined' ? getUserStorage() : null;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) {
      messageApi.error('您还没有登陆，请登陆！');
      return;
    }

    if (!currentUser) {
      messageApi.error('您还没有登陆，请登陆！');
      return;
    }

    if (currentUser.identity_type !== 3) {
      messageApi.error('您不是管理员，禁止操作！');
    }
  }, [messageApi, contextHolder, token, currentUser]);

  if (!token) {
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }

  if (currentUser?.identity_type !== 3) {
    // 身份不符时，不渲染 children，也不跳转
    return <>{contextHolder}</>;
  }

  // 校验通过，渲染子组件
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}

export { AuthRouter, AuthTourist, AuthInheritor, AuthAdmin };
