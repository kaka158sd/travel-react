import { Table, Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { SearchOutlined, FormOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { DialogCommon } from '@/components';
import { getDetailActivityItems } from '@/utils';
import { useAddActivityForm } from '@/hook';

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

const ActivityManage = ({
  adminNav,
  activities,
  scenicSpotsOptions,
  intangibleHeritageOptions,
}) => {
  // 处理活动数据，table中的每条数据都要加上key
  const activitiesData = activities
    .map((item) => {
      return {
        ...item,
        key: item.activity_id,
        start_time: dayjs(item.start_time).format('YYYY-MM-DD'),
        end_time: dayjs(item.end_time).format('YYYY-MM-DD'),
      };
    })
    .reverse();

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1); //1：详情；2：新增；3：编辑
  const [dialogItem, setDialogItem] = useState({});

  // 新增弹窗单独打开
  const [isShowAddDialog, setIsShowAddDialog] = useState(false);

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
        <div>
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
            <Button shape="circle" danger ghost icon={<CloseOutlined />} />
          </Tooltip>
        </div>
      ),
    },
  ];

  // 监听弹窗打开，自动赋值
  useEffect(() => {
    if (!isShowDialog) return;

    // 打开的是编辑，赋值当前数据
    if (dialogType === 3 && dialogItem) editForm.setFieldsValue(dialogItem);
  }, [isShowDialog, dialogType, dialogItem, editForm]);

  // 活动详情和编辑弹窗点击事件
  const handleOpenDialog = (id, type) => {
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

  return (
    <div>
      {adminNav === 'activity' && (
        <div>
          <div className="text-xl font-semibold">活动管理</div>

          <div className="flex justify-between py-4">
            {/* 搜索框和筛选框 */}
            <div></div>

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
            <Table columns={activityColumns} dataSource={activitiesData} />
          </div>

          {/* 弹窗：详情和编辑 */}
          <DialogCommon
            isShowDialog={isShowDialog}
            onCancel={() => {
              setIsShowDialog(false);
              editForm.resetFields();
              setDialogItem({});
            }}
            onOk={() => setIsShowDialog(false)}
            dialogData={dialogData}
          />
          {/* 弹窗：新增 */}
          <DialogCommon
            isShowDialog={isShowAddDialog}
            onCancel={() => {
              setIsShowAddDialog(false);
              addForm.resetFields();
            }}
            onOk={() => setIsShowAddDialog(false)}
            dialogData={addDialogData}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityManage;
