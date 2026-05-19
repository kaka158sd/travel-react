import { Table, Button, Tooltip, message } from 'antd';
import { SearchOutlined, FormOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { DialogCommon, SearchAndFilter } from '@/components';
import { deepEqual, getDetailActivityItems, isTimeBeforeToday } from '@/utils';
import { useAddActivityForm, usePageList } from '@/hook';
import { useOutletContext } from 'react-router-dom';
import {
  deleteActivityAPI,
  postActivityAPI,
  updateActivityAPI,
} from '@/apis/activities';
import { getScenicSpotDetailAPI } from '@/apis/scenic_spots';
import { getIntangibleHeritageDetailAPI } from '@/apis/intangible_heritage';
import moment from 'moment';

// 活动数据
const addActivity = {
  // activity_id: 1,
  // activity_name: '万灵古镇汉服巡游',
  // activity_desc:
  //   '本次汉服巡游活动将带领游客身着传统汉服漫步千年古镇，沉浸式感受明清古风韵味，沿途欣赏古桥、流水、老街，参与古风互动、打卡拍照、民俗体验，让游客在历史场景中穿越古今，深度体验荣昌传统文化魅力。',
  // notice: null,
  // relate_type: 1,
  // relate_id: 1,
  // relate_name: '万灵古镇',
  // start_time: '2025-04-25T10:00:00+00:00',
  // end_time: '2025-04-30T16:00:00+00:00',
  // address: '万灵古镇',
  // sponsor: '荣昌文旅委',
  // created_time: '2026-04-20T15:19:30.539685+00:00',
};

const ActivityManage = () => {
  const {
    activities = [],
    activitiesData = [],
    scenicSpotsOptions = [],
    intangibleHeritageOptions = [],
    refreshActivities,
  } = useOutletContext() || {};
  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1); //1：详情；2：新增；3：编辑
  const [dialogItem, setDialogItem] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  // 新增弹窗单独打开
  const [isShowAddDialog, setIsShowAddDialog] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [inputValue, setInputValue] = useState('');
  // 多选值状态
  const [selectedValues, setSelectedValues] = useState([]);

  // 活动新增弹窗的表单
  const { form: addForm, formFields: addFormFields } = useAddActivityForm({
    addActivity,
    scenicSpotsOptions,
    intangibleHeritageOptions,
  });
  // 活动编辑弹窗的表单
  const { form: editForm, formFields: editFormFields } = useAddActivityForm({
    addActivity,
    scenicSpotsOptions,
    intangibleHeritageOptions,
  });

  // 活动表格的栏
  const activityColumns = [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      key: 'activity_name',
      render: (text) => <div className="text-blue-500">{text}</div>,
    },
    {
      title: '关联名称',
      dataIndex: 'relate_name',
      key: 'relate_name',
    },
    {
      title: '活动时间',
      dataIndex: '',
      key: 'activity_time',
      render: (_, record) => (
        <div
          className={
            isTimeBeforeToday(record.end_time) ? 'text-red-400' : 'text-black'
          }
        >
          {record.start_time} - {record.end_time}
        </div>
      ),
    },
    {
      title: '主办方',
      dataIndex: 'sponsor',
      key: 'sponsor',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-4">
          <Tooltip title="查看详情">
            <Button
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => handleOpenDialog(record.activity_id, 'detail')}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="primary"
              shape="circle"
              icon={<FormOutlined />}
              onClick={() => handleOpenDialog(record.activity_id, 'edit')}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              shape="circle"
              danger
              ghost
              icon={<CloseOutlined />}
              onClick={() => handleDeleteActivity(record.activity_id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // 监听弹窗打开，自动赋值
  useEffect(() => {
    if (!isShowDialog) return;

    // 打开的是编辑，赋值当前数据
    if (dialogType === 3 && dialogItem)
      editForm.setFieldsValue({
        ...dialogItem,
        start_time: moment.isMoment(dialogItem.start_time)
          ? dialogItem.start_time
          : moment(dialogItem.start_time),
        end_time: moment.isMoment(dialogItem.end_time)
          ? dialogItem.end_time
          : moment(dialogItem.end_time),
      });
  }, [isShowDialog, dialogType, dialogItem, editForm]);

  // 活动详情和编辑弹窗点击事件
  const handleOpenDialog = async (id, type) => {
    editForm.resetFields();
    // 获取id对应的活动数据
    const item = activities.find((item) => item.activity_id === id);

    setDialogType(type === 'detail' ? 1 : 3);

    setDialogItem(item);
    setIsShowDialog(true);
  };

  // 弹窗需要传递的参数
  const dialogData = useMemo(() => {
    // 详情弹窗
    if (dialogType === 1) {
      // 先判断当前的item是否有值
      if (!dialogItem?.activity_name) {
        return {
          type: 3,
          items: [],
          title: '',
        };
      }

      // 获取活动的items
      const items = getDetailActivityItems(dialogItem);
      return {
        type: 3,
        title: `活动-${dialogItem.activity_name}`,
        items,
      };
    }

    // 编辑弹窗
    if (dialogType === 3) {
      return {
        type: 1,
        title: '编辑活动',
        data: {
          formType: 'add',
          form: editForm,
          initialValues: dialogItem,
          formFields: editFormFields || [],
        },
        width: 1200,
      };
    }

    // 其他情况也给一个默认值，避免为空
    return {
      type: 3,
      items: [],
      title: '',
    };
  }, [dialogType, dialogItem, editForm, editFormFields]);

  // 新增弹窗的传参
  const addDialogData = {
    type: 1,
    title: '新增活动',
    data: {
      formType: 'add',
      form: addForm,
      initialValues: {},
      formFields: addFormFields || [],
    },
    width: 1200,
  };

  // 转换函数
  function formatToUTC(dateVal) {
    if (!dateVal) return '';

    let d;
    // 1. 判断 Dayjs
    if (dateVal?.$isDayjsObject) {
      d = dateVal.toDate();
    }
    // 2. 判断 Moment
    else if (typeof dateVal === 'object' && dateVal?._isAMomentObject) {
      d = dateVal.toDate();
    }
    // 3. 字符串 / Date
    else {
      d = new Date(dateVal);
    }

    // 无效日期直接返回空
    if (isNaN(d.getTime())) return '';

    // 取UTC年月日时分秒
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const h = String(d.getUTCHours()).padStart(2, '0');
    const mi = String(d.getUTCMinutes()).padStart(2, '0');
    const s = String(d.getUTCSeconds()).padStart(2, '0');

    return `${y}-${m}-${day}T${h}:${mi}:${s}+00:00`;
  }

  // 处理新增/编辑活动弹窗提交事件
  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      const values =
        dialogType === 2
          ? await addForm.validateFields()
          : await editForm.validateFields();
      const { start_time, end_time, activity_name, relate_name, relate_type } =
        values;
      // console.log('values', values);

      // 结束时间不能早于开始时间
      const isEndBeforeStart = new Date(end_time) < new Date(start_time);
      if (isEndBeforeStart) {
        messageApi.error('活动结束时间不得早于开始时间，请修改！');
        return;
      }

      // 新增活动接口请求
      if (dialogType === 2) {
        // 获取相关业务名称
        let relatedName;
        if (relate_type === 1) {
          const res = await getScenicSpotDetailAPI(relate_name);
          relatedName = res.data[0].spot_name;
        } else if (relate_type === 2) {
          const res = await getIntangibleHeritageDetailAPI(relate_name);
          relatedName = res.data[0].heritage_name;
        }
        console.log('业务名称：', relatedName);

        // 处理的表单数据
        const processValues = {
          ...values,
          start_time: start_time.format('YYYY-MM-DDTHH:mm:ssZ'),
          end_time: end_time.format('YYYY-MM-DDTHH:mm:ssZ'),
          relate_id: Number(relate_name),
          relate_name: relatedName,
        };
        console.log('表单数据：', processValues);

        // 活动名称不能重复
        const isExistName = activities.some(
          (item) => item.activity_name === activity_name,
        );
        if (isExistName) {
          messageApi.error('该活动名称与已有活动名称重复，请修改！');
          return;
        }

        try {
          await postActivityAPI(processValues);
          // 刷新活动
          await refreshActivities();
          messageApi.success('新增活动成功！');
        } catch (error) {
          console.error('新增活动失败！', error);
        } finally {
          setIsShowAddDialog(false);
        }
      }
      // 编辑活动
      else if (dialogType === 3) {
        // 获取相关业务id
        const relatedItem = (
          relate_type === 1 ? scenicSpotsOptions : intangibleHeritageOptions
        ).find((item) => item.label === relate_name);

        // 处理表单数据
        const processData = {
          ...values,
          start_time: formatToUTC(start_time),
          end_time: formatToUTC(end_time),
          relate_id: relatedItem.value,
        };
        // console.log('处理数据processData：', processData);
        // console.log('处理数据relatedItem：', relatedItem);
        // console.log('原来的数据dialogItem：', dialogItem);

        try {
          // 处理的原数据
          const {
            activity_id,
            created_time: _created_time,
            ...dialogProcessData
          } = dialogItem;
          // console.log('处理数据dialogProcessData：', dialogProcessData);
          // 判断数据是否改变
          const isSame = deepEqual(processData, dialogProcessData);
          // console.log('数据是否改变', isSame);

          if (isSame) {
            messageApi.info('未发现修改内容，请修改后再提交！');
            return;
          }

          await updateActivityAPI(activity_id, processData);
          await refreshActivities();

          messageApi.success('编辑活动成功！');
        } catch (error) {
          console.error('编辑活动失败！', error);
        } finally {
          setIsShowDialog(false);
        }
      } else {
        messageApi.error('当前弹窗类型错误，请重试！');
      }
    } catch (error) {
      console.error('操作活动失败！', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 处理删除活动
  const handleDeleteActivity = async (id) => {
    try {
      if (!id) {
        messageApi.error(`删除失败！请重试尝试删除id为 ${id} 的活动`);
        return;
      }

      const confirm = window.confirm('是否要删除该活动，请慎重考虑！');

      if (confirm) {
        await deleteActivityAPI(id);
        await refreshActivities();
        messageApi.success('删除成功！');
      }
    } catch (error) {
      console.error('删除活动请求失败！', error);
    }
  };

  // 搜索和筛选
  const {
    currentPage,
    total,
    currentData,
    changeFilter,
    setSearchText,
    setCurrentPage,
  } = usePageList(activitiesData, 10, ['activity_name']);

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    // console.log('当前选中的值：', value);
    setSelectedValues(value);
    changeFilter('relate_name', value); // 筛选 type 字段
  };

  // 处理关联名称数据
  const options = [
    ...[...scenicSpotsOptions].map((item) => ({
      value: item.label,
      label: item.label,
    })),
    ...[...intangibleHeritageOptions].map((item) => ({
      value: item.label,
      label: item.label,
    })),
  ];

  // 下拉菜单 / 搜索框配置
  const activityConfig = {
    select: {
      width: 360,
      optionsItem: options,
      placeholder: '选择活动关联名称...',
      showSearch: true,
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
    search: {
      placeholder: '搜索活动名称...',
      width: 360,
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  return (
    <div>
      <div className="text-xl font-semibold">活动管理</div>
      {contextHolder}
      <div className="flex justify-between py-4">
        {/* 搜索框和筛选框 */}
        <div>
          <SearchAndFilter fieldConfig={activityConfig} />
        </div>

        <div className="w-22">
          <button
            className="btn2"
            onClick={() => {
              addForm.resetFields();
              setDialogType(2);
              setIsShowAddDialog(true);
            }}
          >
            新增
          </button>
        </div>
      </div>

      {/* 活动列表 */}
      <div className="mr-4">
        <Table
          columns={activityColumns}
          dataSource={currentData.sort((a, b) => b.activity_id - a.activity_id)}
          pagination={{
            pageSize: 10,
            // showSizeChanger: true, // 显示下拉框，允许用户切换每页数量
            // pageSizeOptions: ['10', '20', '30', '50'], // 可选的每页条数
            showTotal: (total) => `共 ${total} 条`,
            current: currentPage,
            total: total,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>

      {/* 弹窗：详情和编辑 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsShowDialog(false);
          editForm.resetFields();
          setDialogItem({});
        }}
        onOk={handleConfirm}
        dialogData={dialogData}
      />
      {/* 弹窗：新增 */}
      <DialogCommon
        isShowDialog={isShowAddDialog}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsShowAddDialog(false);
          addForm.resetFields();
        }}
        onOk={handleConfirm}
        dialogData={addDialogData}
      />
    </div>
  );
};

export default ActivityManage;
