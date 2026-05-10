import { Card } from '@/components';
import { Table } from 'antd';
import { useOutletContext } from 'react-router-dom';

// 最近活动的表格栏
const activityColumns = [
  {
    title: '活动ID',
    dataIndex: 'activity_id',
    key: 'activity_id',
  },
  {
    title: '活动名称',
    dataIndex: 'activity_name',
    key: 'activity_name',
  },
  {
    title: '关联名称',
    dataIndex: 'relate_name',
    key: 'relate_name',
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
  },
  {
    title: '活动地址',
    dataIndex: 'address',
    key: 'address',
  },
];

const AdminsConsole = () => {
  const context = useOutletContext() || {};
  const { cardData = {}, activitiesData = [] } = context;

  // 数据卡片的配置
  const adminDataCard = [
    {
      title: '景点总数',
      icon: 'icon-dujia',
      iconColor: 0,
      data: cardData?.spots,
    },
    {
      title: '非遗总数',
      icon: 'icon-chuntianran',
      iconColor: 1,
      data: cardData?.heritage,
    },
    {
      title: '新闻总数',
      icon: 'icon-notification',
      iconColor: 2,
      data: cardData?.news,
    },
    {
      title: '人员总数',
      icon: 'icon-RectangleCopy2',
      iconColor: 3,
      data: cardData?.user,
    },
  ];

  return (
    <div>
      {/* 数据卡片 */}
      <div className="flex justify-between">
        {adminDataCard.map((item) => {
          const boxStyle = {
            width: 'w-[280px]',
            padding: 'py-4 px-10',
            gap: 'gap-2',
          };

          const cardData = {
            mode: 3,
            iconType: 3,
            iconColor: item.iconColor,
            icon: item.icon,
            title: item.title,
            data: item.data,
          };

          return (
            <Card key={item.title} boxStyle={boxStyle} cardData={cardData} />
          );
        })}
      </div>

      {/* 最近活动 */}
      <div className="py-8">
        <div className="text-xl font-semibold mb-4">最近活动</div>
        <div className="px-4 mr-4">
          <Table
            columns={activityColumns}
            dataSource={activitiesData?.slice(0, 10) || []}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminsConsole;
