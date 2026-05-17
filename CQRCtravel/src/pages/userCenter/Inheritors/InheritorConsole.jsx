import { Avatar, Tag } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { defaultAvatar, inheritLevelTagsConfig } from '@/store';
import { Card } from '@/components';

const InheritorConsole = () => {
  const {
    user = {},
    orderList = [],
    heritageLength = 0,
  } = useOutletContext() || {};

  const navigate = useNavigate();

  // 销售额计算
  const totalMoney = orderList.reduce((num, item) => item.total_price + num, 0);

  // 数据卡片的配置
  const dataCardFields = [
    {
      iconColor: 0,
      icon: 'icon-renminbi',
      title: '销售额',
      data: totalMoney,
    },
    {
      iconColor: 1,
      icon: 'icon-survey',
      title: '订单量',
      data: orderList.length,
    },
    {
      iconColor: 3,
      icon: 'icon-zhenshikexin',
      title: '传承项目数量',
      data: heritageLength,
    },
  ];

  return (
    <div>
      {/* 个人信息展示 */}
      <div className="w-full bg-white rounded-xl shadow px-8 py-4 bgImage flex justify-between">
        <div className="flex items-center gap-4">
          <div className="border border-slate-100 w-fit">
            <Avatar
              src={user.avatar || defaultAvatar}
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
              <span className="flex gap-1">
                {user.privacyData[2] &&
                  user.privacyData[2].map((item, index) => (
                    <Tag variant="filled" color="#f50" key={index}>
                      {item}
                    </Tag>
                  ))}
              </span>
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
