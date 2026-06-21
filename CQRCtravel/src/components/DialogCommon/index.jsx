import { Descriptions, Input, Modal, Select } from 'antd';
import './index.less';
import { useEffect, useState } from 'react';
import { CommonForm, NoData, SearchAndFilter } from '..';
import dayjs from 'dayjs';
import { usePageList } from '@/hook';

const { TextArea } = Input;

const DialogCommon = ({
  dialogData,
  isShowDialog,
  onCancel,
  onOk,
  initialValue,
  confirmLoading,
  closable,
}) => {
  // 绑定无表单需要修改数据的弹窗的内部值
  const [formValue, setFormValue] = useState(initialValue || null);
  const [selectedValues, setSelectedValues] = useState([]);

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

  // 搜索和筛选获取
  const { changeFilter, currentData } = usePageList(
    dialogData.dataList || [],
    1000,
    [''],
  );

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    setSelectedValues(value);
    changeFilter('flow_type', value);
  };
  // 筛选列表
  const options = [
    { value: 0, label: '充值' },
    { value: 1, label: '支付' },
    { value: 2, label: '退款' },
  ];
  // 搜索和筛选配置
  const fieldConfig = {
    select: {
      width: 200,
      optionsItem: options,
      placeholder: '选择收支类型...',
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
  };

  return (
    <div>
      {/* 有表单的弹窗 */}
      {dialogData?.type === 1 && (
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
          closable={closable ? false : true}
        >
          {dialogData.dataList ? (
            <div className="min-h-40">
              {dialogData.dataList.length > 0 ? (
                <div className="max-h-120 overflow-auto table-scroll-wrap">
                  {/* 搜索和筛选框 */}
                  <div className="mt-4">
                    <SearchAndFilter fieldConfig={fieldConfig} />
                  </div>

                  <div className="flex pl-3 py-2 mt-4">
                    <div>订单编号</div>
                    <div className="ml-3.75">收支类型</div>
                    <div className="ml-11">变动金额</div>
                    <div className="ml-7">资金状态</div>
                    <div className="ml-19">创建时间</div>
                  </div>
                  <ul>
                    {[...currentData]
                      .sort((a, b) => {
                        const t1 = a.create_time
                          ? new Date(a.create_time).getTime()
                          : 0;
                        const t2 = b.create_time
                          ? new Date(b.create_time).getTime()
                          : 0;
                        return t2 - t1;
                      })
                      .map((item) => (
                        <li key={item.flow_id}>
                          <div className="flex gap-6 pl-8 py-2">
                            <div className="w-10">
                              {item.order_id ? item.order_id : '-'}
                            </div>
                            <div className="w-10">
                              {item.flow_type === 0
                                ? '充值'
                                : item.flow_type === 1
                                  ? '支付'
                                  : '退款'}
                            </div>
                            <div className="w-20 text-right mr-4">
                              {item.amount.toFixed(2)}/元
                            </div>
                            <div
                              className={`w-16 ${item.status === 1 && 'text-blue-400'}`}
                            >
                              {item.status === 0 ? '正常' : '审核中'}
                            </div>
                            <div>
                              {dayjs(item.create_time).format(
                                'YYYY-MM-DD HH:mm:ss',
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <NoData width={'pt-11'} image={true} />
              )}
            </div>
          ) : (
            <Descriptions
              title={dialogData.title}
              bordered
              items={dialogData.items}
              column={dialogData.column || 3}
            />
          )}
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
          {dialogData.inputConfig && (
            <div className="mb-6">
              <TextArea
                placeholder={dialogData.inputConfig.placeholder}
                value={dialogData.inputConfig.value}
                onChange={(e) => {
                  dialogData.inputConfig.onChange?.(e.target.value);
                }}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DialogCommon;
