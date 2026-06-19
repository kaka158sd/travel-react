import { SimpleBar } from '@/components';
import { Segmented, Statistic } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const PlatformDataShow = () => {
  const { platformData = {}, platformFlow = [] } = useOutletContext();
  const [timeSlot, setTimeSlot] = useState('今日');

  // 核心数据配置
  const platformConfig = [
    { title: '平台总资金', value: platformData.total_fund },
    { title: '冻结资金', value: platformData.freeze_fund },
    { title: '可结算资金', value: platformData.available_fund },
  ];

  // 筛选今日、本周、本月数据
  const todayFlow = platformFlow.filter((item) => {
    return (
      dayjs(item.create_time).format('YYYY-MM-DD') ===
      dayjs().format('YYYY-MM-DD')
    );
  });
  const weekFlow = platformFlow.filter((item) =>
    dayjs(item.create_time).isSame(dayjs(), 'week'),
  );
  const monthFlow = platformFlow.filter((item) =>
    dayjs(item.create_time).isSame(dayjs(), 'month'),
  );

  // 充值、支付、退款额度
  const chartValue = useMemo(() => {
    let lists = [];
    switch (timeSlot) {
      case '今日':
        lists = todayFlow;
        break;
      case '本周':
        lists = weekFlow;
        break;
      case '本月':
        lists = monthFlow;
        break;
      default:
        lists = [];
    }

    const charge = lists
      .filter((item) => item.flow_desc === '游客充值')
      .reduce((sum, item) => sum + Math.abs(item.change_amount || 0), 0);
    const refund = lists
      .filter((item) => item.flow_desc === '退款支出')
      .reduce((sum, item) => sum + Math.abs(item.change_amount || 0), 0);
    const payRaw = lists
      .filter((item) => item.flow_desc === '订单支付')
      .reduce((sum, item) => sum + Math.abs(item.change_amount || 0), 0);
    const pay = payRaw - refund;

    return [charge, pay, refund];
  }, [timeSlot, todayFlow, weekFlow, monthFlow]);

  return (
    <div className="px-4 py-6">
      {/* 核心数据 */}
      <div className="flex justify-between gap-8 mr-30">
        {platformConfig.map((item) => (
          <div
            key={item.title}
            className="w-60 border border-gray-200 py-4 px-10 shadow-xl drop-shadow-amber-50 rounded-xl"
          >
            <Statistic
              title={item.title}
              value={item.value}
              precision={2}
              suffix="/元"
            />
          </div>
        ))}
      </div>

      {/* 统计今日，本周，本月的充值、支付、退款额度 */}
      <div className="mt-14">
        <Segmented
          options={['今日', '本周', '本月'].map((item) => {
            const isChecked = timeSlot === item;
            return {
              label: item,
              value: item,
              icon: (
                <i
                  className="iconfont icon-tubiao-zhuzhuangtu text-color1"
                  style={{
                    transition: 'all 0.3s ease',
                    display: 'inline-block',
                    visibility: isChecked ? 'visible' : 'hidden',
                    width: isChecked ? '20px' : '0px',
                    marginRight: isChecked ? '6px' : '0px',
                    transform: isChecked ? 'scale(1)' : 'scale(0.6)',
                  }}
                />
              ),
            };
          })}
          size="large"
          value={timeSlot}
          onChange={setTimeSlot}
        />

        <div className="w-200">
          <SimpleBar
            xData={['充值总额', '支付总额', '退款总额']}
            value={chartValue}
          />
        </div>
      </div>
    </div>
  );
};

export default PlatformDataShow;
