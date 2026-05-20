import {
  delay,
  getSession,
  removeSession,
  rulesParse,
  setSession,
} from '@/utils';
import { Form, Radio, Input, message, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BorderBox11 from '@jiaminghi/data-view-react/es/borderBox11';
import './index.less';
import { getUsersAPI, postUserAPI } from '@/apis/users';

// 注册页面的字段名
const PAGE_KEY = 'register_pageLayout';
// 存储身份的字段名
const IDENTITY_TYPE = 'register_identity';

// 三种身份的图标、文字样式
const userStyle = [
  {
    icon: 'icon-shenfenshibierenzheng',
    identity: '游客',
    desc: '漫步特色胜地，邂逅烟火人文，解锁多彩旅行体验',
  },
  {
    icon: 'icon-hot-for-atmosphere',
    identity: '文化传承人',
    desc: '深耕非遗技艺，坚守匠心初心，让传统技艺生生不息',
  },
  {
    icon: 'icon-company-fill',
    identity: '文旅局管理员',
    desc: '深耕文旅管理工作，统筹资源建设，赋能本地文旅高质量发展',
  },
];

// 表单配置
const registerFormFields = {
  size: 'large',
  formItems: [
    {
      label: '用户名',
      name: 'username',
      rules: 'required',
      formConfig: {
        width: 350,
        placeholder: '请输入用户名',
      },
    },
    {
      label: '手机号',
      name: 'phone',
      rules: 'required phone',
      formConfig: {
        width: 350,
        placeholder: '请输入手机号',
      },
    },
    {
      label: '密码',
      name: 'password',
      rules: 'required password',
      formConfig: {
        width: 350,
        placeholder: '请输入密码',
      },
    },
    {
      label: '确认密码',
      name: 'confirmPaw',
      rules: 'required password',
      formConfig: {
        width: 350,
        placeholder: '请确认密码',
      },
    },
  ],
};

const Register = () => {
  const navigate = useNavigate();
  // 获取注册身份
  const [identityType, setIdentityType] = useState(
    getSession(IDENTITY_TYPE) || null,
  );

  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState([]);

  // 注册表单
  const [registerForm] = Form.useForm();

  // 控制选择身份 / 注册信息填写的显隐;初始化，从本地获取
  const [pageLayout, setpageLayout] = useState(() => {
    const nav = getSession(PAGE_KEY);
    if (!nav || nav.length === 0) {
      setSession(PAGE_KEY, 1);
      return 1;
    }
    return nav;
  });

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (error) {
        console.error('获取用户列表失败!', error);
      }
    };

    getUsersList();
  }, []);

  // pageLayout每次更新都同步到本地中
  const setPageLayoutLocation = (value) => {
    setpageLayout(value);
    setSession(PAGE_KEY, value);
  };

  // 身份选择单选框群的change事件
  const handleSelectIdentity = (e) => {
    const value = e.target.value;
    // console.log(e.target.value);
    setIdentityType(value);
    setSession(IDENTITY_TYPE, value);
  };

  // 完成注册回调
  const handleFinally = async () => {
    const loadingKey = 'register-loading';
    let isLoadingOpened = false;

    try {
      const values = await registerForm.validateFields();
      console.log('表单的值：', values);
      const { username, phone, password, confirmPaw } = values;

      // 获取身份类型
      const identity_type =
        identityType === '游客' ? 1 : identityType === '文化传承人' ? 2 : 3;
      const identityList = users.filter(
        (item) => item.identity_type === identity_type,
      );

      // 不同身份可以同名但相同身份不可以
      const isNameExisted = identityList.some(
        (item) => item.user_name === username,
      );
      if (isNameExisted) {
        messageApi.error('当前名称已注册！');
        return;
      }

      // 手机号是否已经存在
      const isPhoneExisted = identityList.some((item) => item.phone === phone);
      if (isPhoneExisted) {
        messageApi.error('当前手机号已被注册！');
        return;
      }

      // 确认密码是否与密码相同
      if (confirmPaw !== password) {
        messageApi.error('两次输入的密码不一致，请重新输入！');
        return;
      }

      messageApi.open({
        key: loadingKey, // 固定 key，避免重复创建
        type: 'loading',
        content: '正在注册中，请稍候...',
        duration: 0,
      });
      isLoadingOpened = true;

      // 新增数据处理
      const processData = {
        identity_type,
        user_name: username,
        phone,
        password,
      };
      console.log('用户请求接口数据：', processData);

      // 新增用户接口请求
      await postUserAPI(processData);

      // 删除加载状态的全局消息
      messageApi.destroy(loadingKey);
      isLoadingOpened = false;

      messageApi.success('注册成功！');

      // 延时跳转
      await delay(1000);
      navigate('/login');
      // 跳转登陆时需要清除本地存储的注册页面的导航字段
      removeSession(IDENTITY_TYPE);
      removeSession(PAGE_KEY);
    } catch (error) {
      console.error('注册失败，请重试！', error);
      messageApi.error('注册失败，请重试！');
    } finally {
      if (isLoadingOpened) {
        messageApi.destroy(loadingKey);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      {/* 返回登陆按钮 */}
      <div className="absolute top-5 left-5 w-12">
        <button
          className="btn2"
          onClick={() => {
            navigate('/login');
            removeSession(PAGE_KEY);
            removeSession(IDENTITY_TYPE);
          }}
        >
          ＜
        </button>
      </div>

      {/* 用户名不可修改警告框 */}
      {pageLayout === 2 &&
      (identityType === '文化传承人' || identityType === '文旅局管理员') ? (
        <Alert
          type="warning"
          title="请确认当前用户名，一经注册，则不可随意修改用户名，若需修改请联系管理员！"
          style={{ margin: 24, fontSize: 16 }}
          variant="filled"
          showIcon
        />
      ) : (
        <div className="w-full h-22.5"></div>
      )}

      <div className="w-300 h-120 bg-[#fef9f5] border border-orange-400 rounded-2xl shadow-lg shadow-orange-100">
        {contextHolder}
        {/* 选择注册身份页面 */}
        {pageLayout === 1 && (
          <div className="flex flex-col items-center">
            <div className="text-xl tracking-widest font-semibold my-12">
              选择注册身份
            </div>

            {/* 三种身份选择 */}
            <div className="w-3/4">
              <Radio.Group
                name="identity-radio"
                value={identityType}
                onChange={handleSelectIdentity}
                vertical="true"
                options={userStyle.map((item) => ({
                  value: item.identity,
                  label: (
                    <div className="flex items-center gap-4 p-4 w-115">
                      <i
                        className={`iconfont ${item.icon} text-color1`}
                        style={{ fontSize: 30 }}
                      />
                      <div>
                        <div className="text-lg font-semibold opacity-85">
                          {item.identity}
                        </div>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>

            {/* 下一步 */}
            <div className="w-30 py-1 ml-220">
              <button
                className="btn2"
                onClick={() => {
                  // 验证是否选择了身份
                  if (!identityType || identityType.length === 0) {
                    messageApi.error('请先选择身份再进行下一步注册！');
                    return;
                  }
                  setPageLayoutLocation(2);
                }}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* 填写注册信息页面 */}
        {pageLayout === 2 && (
          <div className="flex flex-col items-center">
            <div className="text-xl tracking-widest font-semibold my-12">
              填写注册信息
            </div>

            <div className="flex gap-40">
              {/* 注册信息表单 */}
              <div className="w-1/2">
                <Form
                  form={registerForm}
                  size={registerFormFields.size}
                  layout="horizontal"
                  labelAlign="right"
                  labelCol={{ span: 8 }}
                  autoComplete="off"
                >
                  {registerFormFields.formItems.map((item, index) => (
                    <Form.Item
                      key={item.name}
                      label={item.label}
                      name={item.name}
                      rules={rulesParse(item.rules)}
                    >
                      {index <= 1 ? (
                        <Input
                          placeholder={item.formConfig.placeholder || ''}
                          style={{
                            width: item.formConfig.width,
                          }}
                          autoComplete="off"
                        />
                      ) : (
                        <Input.Password
                          placeholder={item.formConfig.placeholder || ''}
                          style={{
                            width: item.formConfig.width,
                          }}
                          autoComplete="new-password"
                        />
                      )}
                    </Form.Item>
                  ))}
                </Form>
              </div>

              <div className="w-100 h-50">
                <BorderBox11
                  color={['#89b863', '#ff8800']}
                  backgroundColor="#fef9f5"
                >
                  <div className="text-center py-4 text-black tracking-widest">
                    你的身份
                  </div>
                  <div
                    className="text-transparent bg-clip-text bg-linear-to-r from-[#FF8103] via-[#63baab] to-[#e17100] bg-size-[300%_300%] text-5xl tracking-widest text-center py-8"
                    style={{
                      animation: 'gradientFlow 3s linear infinite',
                    }}
                  >
                    {identityType ? identityType : '暂未选择身份信息'}
                  </div>
                </BorderBox11>
              </div>
            </div>

            {/* 上一页、完成注册按钮 */}
            <div className="w-10/11 flex justify-between mt-4">
              <div className="w-40 py-1">
                <button
                  className="btn2"
                  onClick={() => setPageLayoutLocation(1)}
                >
                  上一步
                </button>
              </div>
              <div className="w-40 py-1">
                <button className="btn2" onClick={handleFinally}>
                  完成注册
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
