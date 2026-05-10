import { getDetailNewItems } from '@/utils';
import { ConfigProvider, Divider, Slider } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DialogCommon } from '@/components';
import { useAddNewsForm } from '@/hook';

// 新闻数据
const addNew = {
  // news_id: 1,
  // news_title: '荣昌卤鹅文化节盛大开幕，打响“中国鹅城”品牌',
  // news_image:
  //   'https://tse2-mm.cn.bing.net/th/id/OIP-C.kLFnXz5TrBdLv4U-u-8RoQHaDt?w=341&h=175&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  // publisher: '文旅宣传科',
  // publish_unit: '荣昌区文旅委',
  // news_content:
  //   '荣昌区举办首届卤鹅文化节，活动包含卤鹅美食大赛、非遗展示、文艺演出等，吸引上万游客打卡。',
  // publish_time: '2026-04-19T11:51:42.195248+00:00',
};
// 管理员的名字
const userData = {
  userName: '管理员',
  department: '宣传科',
};

const NewsManage = ({ adminNav, news }) => {
  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1); //1：详情；2：新增；
  const [dialogItem, setDialogItem] = useState({});

  // 获取新闻新增表单
  const { form, formFields } = useAddNewsForm({ addNew, userData });

  const dialogData = useMemo(() => {
    if (dialogType === 1) {
      const items = getDetailNewItems(dialogItem);
      return {
        type: 3,
        items,
        title: dialogItem.news_title,
        width: 1000,
      };
    } else if (dialogType === 2) {
      return {
        type: 1,
        title: '新增新闻公告',
        data: {
          formType: 'add',
          form,
          initialValues: {},
          formFields,
        },
        width: 800,
      };
    }

    return {
      type: 3,
      items: [],
      title: '',
    };
  }, [dialogItem, dialogType, form, formFields]);

  // 按 publish_time 时间戳从新到旧排序
  const sortedNewsList = useMemo(() => {
    if (!news.length) return [];
    return [...news]
      .map((item) => {
        return {
          ...item,
          publish_time: dayjs(item.publish_time).format('YYYY-MM-DD'),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.pulish_time).getTime() - new Date(a.pulish_time).getTime(),
      );
  }, [news]);

  // 点击打开详情弹窗事件
  const handleOpenDialog = (item) => {
    setDialogType(1);
    setDialogItem(item);
    setIsShowDialog(true);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorSplit: '#c2c2c2',
        },
      }}
    >
      {adminNav === 'new' && (
        <div>
          <div className="text-xl font-semibold">新闻管理</div>

          <div className="flex justify-between py-4">
            {/* 搜索框和筛选框 */}
            <div></div>

            {/* 新增按钮 */}
            <div className="w-22">
              <div
                className="btn2"
                onClick={() => {
                  form.resetFields();
                  setDialogType(2);
                  setIsShowDialog(true);
                }}
              >
                新增
              </div>
            </div>
          </div>

          {/* 新闻列表,需要分页 */}
          <div className="pr-12 pl-6">
            <div className="w-full border border-slate-200 rounded-xl shadow shadow-amber-300">
              {sortedNewsList.map((item) => (
                <div key={item.news_id}>
                  <div className="text-base flex items-center justify-between px-4 py-2">
                    <div
                      onClick={() => handleOpenDialog(item)}
                      className="hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer"
                    >
                      {item.publish_time}&emsp;{item.news_title}
                    </div>
                    <i
                      className="iconfont icon-close cursor-pointer hover:text-orange-500 hover:scale-115"
                      style={{ fontSize: 22 }}
                    />
                  </div>
                  <Divider size="small" />
                </div>
              ))}
            </div>
          </div>

          {/* 新闻弹窗 */}
          <DialogCommon
            isShowDialog={isShowDialog}
            dialogData={dialogData}
            onCancel={() => setIsShowDialog(false)}
            onOk={() => setIsShowDialog(false)}
          />
        </div>
      )}
    </ConfigProvider>
  );
};

export default NewsManage;
