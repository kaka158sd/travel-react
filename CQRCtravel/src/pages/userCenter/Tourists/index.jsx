import { Card, DataField } from '@/components';
import './index.less';
import { Popover } from 'antd';

// 数据卡片的配置
const dataCardFields = [
  {
    iconColor: 0,
    icon: 'icon-favorite',
    title: '我的收藏',
    data: 2,
  },
  {
    iconColor: 2,
    icon: 'icon-quanqiukuajing',
    title: '我的好友',
    data: 22,
  },
  {
    iconColor: 3,
    icon: 'icon-financial_fill',
    title: '我的钱包',
    data: 158,
  },
];

const TouristCenter = () => {
  // const [messageApi, contextHolder] = message.useMessage();
  // 处理数据卡片的点击事件
  // const handleDataClick = (index) => {
  //   if (index === 2) {
  //     messageApi.success(`钱包余额: ${dataCardFields[2].data}`);
  //   }
  // };

  return (
    <div className="bg-slate-100">
      <div className="w-280 h-500 rounded-lg mx-auto border border-amber-300 bg-slate-50 py-0.75 px-8">
        {/* 个人信息展示 */}
        <div className="w-full px-8 py-4 backgroundImage rounded-2xl flex items-center">
          {/* 头像 */}
          <DataField
            type="avatar"
            formConfig={{ src: '', size: 100 }}
            className="cursor-pointer"
          />

          {/* 用户名与个性签名 */}
          <div className="text-white ml-6">
            <div className="text-2xl mb-3">游客</div>
            <p className="line-clamp-2 opacity-85">
              我的个性签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名我的个性签名
            </p>
          </div>
        </div>

        {/* 数据卡片 */}
        <div className="flex justify-between items-center my-7 px-6 relative">
          {/* {contextHolder} */}
          {dataCardFields.map((item, index) => {
            const boxStyle = {
              width: 'w-[260px]',
            };
            const cardData = {
              mode: 3,
              iconType: 1,
              iconColor: item.iconColor,
              icon: item.icon,
              title: item.title,
              data: item.data,
            };

            return (
              <Card
                key={index}
                boxStyle={boxStyle}
                cardData={cardData}
                className={`shrink-0 ${index === 2 ? 'ml-auto' : ''}`}
                // onClick={handleDataClick(index)}
              />
            );
          })}

          <span className="absolute right-0 w-0 h-0" />
          {/* 钱包充值按钮 */}
          <Popover content="点击可充值200-500元哦！">
            <i
              className="iconfont icon-icon1 text-yellow-400 absolute -top-5 right-10 cursor-pointer"
              style={{ fontSize: 36 }}
            />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default TouristCenter;
