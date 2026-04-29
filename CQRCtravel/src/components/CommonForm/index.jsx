import { ConfigProvider, Form } from 'antd';
import DataField from './DataField';
import { rulesParse } from '@/utils';

// 定义主题色
const THEME_COLOR = '#d97706';
const LIGHT_COLOR = '#faeedd';

// 表单配置
const formFields = {
  formMaxWidth: 400,
  size: 'small',
  label: '输入框',
  name: 'name',
  rules: 'date', //示例"required string"；日期中包含必填，无需required
};

// 表单项的类型（文字输入框：textInput(手机号设置单独的rules，实现表单项与校验规则分离）；文本域：textArea;
// 密码框：password;搜索框：search;数字输入框：number;单选框：radio；多选框：checkbox ；头像：avatar；上传：upload；
// 图片：image，开关：switch；下拉菜单/选择器：select,时间选择器：date；评分：rate）
// const type = 'rate';
const type = 'date';

// 时间选择器配置
const formConfig = {
  width: 400,
};

const CommonForm = () => {
  const [form] = Form.useForm();

  // 搜索回调
  const onSearch = () => {
    console.log('搜索');
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            colorPrimary: THEME_COLOR,
            controlOutline: LIGHT_COLOR,
          },
        },
      }}
    >
      <div>
        <Form
          form={form}
          style={{ maxWidth: formFields.formMaxWidth || 600 }}
          size={formFields.size || 'small'}
        >
          <Form.Item
            label={formFields.label}
            rules={rulesParse(formFields.rules)}
            name={formFields.name}
          >
            {/* 当type为radio且需要其他输入框时，需要传递form(form={form})给子组件，以便获取输入框的值 */}
            <DataField
              formConfig={formConfig}
              type={type}
              onSearch={onSearch}
            />
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default CommonForm;

// // 文字输入框的配置
// const formConfig = {
//   width: 400,
//   placeholder: '输入',
//   prefix: 'icon-user1',
//   suffix: {
//     title: '请注意！',
//     icon: 'icon-tishifill',
//   },
//   isAllowClear: true,
//   isDisabled: false,
//   maxCount: 10,
// };

// // 文本域配置
// const formConfig = {
//   width: 400,
//   placeholder: '输入',
//   maxCount: 100,
// };

// // 密码框配置
// const formConfig = {
//   width: 400,
//   placeholder: '输入',
//   isDisabled: false,
//   prefix: 'icon-user1',
// };

// //搜索框配置
// const formConfig = {
//   size:'medium'
//   placeholder: '输入',
//   width: 200,
// };

// // 数字框配置
// const formConfig = {
//   width: 400,
//   controls: false,
//   min: 1,
//   max: 100,
//   defaultValue: 1,
//   isDisabled: false,
//   prefix: '￥',
// };

// // 单选框配置
// const formConfig = {
//   name: 'radio-one',
//   value: 5, //value为0时不选中（optionsItem从1开始）
//   isVertical: false,
//   optionsItem: [
//     {
//       value: 1,
//       label: '选项1',
//     },
//     {
//       value: 2,
//       label: '选项2',
//     },
//     {
//       value: 3,
//       label: '选项3',
//     },
//     {
//       value: 4,
//       label: '选项4',
//     },
//   ],
//   labelStyle: {
//     height: 32,
//     lineHeight: '32px',
//   },
//   input: {
//     inputWidth: 200,
//   },
// };

// // 多选框配置
// const formConfig = {
//   optionsItem: [
//     {
//       value: 1,
//       label: '选项1',
//     },
//     {
//       value: 2,
//       label: '选项2',
//     },
//     {
//       value: 3,
//       label: '选项3',
//     },
//     {
//       value: 4,
//       label: '选项4',
//     },
//   ],
// };

// // 头像配置
// const formConfig = {
//   src: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.oOPHFOk3fzW5T8gCnaAeDAAAAA?w=203&h=204&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   size: 100,
// };

// // 上传框配置
// const formConfig = {
//   name: 'avatar',
//   listType: 2, //1:picture-card(卡片封面),2:picture-circle(圆圈头像)
//   action: '',
//   width: 200,
// };

// // 图片配置
// const formConfig = {
//   src: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.oOPHFOk3fzW5T8gCnaAeDAAAAA?w=203&h=204&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   width: 200,
//   height: 200,
// };

// // 开关配置
// const formConfig = {
//   isDisabled: false,
// };

// // 下拉菜单 / 选择器配置
// const formConfig = {
//   width: 200,
//   optionsItem: [
//     {
//       value: 1,
//       label: '选项1',
//     },
//     {
//       value: 2,
//       label: '选项2',
//     },
//     {
//       value: 3,
//       label: '选项3',
//     },
//     {
//       value: 4,
//       label: '选项4',
//     },
//   ],
//   placeholder: '选择',
//   isAllowClear: true,
//   isShowSearch: true,
//   mode: 1, //1:单选；2:多选
// };

// // 时间选择器配置
// const formConfig = {
//   width: 400,
// };

// // 搜索回调
// const onSearch = () => {
//   console.log('搜索');
// };

// // 值改变回调
// const onChange = () => {
//   console.log('改变');
// };
