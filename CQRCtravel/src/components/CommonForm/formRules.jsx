export const formRules = {
  // 选填（不做任何校验，有值才校验）
  optional: [],

  // 必填校验
  required: [
    {
      validator: (_, value) => {
        // null/undefined,字符串空值,数组空值  → 不通过
        if (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0) ||
          value === '' ||
          (value && typeof value.isValid === 'function' && !value.isValid())
        ) {
          return Promise.reject('此项不能为空');
        }

        // 其他情况通过
        return Promise.resolve();
      },
      trigger: ['blur', 'change'],
    },
  ],

  // 类型校验
  type: {
    // 必须是字符串
    string: [
      {
        validator: (_, value) => {
          if (!value) return Promise.resolve();
          // 不是字符串类型不通过
          if (/\d/.test(value)) {
            return Promise.reject('请仅输入文字、字母或符号');
          }

          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    // 必须是数字
    number: [
      {
        validator: (_, value) => {
          if (value === null || value === undefined || value === '') {
            return Promise.resolve();
          }
          const strValue = String(value);
          if (!/^\d+(\.\d+)?$/.test(strValue)) {
            return Promise.reject('请仅输入数字');
          }
          return Promise.resolve();
        },
        trigger: ['blur', 'change'], // 加上 change 触发
      },
    ],
  },

  // 手机号校验（必填 + 格式）
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],

  // 密码校验（6-18位 + 至少两种组合）
  password: [
    { min: 6, max: 18, message: '密码长度 6-18 位', trigger: 'blur' },
    {
      validator: (_, value) => {
        if (!value) return Promise.resolve();
        // 正则：必须包含至少两种：大小写字母、数字、!@#
        const reg =
          /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![!@#]+$)[0-9a-zA-Z!@#]{6,18}$/;
        if (reg.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject('密码必须包含至少两种组合：字母/数字/!@#');
      },
    },
  ],

  // 日期校验（不能早于今天）
  date: [
    // 必填校验：用 trigger: 'change'，并且兼容 dayjs 对象
    {
      trigger: 'change',
      transform: (value) => value?.format('YYYY-MM-DD'), // 转成字符串
    },
    // 日期校验
    {
      validator: (_, value) => {
        // 空值直接通过，交给 required 校验
        if (!value) return Promise.resolve();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // 把 dayjs 对象转成 Date 再比较
        const selectDate = new Date(value.format('YYYY-MM-DD'));
        selectDate.setHours(0, 0, 0, 0);

        if (selectDate < today) {
          return Promise.reject('日期不能早于今天');
        }
        return Promise.resolve();
      },
      trigger: 'change', // 和 required 保持一致
    },
  ],

  // 字数长度校验
  length: {
    // 4-20 字
    len4_20: [
      {
        min: 4,
        max: 20,
        message: '请输入长度在 4 到 20 个字符',
        trigger: 'blur',
      },
    ],
    // 1-10 字
    len1_10: [
      {
        min: 1,
        max: 10,
        message: '请输入长度在 1 到 10 个字符',
        trigger: 'blur',
      },
    ],
  },

  // 常用组合：必填 + 字符串
  // requiredString: [
  //   { required: true, message: '该字段不能为空', trigger: 'blur' },
  //   { type: 'string', message: '请输入字符串' },
  // ],
};
