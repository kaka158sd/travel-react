// 存放钱包模块的相关接口

import { request } from '@/utils';

// 游客钱包流水

// 获取游客钱包流水列表

export function getWalletFlowsAPI() {
  return request({
    url: '/wallet_flow',
    method: 'GET',
  });
}

// 获取游客钱包流水详情

export function getWalletFlowDetailAPI(id) {
  return request({
    url: '/wallet_flow',
    method: 'GET',
    params: {
      flow_id: `eq.${id}`,
    },
  });
}

// 新增游客钱包流水

export function postWalletFlowAPI(data) {
  return request({
    url: '/wallet_flow',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 更新游客钱包流水

export function updateWalletFlowAPI(id, data) {
  return request({
    url: '/wallet_flow',
    method: 'PATCH',
    data,
    params: {
      flow_id: `eq.${id}`,
    },
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 平台资金总账

// 获取平台资金总账详情

export function getPlatformWalletAPI() {
  return request({
    url: '/platform_wallet',
    method: 'GET',
    params: {
      id: `eq.1`,
    },
  });
}

// 更新平台资金总账视图

export function updatePlatformWalletAPI(data) {
  return request({
    url: '/platform_wallet_patch',
    method: 'PATCH',
    data,
    params: {
      id: 'eq.1',
    },
    headers: {
      Prefer: 'return=representation',
    },
  });
}

// 平台资金流水

// 获取平台资金流水列表

export function getPlatformWalletFlowsAPI() {
  return request({
    url: '/platform_wallet_flow',
    method: 'GET',
  });
}

// 获取平台资金流水详情

export function getPlatformWalletFlowDetailAPI(id) {
  return request({
    url: '/platform_wallet_flow',
    method: 'GET',
    params: {
      flow_id: `eq.${id}`,
    },
  });
}

// 新增平台资金流水

export function postPlatformWalletFlowAPI(data) {
  return request({
    url: '/platform_wallet_flow',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 退款审核单

// 获取退款审核单列表

export function getWalletRefundAuditsAPI() {
  return request({
    url: '/wallet_refund_audit',
    method: 'GET',
  });
}

// 获取退款审核单详情

export function getWalletRefundAuditDetailAPI(id) {
  return request({
    url: '/wallet_refund_audit',
    method: 'GET',
    params: {
      audit_id: `eq.${id}`,
    },
  });
}

// 新增退款审核单

export function postWalletRefundAuditAPI(data) {
  return request({
    url: '/wallet_refund_audit',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 更新退款审核单

export function updateWalletRefundAuditAPI(id, data) {
  return request({
    url: '/wallet_refund_audit',
    method: 'PATCH',
    data,
    params: {
      audit_id: `eq.${id}`,
    },
    headers: {
      Prefer: 'return=representation',
    },
  });
}
