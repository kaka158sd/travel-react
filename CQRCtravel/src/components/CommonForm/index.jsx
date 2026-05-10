import { Form, message } from 'antd';
import { rulesParse } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { DialogCommon, DataField } from '@/components';
// 表单类型：预约- reservation ，个人信息- user ，修改- edit ，新增- add

const CommonForm = ({
  formType,
  form,
  maxWidth,
  initialValues = {},
  formFields,
}) => {
  // 控制弹窗的开关
  const [isShowDialog, setIsShowDialog] = useState(false);
  // 存储【当前激活的表单项】,以控制打开的弹窗
  const [activeDialogField, setActiveDialogField] = useState(null);

  // 通过 message.useMessage 创建支持读取 context 的 contextHolder
  const [messageApi, contextHolder] = message.useMessage();
  // 倒计时秒数
  const [countDown, setCountDown] = useState(0);
  const timerRef = useRef(null);
  // 是否正在倒计时
  const isRunning = countDown > 0;

  // 验证码按钮点击事件：点击之后变成60s倒计时，并弹窗发送验证码成功消息
  const handleButtonClick = () => {
    messageApi.open({
      type: 'success',
      content: '验证码发送成功！',
    });

    // 防止重复点击
    if (isRunning) return;

    // 初始60s
    setCountDown(60);
  };
  useEffect(() => {
    // 没秒数就不执行
    if (countDown <= 0) return;

    timerRef.current = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          // 倒计时结束，清除定时器
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清除定时器：组件卸载/依赖变化
    return () => {
      clearInterval(timerRef.current);
    };
  }, [countDown]);

  return (
    <div>
      <div className={`${formType === 'edit' ? 'relative w-100' : ''}`}>
        <Form
          form={form}
          style={{ maxWidth: maxWidth || 600 }}
          size="medium"
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={formType === 'add' && { span: 18 }}
          initialValues={initialValues || {}}
        >
          {formType === 'add' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: 140,
              }}
            >
              {/* 左列：先排完所有左边的字段 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {formFields
                  .filter((item) => item.column === 'left')
                  .filter(Boolean)
                  .map((item) => (
                    <Form.Item
                      key={item.name}
                      label={item.label}
                      rules={rulesParse(item.rules)}
                      name={item.name}
                    >
                      <DataField
                        formConfig={item.formConfig}
                        type={item.type}
                        value={form.getFieldValue(item.name)}
                        onChange={(val) =>
                          form.setFieldsValue({ [item.name]: val })
                        }
                      />
                    </Form.Item>
                  ))}
              </div>

              {/* 右列：再排完所有右边的字段 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {formFields
                  .filter((item) => item.column === 'right')
                  .filter(Boolean)
                  .map((item) => (
                    <Form.Item
                      key={item.name}
                      label={item.label}
                      rules={rulesParse(item.rules)}
                      name={item.name}
                    >
                      <DataField
                        formConfig={item.formConfig}
                        type={item.type}
                        value={form.getFieldValue(item.name)}
                        onChange={(val) =>
                          form.setFieldsValue({ [item.name]: val })
                        }
                      />
                    </Form.Item>
                  ))}
              </div>
            </div>
          ) : (
            formFields?.filter(Boolean)?.map((item) => (
              <Form.Item
                key={item.name}
                label={item.label}
                rules={rulesParse(item.rules)}
                name={item.name}
              >
                <DataField
                  formConfig={item.formConfig}
                  type={item.type}
                  value={form.getFieldValue(item.name)}
                  onChange={(val) => form.setFieldsValue({ [item.name]: val })}
                  handleOpenDialogClick={
                    formType === 'user'
                      ? () => {
                          if (item.userDialogData) {
                            setActiveDialogField(item);
                            setIsShowDialog(true);
                          }
                        }
                      : () => {}
                  }
                />
              </Form.Item>
            ))
          )}
        </Form>

        {/* 个人信息表单中的弹窗*/}
        <DialogCommon
          isShowDialog={isShowDialog}
          onCancel={() => {
            setIsShowDialog(false);
            setActiveDialogField(null);
          }}
          dialogData={activeDialogField?.userDialogData || {}}
          onOk={(value) => {
            // 确认时将值同步给表单,form存在时才传
            if (form && activeDialogField?.name)
              form.setFieldValue(activeDialogField.name, value);
            setIsShowDialog(false);
            setActiveDialogField(null);
          }}
          // 传入表单当前值作为弹窗的初始值
          initialValue={
            form && activeDialogField?.name
              ? form.getFieldValue(activeDialogField?.name) || null
              : null
          }
        />

        {contextHolder}
        {formType === 'edit' && Object.hasOwn(initialValues, 'code') && (
          <button
            className="btn3 absolute top-28 right-6"
            onClick={handleButtonClick}
            disabled={isRunning}
            style={{ cursor: ` ${isRunning ? 'not-allowed' : ''}` }}
          >
            {isRunning ? `${countDown}s后重新获取` : '获取验证码'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommonForm;
