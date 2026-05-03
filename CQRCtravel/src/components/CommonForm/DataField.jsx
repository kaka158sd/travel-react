import {
  ConfigProvider,
  Input,
  Tooltip,
  InputNumber,
  Radio,
  Checkbox,
  Avatar,
  Upload,
  message,
  Image,
  Switch,
  Select,
  DatePicker,
  Rate,
  Popconfirm,
  TimePicker,
} from 'antd';
import { runes } from 'runes2';
import { useState } from 'react';
import { UserOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { supabase } from '@/lib/supabase';

const { TextArea, Search } = Input;

// 定义主题色
const THEME_COLOR = '#d97706';
const LIGHT_COLOR = '#faeedd';

// 默认label样式
const labelStyleCommon = {
  height: 32,
  lineHeight: '32px',
};

// 上传框配置
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传格式为JPG/PNG的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于2MB!');
  }
  return isJpgOrPng && isLt2M;
};

// 时间选择器的format
const format = 'HH:mm';

const DataField = ({
  type,
  formConfig,
  onSearch,
  form,
  handleOpenDialogClick,
  ...rest
}) => {
  // 单选框群、多选框、下拉菜单/选择器的options由传递的参数中的选项遍历而来
  let options = [];
  if (['radio', 'checkbox'].includes(type)) {
    options =
      formConfig.optionsItem?.map((item) => ({
        value: item.value,
        style: formConfig.labelStyle ? formConfig.labelStyle : undefined,
        label: item.label,
      })) || []; // 加 ?. 和 || [] 双重保险
  }

  // 单选框中点击“其他”显示输入框，selectedValue - 控制输入框的显隐
  const [selectedValue, setSelectedValue] = useState();

  // 拿到单选框中的输入框的值
  const [otherInput, setOtherInput] = useState('');

  // 处理单选框变化
  const handleRadioChange = (e) => {
    const val = e.target.value;
    setSelectedValue(val);
    rest.onChange?.(val); // 不覆盖表单默认onChange

    // 统一使用 options 变量，而不是直接访问 formConfig
    const otherValue = (options?.length || 0) + 1;

    // 切换到非「其他」选项时，清空输入框并同步到表单
    if (val !== otherValue) {
      setOtherInput('');
      // 非「其他」选项，同步单选框值到表单
      form?.setFieldValue(rest.name, val);
    } else {
      // 切换到「其他」选项时，把输入框的值同步到表单
      form?.setFieldValue(rest.name, otherInput);
    }
  };

  // 处理单选框「其他」输入框变化
  const handleOtherInputChange = (e) => {
    const val = e.target.value;
    setOtherInput(val);
    // 同步输入框的值到表单，和单选框使用同一个name
    form.setFieldValue(rest.name, val);
  };

  // 上传图片
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
    </button>
  );

  if (!formConfig) return null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Upload: {
            colorPrimary: THEME_COLOR,
            colorPrimaryHover: THEME_COLOR,
            colorPrimaryBorder: LIGHT_COLOR,
            pictureCardSize: formConfig.width || 200,
          },
        },
      }}
    >
      {/* 所有页面组件 */}
      <div>
        {/* 文字输入框-有无图标，是否禁用，有无初始提示文字，有无字数限制,是否带可清除内容图标 */}
        {type === 'textInput' && (
          <Input
            {...rest}
            placeholder={formConfig.placeholder || ''}
            prefix={
              formConfig.prefix ? (
                <i className={`iconfont ${formConfig.prefix}`} />
              ) : undefined
            }
            suffix={
              formConfig.suffix ? (
                <Tooltip title={formConfig.suffix.title}>
                  <i className={`iconfont ${formConfig.suffix.icon}`} />
                </Tooltip>
              ) : undefined
            }
            allowClear={formConfig.isAllowClear || false}
            disabled={formConfig.isDisabled || false}
            count={
              formConfig.count
                ? {
                    show: true,
                    min: formConfig.count.min || 0,
                    max: formConfig.count.max || 20,
                    strategy: (txt) => runes(txt).length,
                    exceedFormatter: (txt, { max }) =>
                      runes(txt).slice(0, max).join(''),
                  }
                : undefined
            }
            style={{ width: formConfig.width || 400 }}
          />
        )}

        {/* 文本域 */}
        {type === 'textArea' && (
          <TextArea
            {...rest}
            rows={4}
            style={{ width: formConfig.width || 400 }}
            placeholder={formConfig.placeholder || ''}
            count={
              formConfig.maxCount
                ? {
                    show: true,
                    max: formConfig.maxCount || 100,
                    strategy: (txt) => runes(txt).length,
                    exceedFormatter: (txt, { max }) =>
                      runes(txt).slice(0, max).join(''),
                  }
                : undefined
            }
          />
        )}

        {/* 密码框 */}
        {type === 'password' && (
          <Input.Password
            {...rest}
            placeholder={formConfig.placeholder || ''}
            disabled={formConfig.isDisabled || false}
            prefix={
              formConfig.prefix ? (
                <i className={`iconfont ${formConfig.prefix}`} />
              ) : undefined
            }
            style={{ width: formConfig.width || 400 }}
          />
        )}

        {/* 搜索框 */}
        {type === 'search' && (
          <Search
            {...rest}
            size={formConfig.size || 'medium'}
            placeholder={formConfig.placeholder || ''}
            allowClear
            style={{ width: formConfig.width || 400 }}
          />
        )}

        {/* 数字输入框 */}
        {type === 'number' && (
          <InputNumber
            {...rest}
            controls={formConfig.controls || true} //是否显示增减按钮
            min={formConfig.min || 0}
            max={formConfig.max || undefined}
            defaultValue={formConfig.defaultValue || null}
            disabled={formConfig.isDisabled || false}
            prefix={formConfig.prefix || undefined}
            suffix={formConfig.suffix || undefined}
            style={{ width: formConfig.width || 400 }}
            placeholder={formConfig.placeholder || ''}
          />
        )}

        {/* 单选框 */}
        {type === 'radio' && (
          <Radio.Group
            {...rest}
            name={formConfig.name || undefined}
            vertical={formConfig.isVertical || false}
            value={selectedValue}
            onChange={handleRadioChange}
            options={[
              ...options,
              ...(formConfig.input
                ? [
                    {
                      value: options?.length + 1,
                      style: formConfig.labelStyle || labelStyleCommon,
                      label: (
                        <>
                          其他
                          {selectedValue === (options?.length || 0) + 1 && (
                            <Input
                              variant="filled"
                              placeholder="请输入"
                              value={otherInput}
                              onChange={handleOtherInputChange}
                              style={{
                                width: formConfig.input.inputWidth || 200,
                                marginInlineStart: 12,
                              }}
                            />
                          )}
                        </>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        )}

        {/* 多选框 */}
        {type === 'checkbox' && <Checkbox.Group {...rest} options={options} />}

        {/* 头像框 */}
        {type === 'avatar' && (
          <Avatar
            {...rest}
            src={formConfig.src || undefined}
            size={formConfig.size || 64}
            icon={<UserOutlined />}
          />
        )}

        {/* 上传框-上传头像还是封面 */}
        {type === 'upload' && (
          <Upload
            {...rest}
            name={formConfig.name}
            listType={
              formConfig.listType === 1 ? 'picture-card' : 'picture-circle'
            }
            fileList={
              form?.getFieldValue(formConfig.name)
                ? [
                    {
                      uid: '-1',
                      name: 'image.png',
                      status: 'done',
                      url: form?.getFieldValue(formConfig.name),
                    },
                  ]
                : []
            }
            className="avatar-uploader"
            showUploadList={false}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                setLoading(true);

                // 1. 生成唯一文件名，避免重名覆盖
                const fileName = `${Date.now()}_${file.name}`;
                const bucketName = 'tour-images'; // 替换为你的 bucket 名称
                const uploadPath = `images/${fileName}`;

                // console.log('开始上传到路径：', uploadPath);
                // console.log('Bucket 名称：', bucketName);

                // 2. 上传到 Supabase Storage
                const { data, error } = await supabase.storage
                  .from(bucketName)
                  .upload(uploadPath, file);

                // console.log('上传返回：', { data, error });

                if (error) throw error;

                // 3. 获取公开访问 URL
                const { data: urlData } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(uploadPath);

                const publicUrl = urlData.publicUrl;
                // console.log('生成的 URL：', publicUrl);

                // 4. 更新预览图 & 通知组件上传成功
                setImageUrl(publicUrl);
                form.setFieldsValue({ [formConfig.name]: publicUrl });

                // 通知 antd 上传完成
                onSuccess(publicUrl);
              } catch (err) {
                console.error('上传失败详情：', err);
                message.error('图片上传失败，请重试' + err.message);
                onError(err);
              } finally {
                setLoading(false);
              }
            }}
            beforeUpload={beforeUpload}
          >
            {form?.getFieldValue(formConfig.name) ? (
              <img
                draggable={false}
                src={form?.getFieldValue(formConfig.name)}
                style={{ width: '100%', objectFit: 'cover', height: '100%' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        )}

        {/* 图片（点击可放大查看） */}
        {type === 'image' && (
          <Image
            {...rest}
            src={formConfig.src || 'error'}
            width={formConfig.width || 200}
            height={formConfig.height || 200}
            fallback="data:image/png;base64,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"
          />
        )}

        {/* 开关 */}
        {type === 'switch' && (
          <Switch
            {...rest}
            defaultChecked
            disabled={formConfig.isDisabled || false}
          />
        )}

        {/* 下拉框 / 选择器 */}
        {type === 'select' && (
          <Select
            {...rest}
            mode={formConfig.mode === 2 ? 'multiple' : undefined}
            allowClear={
              (formConfig.isAllowClear && formConfig.mode === 2) || false
            }
            placeholder={formConfig.placeholder || ''}
            showSearch={
              formConfig.isShowSearch
                ? { optionFilterProp: 'label', onSearch }
                : undefined
            }
            style={{ width: formConfig.width || 400 }}
            options={formConfig.options}
          />
        )}

        {/* 时间选择器 */}
        {type === 'date' && (
          <DatePicker
            {...rest}
            placeholder="选择日期"
            style={{ width: formConfig.width || 400 }}
            locale={zhCN.DatePicker}
          />
        )}

        {/* 评分 */}
        {type === 'rate' && <Rate {...rest} allowHalf />}

        {/* 弹窗框(填写和修改都需要弹窗) */}
        {type === 'dialog' && (
          <div
            className="input-style flex justify-between relative cursor-default"
            {...rest}
          >
            {/* 拿到值后渲染页面 */}
            <p className={`${rest.value ? 'text-black' : ''}`}>
              {rest.value ? rest.value : `请选择你的${formConfig.labelText}`}
            </p>

            {/* 当第一次点击按钮时直接打开弹窗，之后都需要经过气泡确认框才能打开弹窗 */}
            {rest.value ? (
              <Popconfirm
                title="确认要修改吗？"
                description={`请慎重选择是否要修改你的${formConfig.labelText}！`}
                onConfirm={handleOpenDialogClick}
                okText="是"
                cancelText="否"
              >
                <i className="iconfont icon-chuangzuo absolute top-0.5 right-3 cursor-pointer hover:text-[#d97706]" />
              </Popconfirm>
            ) : (
              <i
                onClick={handleOpenDialogClick}
                className="iconfont icon-chuangzuo text-color1 hover:scale-110 absolute top-0.5 right-3 cursor-pointer"
              />
            )}
          </div>
        )}

        {/* 时间选择器-单个 */}
        {type === 'timePicker' && (
          <TimePicker
            allowClear={formConfig.isAllowClear || false}
            format={format}
            placeholder={formConfig.placeholder || ''}
            style={{ width: formConfig.width || 200 }}
          />
        )}

        {/* 时间选择器-连着两个 */}
        {/* {type === 'rangePicker' && (
          <TimePicker.RangePicker
            allowClear={formConfig.isAllowClear || false}
            format={format}
            placeholder={formConfig.placeholder || ''}
          />
        )} */}
      </div>
    </ConfigProvider>
  );
};

export default DataField;
