import { postOrderAPI } from '@/apis/orders';
import { isReserveFeasible } from '@/utils';

// 处理预约弹窗提交事件
export const useReserveConfirm = (messageApi) => {
  const submitReservation = async (
    form,
    favoriteData,
    reservationData,
    setConfirmLoading,
    setIsShowReservationDialog,
  ) => {
    try {
      setConfirmLoading(true);

      // 1. 校验表单
      const validValue = await form.validateFields();
      const {
        item_name = '',
        contact_people = '',
        contact_phone = '',
        single_price = 0,
        reserve_time = null,
        reserve_period = '',
        people_num = 1,
        remark = null,
      } = validValue;

      // 2. 判断预约时间是否合法
      const isFeasible = isReserveFeasible(reserve_time, reserve_period);
      if (!isFeasible) {
        messageApi.error('选定时间已逾当前时刻，无法提交预约申请！');
        return;
      }

      // 3. 区分景点 / 非遗
      const isSpot = favoriteData?.businessType === 1;

      // 4. 构造订单数据
      const newData = {
        tourist_id: favoriteData?.touristId,
        business_type: favoriteData?.businessType,
        business_id: favoriteData?.businessId,
        item_name,
        single_price,
        reserve_time: reserve_time.format('YYYY-MM-DD'),
        reserve_period,
        contact_people,
        contact_phone,
        people_num: isSpot ? 1 : people_num,
        total_price: Number(single_price * people_num),
        inheritor_id: isSpot ? null : reservationData.inheritor_id,
        remark: isSpot ? null : remark,
        order_status: single_price === 0 ? 1 : 0,
      };

      // 5. 提交预约
      await postOrderAPI(newData);

      // 6. 成功处理
      form.resetFields();
      messageApi.open({
        type: 'success',
        content: (
          <div>
            预约 <span className="text-amber-500">{item_name}</span> 成功！
            可前往用户中心查看~
          </div>
        ),
      });
      setIsShowReservationDialog(false);
    } catch (error) {
      console.error('预约表单提交失败！', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return { submitReservation };
};
