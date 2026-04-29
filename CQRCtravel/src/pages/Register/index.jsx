import { DataField } from '@/components';
import { rulesParse } from '@/utils';
import { Form } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BorderBox11 from '@jiaminghi/data-view-react/es/borderBox11';

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

// 单选框配置
const formConfig = {
  name: 'identity-radio',
  isVertical: true,
  optionsItem: userStyle.map((item) => ({
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
  })),
};

// 表单配置
const registerFormFields = {
  size: 'large',
  formItems: [
    {
      label: '用户名',
      name: 'username',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        width: 350,
        placeholder: '请输入用户名',
        isDisabled: false,
      },
    },
    {
      label: '手机号',
      name: 'phone',
      rules: 'required phone',
      type: 'textInput',
      formConfig: {
        width: 350,
        placeholder: '请输入手机号',
        isDisabled: false,
      },
    },
    {
      label: '密码',
      name: 'password',
      rules: 'required password',
      type: 'password',
      formConfig: {
        width: 350,
        placeholder: '请输入密码',
        isDisabled: false,
      },
    },
    {
      label: '确认密码',
      name: 'confirmPaw',
      rules: 'required password',
      type: 'password',
      formConfig: {
        width: 350,
        placeholder: '请确认密码',
        isDisabled: false,
      },
    },
  ],
};

// 读取本地存储页面布局变量的函数
const getInitialPageLayout = () => {
  const saved = localStorage.getItem('pageLayout');
  // 如果本地存储中有值则返回值，否则默认是1
  return saved ? parseInt(saved, 10) : 1;
};

const Register = () => {
  const navigate = useNavigate();

  // 注册表单
  const [registerForm] = Form.useForm();

  // 控制选择身份 / 注册信息填写的显隐;初始化，从本地获取
  const [pageLayout, setpageLayout] = useState(getInitialPageLayout);

  // pageLayout每次更新都同步到本地中
  const setPageLayoutLocation = (value) => {
    setpageLayout(value);
    localStorage.setItem('pageLayout', value.toString());
  };

  // 每次进入页面（即页面开始渲染）时，重置pageLayout为1
  // 为避免在组件挂载时，同步直接调用了 setState，使用定时器
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLayoutLocation(1);
    }, 0);

    return () => clearTimeout(timer); //组件卸载时清除定时器
  }, []);

  // 完成注册回调
  const handleFinally = () => {
    navigate('/login');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      {/* 返回登陆按钮 */}
      <div className="absolute top-5 left-5 w-12">
        <button className="btn2" onClick={() => navigate('/login')}>
          ＜
        </button>
      </div>

      <div className="w-300 h-120 bg-[#fef9f5] border border-orange-400 rounded-2xl shadow-lg shadow-orange-100">
        {/* 选择注册身份页面 */}
        {pageLayout === 1 && (
          <div className="flex flex-col items-center">
            <div className="text-xl tracking-widest font-semibold my-12">
              选择注册身份
            </div>

            {/* 三种身份选择 */}
            <div className="w-3/4">
              <DataField type="radio" formConfig={formConfig} />
            </div>

            {/* 下一步 */}
            <div className="w-30 py-1 ml-220">
              <button className="btn2" onClick={() => setPageLayoutLocation(2)}>
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
                >
                  {registerFormFields.formItems.map((item) => (
                    <Form.Item
                      key={item.name}
                      label={item.label}
                      name={item.name}
                      rules={rulesParse(item.rules)}
                    >
                      <DataField
                        type={item.type}
                        formConfig={item.formConfig}
                      />
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
                    游客
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

      <style jsx global>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
