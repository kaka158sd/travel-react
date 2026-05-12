import { rulesParse } from '@/utils';
import { Carousel, Typography, Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getUsersAPI } from '@/apis/users';
import { setUserStorage } from '@/utils/userStorage';
import { fetchLogin, setToken } from '@/store/modules/user';
import { useDispatch } from 'react-redux';

const { Title } = Typography;

const images = [
  'https://tse1-mm.cn.bing.net/th/id/OIP-C.zkLkGz4XDWorphyFth9_4QHaEC?w=317&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://tse3-mm.cn.bing.net/th/id/OIP-C.SFW1VcS8gueERFbtdZCFvwHaE7?w=249&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://tse2-mm.cn.bing.net/th/id/OIP-C.HP4mZ_N_N-mkMZaLxK3YdwHaD4?w=315&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://tse2-mm.cn.bing.net/th/id/OIP-C.kxPmGPAptXNSrorcJTrDkAHaE8?w=288&h=192&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://tse1-mm.cn.bing.net/th/id/OIP-C.-3Lnln93IaevT4Iwua7BzQHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://tse2-mm.cn.bing.net/th/id/OIP-C.BhYWGMA4Kcy51HC9NeypeAHaD2?w=328&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
];

// 表单配置
const loginFormFields = {
  size: 'medium',
  formItems: [
    {
      label: '手机号',
      name: 'phone',
      rules: 'required phone',
      formConfig: {
        width: 260,
        placeholder: '请输入手机号',
        prefix: 'icon-user1',
        isDisabled: false,
      },
    },
    {
      label: '密码',
      name: 'password',
      rules: 'required password',
      formConfig: {
        width: 260,
        placeholder: '请输入密码',
        isDisabled: false,
        prefix: 'icon-yinsibaohu',
      },
    },
  ],
};

// 不同身份跳转到不同的用户中心
const navCenter = [
  { type: 1, nav: '/touristCenter' },
  { type: 2, nav: '/inheritorCenter' },
  { type: 3, nav: '/adminCenter' },
];

const Login = () => {
  const [loginForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (error) {
        console.error('获取用户列表失败', error);
      }
    };

    getUsersList();
  }, []);

  const handleLogin = async (values) => {
    try {
      // 调用模拟登录接口
      const res = await fetchLogin(users, values);
      // 解构出 user 和 token
      const { user: userInfo, token } = res;

      // 登录成功，存储 token 和用户信息
      dispatch(setToken(token));
      setUserStorage(userInfo);
      messageApi.success('登录成功');

      let timer;
      // 延迟跳转
      timer = setTimeout(() => {
        const matchedNav = navCenter.find(
          (item) => item.type === userInfo?.identity_type,
        );
        if (matchedNav) {
          navigate(matchedNav.nav);
        } else {
          // 兜底：找不到就跳登录页
          navigate('/login');
        }
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err) {
      // 登录失败
      messageApi.error(err.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      {/* 返回首页按钮 */}
      <div className="w-32 absolute top-5 left-5">
        <button className="btn2" onClick={() => navigate('/')}>
          <HomeOutlined className="mr-1" />
          返回首页
        </button>
      </div>

      <div className="w-300 h-120 border border-orange-400 rounded-2xl shadow-lg shadow-orange-100 flex items-center">
        {/* 轮播图区域 */}
        <Carousel
          arrows
          autoplay="true"
          infinite="true"
          className="w-180 h-120 rounded-2xl overflow-hidden"
        >
          {images.map((item, index) => (
            <div key={index}>
              <img src={item} className="w-180 h-120" />
            </div>
          ))}
        </Carousel>

        {/* 用户登陆区域 */}
        <div className="flex flex-col flex-1 items-center">
          <Title level={3} style={{ color: '#d97706', marginBottom: 36 }}>
            用户登陆
          </Title>

          {/* 登陆表单 */}
          {contextHolder}
          <div>
            <Form
              form={loginForm}
              size={loginFormFields.size}
              layout="horizontal"
              labelAlign="right"
              onFinish={handleLogin}
              labelCol={{ span: 6 }} // 设置label的宽度
            >
              <Form.Item
                key={loginFormFields.formItems[0].name}
                label={loginFormFields.formItems[0].label}
                name={loginFormFields.formItems[0].name}
                rules={rulesParse(loginFormFields.formItems[0].rules)}
              >
                <Input
                  placeholder={
                    loginFormFields.formItems[0].formConfig.placeholder || ''
                  }
                  prefix={
                    loginFormFields.formItems[0].formConfig.prefix ? (
                      <i
                        className={`iconfont ${loginFormFields.formItems[0].formConfig.prefix}`}
                      />
                    ) : undefined
                  }
                  disabled={
                    loginFormFields.formItems[0].formConfig.isDisabled || false
                  }
                  style={{
                    width: loginFormFields.formItems[0].formConfig.width,
                  }}
                />
              </Form.Item>
              <Form.Item
                key={loginFormFields.formItems[1].name}
                label={loginFormFields.formItems[1].label}
                name={loginFormFields.formItems[1].name}
                rules={rulesParse(loginFormFields.formItems[1].rules)}
              >
                <Input.Password
                  placeholder={
                    loginFormFields.formItems[1].formConfig.placeholder || ''
                  }
                  prefix={
                    loginFormFields.formItems[1].formConfig.prefix ? (
                      <i
                        className={`iconfont ${loginFormFields.formItems[1].formConfig.prefix}`}
                      />
                    ) : undefined
                  }
                  disabled={
                    loginFormFields.formItems[1].formConfig.isDisabled || false
                  }
                  style={{
                    width: loginFormFields.formItems[1].formConfig.width,
                  }}
                />
              </Form.Item>
              <Form.Item>
                {/* 登陆按钮 */}
                <div className="mt-4 w-full flex justify-center">
                  <Button type="primary" htmlType="submit" className="w-30">
                    登陆
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>

          {/* 跳转至注册 */}
          <Button type="link" href="/register">
            还没有账号？立即注册
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
