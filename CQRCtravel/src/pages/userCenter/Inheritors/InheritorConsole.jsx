import { Avatar, Tag } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { inheritLevelTagsConfig } from '@/store';
import { Card } from '@/components';

const InheritorConsole = () => {
  const { user = {} } = useOutletContext() || {};

  const navigate = useNavigate();

  // 数据卡片的配置
  const dataCardFields = [
    {
      iconColor: 0,
      icon: 'icon-renminbi',
      title: '月销售额',
      data: 2000,
    },
    {
      iconColor: 1,
      icon: 'icon-survey',
      title: '月订单量',
      data: 22,
    },
    {
      iconColor: 3,
      icon: 'icon-zhenshikexin',
      title: '传承项目数量',
      data: 2,
    },
  ];

  return (
    <div>
      {/* 个人信息展示 */}
      <div className="w-full bg-white rounded-xl shadow px-8 py-4 bgImage flex justify-between">
        <div className="flex items-center gap-4">
          <div className="border border-slate-100 w-fit">
            <Avatar
              src={user.avatar}
              size={120}
              icon={<UserOutlined />}
              shape="square"
            />
          </div>

          <div className="pr-4">
            <div className="text-xl font-semibold">{user.user_name}</div>
            <div className="text-base py-2">{user.phone}</div>
            <div className="flex gap-4">
              {user.privacyData[1] &&
                inheritLevelTagsConfig
                  .filter((item) => item.text === user.privacyData[1])
                  .map((item) => (
                    <Tag key={item.text} variant="solid" color={item.color}>
                      {item.text}
                    </Tag>
                  ))}
              {user.privacyData[2] && (
                <Tag variant="filled" color="#f50">
                  {user.privacyData[2]}
                </Tag>
              )}
            </div>
          </div>
        </div>

        {/* 编辑个人信息按钮 */}
        <i
          className="iconfont icon-qianshuxieyi editIcon h-fit"
          style={{ fontSize: 26 }}
          onClick={() => navigate('/inheritorCenter/inheritorAccount')}
        />
      </div>

      {/* 数据卡片 */}
      <div className="flex justify-between items-center py-10 ">
        {dataCardFields.map((item, index) => {
          const boxStyle = {
            width: 'w-[320px]',
            padding: 'py-8 px-12',
            gap: 'gap-4',
          };
          const cardData = {
            mode: 3,
            iconType: 3,
            iconColor: item.iconColor,
            icon: item.icon,
            title: item.title,
            data: item.data,
          };

          return <Card key={index} boxStyle={boxStyle} cardData={cardData} />;
        })}
      </div>
    </div>
  );
};

export default InheritorConsole;
