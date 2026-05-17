import { Descriptions, Input, Modal, Select } from 'antd';
import './index.less';
import { useEffect, useState } from 'react';
import { CommonForm } from '..';

// // 详情弹窗数据
// // 人员
// const dialogData = {
//   items:
//   title: `${identity[users.identity_type].identity}-${users.user_name}`,
//   width: 1000,
// };

const DialogCommon = ({
  dialogData,
  isShowDialog,
  onCancel,
  onOk,
  initialValue,
  confirmLoading,
}) => {
  // 绑定无表单需要修改数据的弹窗的内部值
  const [formValue, setFormValue] = useState(initialValue || null);

  // 每一次弹窗打开时，同步表单中选择的表单项数据最新值给弹窗
  useEffect(() => {
    let timer = null;
    if (isShowDialog) {
      // 使用定时器延迟执行setState，以免状态更新循环
      timer = setTimeout(() => {
        setFormValue(initialValue ?? null);
      }, 0);
    }

    // 清除定时器：组件卸载/依赖变化
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isShowDialog, initialValue]);

  return (
    <div>
      {/* 有表单的弹窗 */}
      {dialogData.type === 1 && (
        <Modal
          title={dialogData.title}
          open={isShowDialog}
          onCancel={onCancel}
          onOk={onOk}
          width={dialogData.width || 500}
          confirmLoading={confirmLoading}
          cancelText="取消"
          okText="提交"
          className="dialogStyle"
          onClick={(e) => e.stopPropagation()}
          maskProps={{
            onClick: (e) => e.stopPropagation(),
          }}
        >
          <div className="border border-amber-500 py-4 rounded-lg">
            <CommonForm
              formType={dialogData.data.formType}
              form={dialogData.data.form}
              maxWidth={dialogData.data.maxWidth}
              initialValues={dialogData.data.initialValues}
              formFields={dialogData.data.formFields}
            />
          </div>
        </Modal>
      )}

      {/* 无表单但需修改数据弹窗 */}
      {dialogData?.type === 2 && (
        <Modal
          title={dialogData?.data.title || ''}
          open={isShowDialog}
          onCancel={onCancel}
          confirmLoading={confirmLoading}
          onOk={() => onOk?.(formValue)} //把值暴露出去
          style={{
            width: dialogData?.width || 500,
            height: dialogData?.height || 191,
          }}
          cancelText="取消"
          okText="确认"
        >
          <div className="my-8 flex gap-2 items-center">
            <div
              className={`${dialogData?.data.label.length <= 2 ? 'w-12' : 'w-20'}`}
            >
              {dialogData?.data.label || ''} :
            </div>

            {dialogData?.data.options ? (
              <Select
                placeholder={dialogData?.data.placeholder || ''}
                showSearch={{ optionFilterProp: 'label' }}
                style={{ width: '100%' }}
                options={dialogData?.data.options || []}
                value={formValue}
                onChange={(value) => {
                  setFormValue(value);
                  // console.log('下拉框的值：', value);
                }}
                mode={dialogData?.data.mode === 2 && 'multiple'}
                allowClear={dialogData?.data.allowClear || false}
              />
            ) : (
              <Input
                placeholder={dialogData?.data.placeholder || ''}
                style={{ width: '100%' }}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
              />
            )}
          </div>
        </Modal>
      )}

      {/* 详情弹窗 */}
      {dialogData?.type === 3 && (
        <Modal
          open={isShowDialog}
          onCancel={onCancel}
          footer={<></>}
          width={dialogData.width || 1000}
          className="dialogStyle"
        >
          <Descriptions
            title={dialogData.title}
            bordered
            items={dialogData.items}
          />
        </Modal>
      )}

      {/* 确认框弹窗 */}
      {dialogData?.type === 4 && (
        <Modal
          title={dialogData.title}
          open={isShowDialog}
          onCancel={onCancel}
          onOk={onOk}
          confirmLoading={confirmLoading}
          cancelText="取消"
          okText="确认"
          style={{ maxWidth: 400 }}
        >
          <div className="py-4">{dialogData.content}</div>
        </Modal>
      )}
    </div>
  );
};

export default DialogCommon;
