import { getAdminsAPI, getInheritorsAPI, getTouristsAPI } from '@/apis/users';
import { DialogCommon, SearchAndFilter } from '@/components';
import { usePageList } from '@/hook';
import { getDetailPeopleItems } from '@/utils';
import { Button, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const PeopleManage = () => {
  const { users = {} } = useOutletContext() || {};
  // 获取三种身份的列表数据
  const [tourists, setTourists] = useState([]);
  const [inheritors, setInheritors] = useState([]);
  const [admins, setAdmins] = useState([]);
  // 多选值状态
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const getTouristsList = async () => {
      try {
        const res = await getTouristsAPI();
        setTourists(res.data);
      } catch (error) {
        console.error('获取游客列表失败', error);
      }
    };
    const getInheritorsList = async () => {
      try {
        const res = await getInheritorsAPI();
        setInheritors(res.data);
      } catch (error) {
        console.error('获取传承人列表失败', error);
      }
    };
    const getAdminsList = async () => {
      try {
        const res = await getAdminsAPI();
        setAdmins(res.data);
      } catch (error) {
        console.error('获取管理员列表失败', error);
      }
    };

    getTouristsList();
    getInheritorsList();
    getAdminsList();
  }, []);

  // 人员列表的表格的栏
  const peopleColumns = [
    {
      title: '人员名称',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '人员类型',
      dataIndex: 'identity_type',
      key: 'identity_type',
      render: (text) => (
        <div className="text-blue-500">
          {text === 1 ? '游客' : text === 2 ? '文化传承人' : '文旅局管理员'}
        </div>
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'created_time',
      key: 'created_time',
      render: (text) => <div>{dayjs(text).format('YYYY-MM-DD HH:mm')}</div>,
      sorter: (a, b) => new Date(b.created_time) - new Date(a.created_time),
      sortDirections: ['descend'],
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenDialog(record.user_id)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 处理的用于渲染表格的用户数据
  const peopleData = users
    .map((item) => {
      return {
        ...item,
        key: item.user_id,
      };
    })
    .sort((a, b) => b.user_id - a.user_id);

  // 打开详情弹窗
  const handleOpenDialog = (id) => {
    const userItem = users.find((item) => item.user_id === id);
    setDialogItem(userItem);
    setIsShowAddDialog(true);
  };

  // 控制详情弹窗
  const [isShowDialog, setIsShowAddDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState(null);

  const dialogData = useMemo(() => {
    if (!dialogItem?.user_id)
      return {
        type: 3,
        items: [],
        title: '',
      };

    // 处理用户数据，在user表后面加上 privacyData 数组
    // 设置默认值，以免为空或者未定义
    const type = dialogItem.identity_type || 1;

    // 直接根据 type 选对应的列表，不定义 identityList
    let list = [];
    if (type === 1) list = tourists;
    else if (type === 2) list = inheritors;
    else list = admins;

    const currentUser = list.find(
      (item) => item.user_id === dialogItem.user_id,
    );

    // 兜底用户数据
    const privacyDataOne =
      type === 1
        ? (currentUser?.signature ?? '-')
        : type === 2
          ? (currentUser?.inherit_level ?? '-')
          : (currentUser?.position ?? '-');
    const privacyDataTwo =
      type === 1
        ? (currentUser?.email ?? '-')
        : type === 2
          ? (currentUser?.field ?? '-')
          : (currentUser?.department ?? '-');

    const userItem = {
      ...dialogItem,
      privacyData: [privacyDataOne, privacyDataTwo],
    };

    const identity =
      type === 1 ? '游客' : type === 2 ? '文化传承人' : '文旅局管理员';

    const items = getDetailPeopleItems(userItem);
    return {
      type: 3,
      items,
      title: `${identity}-${dialogItem.user_name}`,
      width: 1000,
      column: 5,
    };
  }, [dialogItem, tourists, inheritors, admins]);

  // 搜索和筛选
  const { currentPage, currentData, total, setCurrentPage, changeFilter } =
    usePageList(peopleData, 10, ['']);

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    // console.log('当前选中的值：', value);
    setSelectedValues(value);
    changeFilter('identity_type', value); // 筛选 type 字段
  };

  // 下拉菜单 配置
  const peopleConfig = {
    select: {
      width: 360,
      optionsItem: [
        { value: 1, label: '游客' },
        { value: 2, label: '文化传承人' },
        { value: 3, label: '文旅局管理员' },
      ],
      placeholder: '选择人员类型',
      showSearch: true,
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
  };

  return (
    <div>
      <div className="text-xl font-semibold">人员管理</div>

      {/* 筛选框 */}
      <div className="mt-6">
        <SearchAndFilter fieldConfig={peopleConfig} />
      </div>

      {/* 人员列表渲染 */}
      <div className="w-full px-4 py-8">
        <Table
          columns={peopleColumns}
          dataSource={currentData.sort((a, b) => b.user_id - a.user_id)}
          showSorterTooltip={{ target: 'sorter-icon' }}
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

      {/* 人员详情弹窗 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={() => {
          setIsShowAddDialog(false);
          setDialogItem({});
        }}
        dialogData={dialogData}
      />
    </div>
  );
};

export default PeopleManage;
