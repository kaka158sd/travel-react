// 封装高阶组件

import {
  getToken,
  getUserStorage,
  removeToken,
  removeUserStorage,
} from '@/utils';
import { message } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

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
  const { token, currentUser } = useSelector((state) => state.user);
  const localToken = typeof window !== 'undefined' ? getToken() : null;
  const localCurrentUser =
    typeof window !== 'undefined' ? getUserStorage() : null;
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const effectiveToken = token || localToken;
    const effectiveUser = currentUser || localCurrentUser;

    if (!effectiveToken) {
      messageApi.error('您还没有登陆，请登陆！');
      navigate('/login', { replace: true }); // 强制跳转
      return;
    }

    if (!effectiveUser) {
      messageApi.error('您还没有登陆，请登陆！');
      removeToken();
      removeUserStorage();
      navigate('/login', { replace: true }); // 强制跳转
      return;
    }

    // 已登录且用户信息存在，再判断身份
    if (effectiveUser.identity_type !== 1) {
      messageApi.error('您不是游客，禁止操作！');
      navigate('/', { replace: true });
    }
  }, [
    messageApi,
    contextHolder,
    token,
    currentUser,
    localToken,
    localCurrentUser,
    navigate,
  ]);

  const effectiveToken = token || localToken;
  const effectiveUser = currentUser || localCurrentUser;
  // 只在 token 存在且身份为游客时，才渲染 children
  if (!effectiveToken) {
    // token 不存在时，直接跳转到登录页
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }
  if (effectiveUser?.identity_type !== 1) {
    // 身份不符时，不渲染 children，也不跳转
    return (
      <>
        {contextHolder}
        <Navigate to="/" replace />
      </>
    );
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
  const { token, currentUser } = useSelector((state) => state.user);
  const localToken = typeof window !== 'undefined' ? getToken() : null;
  const localCurrentUser =
    typeof window !== 'undefined' ? getUserStorage() : null;
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const effectiveToken = token || localToken;
    const effectiveUser = currentUser || localCurrentUser;

    if (!effectiveToken) {
      messageApi.error('您还没有登陆，请登陆！');
      navigate('/login', { replace: true });
      return;
    }

    if (!effectiveUser) {
      messageApi.error('您还没有登陆，请登陆！');
      removeToken();
      removeUserStorage();
      navigate('/login', { replace: true });
      return;
    }

    if (effectiveUser.identity_type !== 2) {
      messageApi.error('您不是传承人，禁止操作！');
    }
  }, [
    messageApi,
    contextHolder,
    token,
    currentUser,
    localToken,
    localCurrentUser,
    navigate,
  ]);

  const effectiveToken = token || localToken;
  const effectiveUser = currentUser || localCurrentUser;
  if (!effectiveToken) {
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }
  if (effectiveUser?.identity_type !== 2) {
    // 身份不符时，不渲染 children，也不跳转
    return (
      <>
        {contextHolder}
        <Navigate to="/" replace />
      </>
    );
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
  const { token, currentUser } = useSelector((state) => state.user);
  const localToken = typeof window !== 'undefined' ? getToken() : null;
  const localCurrentUser =
    typeof window !== 'undefined' ? getUserStorage() : null;
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const effectiveToken = token || localToken;
    const effectiveUser = currentUser || localCurrentUser;

    if (!effectiveToken) {
      messageApi.error('您还没有登陆，请登陆！');
      navigate('/login', { replace: true });
      return;
    }

    if (!effectiveUser) {
      messageApi.error('您还没有登陆，请登陆！');
      removeToken();
      removeUserStorage();
      navigate('/login', { replace: true });
      return;
    }

    if (effectiveUser.identity_type !== 3) {
      messageApi.error('您不是管理员，禁止操作！');
    }
  }, [
    messageApi,
    contextHolder,
    token,
    currentUser,
    localToken,
    localCurrentUser,
    navigate,
  ]);

  const effectiveToken = token || localToken;
  const effectiveUser = currentUser || localCurrentUser;
  if (!effectiveToken) {
    return (
      <>
        {contextHolder}
        <Navigate to="/login" replace />
      </>
    );
  }

  if (effectiveUser?.identity_type !== 3) {
    // 身份不符时，不渲染 children，也不跳转
    return (
      <>
        {contextHolder}
        <Navigate to="/" replace />
      </>
    );
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
