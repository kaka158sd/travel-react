// 表单校验规则的字符串拼接函数

import { formRules } from '@/components/CommonForm/formRules';

// 传入规则字符串 "required phone" → 返回合并后的规则数组
export const rulesParse = (ruleStr) => {
  // 空值直接返回空数组
  if (!ruleStr) return [];

  return ruleStr
    .split(' ')
    .map((key) => {
      // 优先匹配根层规则
      if (formRules[key]) {
        return formRules[key];
      }
      // 匹配嵌套的规则
      if (formRules.type?.[key]) {
        return formRules.type[key];
      } else if (formRules.length?.[key]) {
        return formRules.length[key];
      }

      return [];
    })
    .flat(); // 拍平数组
};
