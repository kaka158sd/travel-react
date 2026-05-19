// 构建行程方案方法

// items：生成行程所需的item；params：生成行程表单的参数
export function buildItinerary(items, params) {
  const {
    travel_days,
    planned_departure_time,
    people_count,
    interest_preferences,
    crowd_type,
  } = params;
  const startDate = new Date(planned_departure_time);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + travel_days - 1);

  // 根据当天的项目数量返回时间段
  function getTimeSlots(projectCount) {
    // 一整天取一个
    if (projectCount === 1) {
      return ['8:00-17:00'];
    }

    // 分为上午、下午
    if (projectCount === 2) {
      return ['8:00-12:00', '13:00-17:00'];
    }

    // 标准三段
    if (projectCount === 3) {
      return ['8:00-11:00', '14:00-17:00', '19:00-21:00'];
    }

    // 项目>3，紧凑模式
    return [
      '8:00-10:00',
      '10:30-12:30',
      '14:00-16:00',
      '16:30-18:30',
      '19:00-21:00',
    ];
  }

  // 随机打乱项目顺序
  const shuffledItems = [...items].sort(() => Math.random() - 0.5);

  const business_items = [];
  let itemIndex = 0;
  const totalItems = shuffledItems.length;
  // 自定义项目
  const customItems =
    items.filter((item) => item.is_custom_item === true) || [];

  // 把项目平均分给每一天
  const itemsPerDay = Math.ceil(totalItems / travel_days);

  for (let day = 1; day <= travel_days && itemIndex < totalItems; day++) {
    // 今天要排多少个项目
    const todayCount = Math.min(itemsPerDay, totalItems - itemIndex);
    // 获取今天的时间段
    const timeSlots = getTimeSlots(todayCount);

    // 逐个分配
    for (let i = 0; i < todayCount && itemIndex < totalItems; i++) {
      const item = shuffledItems[itemIndex];
      business_items.push({
        sort_num: itemIndex + 1,
        trip_day: day,
        item_name: item.business_name,
        item_time: timeSlots[i % timeSlots.length], //自动循环
        price: item.price,
        is_custom_item: item.is_custom_item,
      });
      itemIndex++;
    }
  }

  // 生成行程名称
  const crowdTypeMap = {
    1: '亲子',
    2: '情侣',
    3: '朋友',
    4: '个人',
    5: '研学',
    6: '老少皆宜',
  };
  const interestNames =
    interest_preferences && interest_preferences.length > 0
      ? interest_preferences.map((id) => (id === 1 ? '古镇' : '非遗')).join('+')
      : '特色体验';
  const trip_name = `${travel_days} 天${crowdTypeMap[crowd_type]}游: ${interestNames} (含${customItems.length}个自定义项目)`;

  // 计算总价
  const totalPrice =
    business_items.reduce((sum, item) => sum + (item.price || 0), 0) *
    (people_count || 1);

  return {
    business_items,
    trip_start_time: startDate.toISOString().slice(0, 10),
    trip_end_time: endDate.toISOString().slice(0, 10),
    trip_name,
    totalPrice,
    people_count,
  };
}

// 生成行程方案
// values：生成行程表单值；customItem：自定义项目；allSystemItems：景点、非遗项目
export async function generateItinerary(values, customItem, allSystemItems) {
  // console.log('进入生成器时的自定义项目：', customItem);
  // console.log('自定义项目数量：', customItem.length);
  try {
    // 获取表单参数
    const {
      travel_days,
      interest_preferences,
      crowd_type,
      planned_departure_time,
      people_count,
    } = values;

    // 日期格式化
    const planTime = planned_departure_time.format('YYYY-MM-DD');

    // 筛选数据
    const customItems = customItem.filter(
      (item) => item.is_added_to_trip === true,
    );
    // console.log('进入生成算法的自定义项目：', customItems);

    const totalCustomCount = customItems.length;
    const MAX_SLOTS_PRE_DAY = 3; //每天最多3个正常项目
    const totalAvailableSlots = travel_days * MAX_SLOTS_PRE_DAY;

    // 算法分支
    let finalItems = [];

    if (totalCustomCount === 0) {
      // 没有自定义项目时：系统推荐
      const recommended =
        interest_preferences && interest_preferences.length > 0
          ? allSystemItems
              .filter((item) =>
                interest_preferences.includes(item.business_type),
              )
              .slice(0, totalAvailableSlots)
          : allSystemItems.slice(0, totalAvailableSlots);
      finalItems = recommended;
    } else {
      // 有自定义项目

      // 情况1：项目太多
      if (totalCustomCount > totalAvailableSlots) {
        const confirm = window.confirm(
          `⚠️ 警告：您选择了 ${totalCustomCount} 个自定义项目，${travel_days} 天内无法正常游玩，是否生成紧凑行程？`,
        );
        if (!confirm) {
          alert('已取消生成，请减少自定义项目数量!');
          return null;
        }
        // 全部塞到行程方案中
        finalItems = [...customItems];
      } else if (totalCustomCount < totalAvailableSlots) {
        // 情况2：自定义过少
        const addRecommend = window.confirm(
          `提示：当前仅选择 ${totalCustomCount} 个项目，行程较空，是否自动补充推荐项目？`,
        );

        if (addRecommend) {
          const needCount = totalAvailableSlots - totalCustomCount;
          const filterDate =
            interest_preferences && interest_preferences.length > 0
              ? allSystemItems.filter((item) =>
                  interest_preferences.includes(item.business_type),
                )
              : allSystemItems;
          const supplement = filterDate
            .filter(
              (item) =>
                !customItems.some(
                  (c) =>
                    c.business_type === item.business_type &&
                    c.business_id === item.business_id,
                ),
            )
            .slice(0, needCount);

          finalItems = [...customItems, ...supplement];
        } else {
          finalItems = [...customItems];
        }
      } else {
        // 情况3：刚好合适
        finalItems == [...customItems];
      }
    }

    // 构建最终行程
    const itinerary = buildItinerary(finalItems, {
      travel_days,
      interest_preferences,
      crowd_type,
      planned_departure_time: planTime,
      people_count,
    });

    console.log('生成成功，行程方案：', itinerary);
    return itinerary;
  } catch (error) {
    console.error('生成行程方案失败！', error);
    return null;
  }
}
