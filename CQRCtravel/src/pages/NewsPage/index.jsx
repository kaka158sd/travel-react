import { getNewsAPI } from '@/apis/news';
import { DataField, DialogCommon, Title } from '@/components';
import { useEffect, useState, useMemo } from 'react';
import { Splitter } from 'antd';
import dayjs from 'dayjs';

// 弹窗的label
const label = ['新闻图片', '发布者', '发布单位', '新闻内容', '发布时间'];

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);

  // 控制弹窗的显隐
  const [isShowDialog, setIsShowDialog] = useState(false);
  // 弹窗数据：通过点击事件将处理的数据传递给弹窗组件
  const [newsDialogData, setNewsDialogData] = useState({});

  useEffect(() => {
    const getNewsList = async () => {
      try {
        const res = await getNewsAPI();
        setNewsList(res.data);
      } catch (error) {
        console.error('获取新闻列表失败', error);
      }
    };

    getNewsList();
  }, []);

  // 按 publish_time 时间戳从新到旧排序
  const sortedNewsList = useMemo(() => {
    if (!newsList.length) return [];
    return [...newsList].sort(
      (a, b) =>
        new Date(b.pulish_time).getTime() - new Date(a.pulish_time).getTime(),
    );
  }, [newsList]);

  // 左右两侧的新闻列表
  const sortedNewsSixItems = sortedNewsList.slice(0, 6);
  const sortedNewsOthersItems = sortedNewsList.slice(6);

  // 点击事件：点击新闻标题打开新闻详情弹窗
  const handleOpenDialog = (item) => {
    // 新闻弹窗传参数据
    const dialogData = {
      type: 3,
      items: [
        {
          key: '1',
          label: label[0],
          children: <img src={item.news_image} />,
          span: 3,
        },
        {
          key: '2',
          label: label[1],
          children: item.publisher,
        },
        {
          key: '3',
          label: label[2],
          children: item.publish_unit,
          span: 'filled',
        },
        {
          key: '4',
          label: label[3],
          children: item.news_content,
          span: 3,
        },
        {
          key: '5',
          label: label[4],
          children: dayjs(item.publish_time).format('YYYY-MM-DD HH:mm'),
        },
      ],
      title: item.news_title,
      width: 1000,
    };

    setNewsDialogData(dialogData);

    // 打开弹窗
    setIsShowDialog(true);
  };

  return (
    <div className="flex flex-col items-center">
      <Title titleData={{ title: '荣昌新闻公告' }} />

      {/* 搜索框 */}
      <div>
        <DataField
          type="search"
          formConfig={{
            size: 'large',
            placeholder: '输入搜索内容...',
            width: 600,
          }}
        />
      </div>

      {/* 新闻数据渲染 */}
      <div className="my-16">
        <Splitter
          style={{
            width: 1300,
            height: 'auto',
            boxShadow: '0 0 10px rgba(217, 119, 6, 0.3)',
            borderRadius: 12,
          }}
        >
          {/* 左侧面板 */}
          <Splitter.Panel defaultSize="40%" min="20%" max="60%">
            {sortedNewsSixItems.map((item) => (
              <div key={item.news_id} className="text-lg flex p-4 space-y-3">
                <i className="iconfont icon-hot-for-atmosphere text-color1 px-2 cursor-pointer" />
                <div
                  onClick={() => handleOpenDialog(item)}
                  className="hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer"
                >
                  {item?.news_title}
                </div>
              </div>
            ))}
          </Splitter.Panel>

          {/* 右侧面板 */}
          <Splitter.Panel>
            <div
              className="h-full overflow-y-hidden"
              style={{
                // 把两个面板合起来，做成一个完整的双列容器
                columns: 2,
                columnFill: 'balance',
                columnGap: '0px',
              }}
            >
              {/* 所有新闻项只写一次，CSS会自动分到左右两列 */}
              {sortedNewsOthersItems.map((item) => (
                <div key={item.news_id} className="text-lg flex p-4 space-y-3">
                  <i className="iconfont icon-map-filling text-[#ff9671] px-2 cursor-pointer" />
                  <div
                    onClick={() => handleOpenDialog(item)}
                    className="hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer"
                  >
                    {item?.news_title}
                  </div>
                </div>
              ))}
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>

      {/* 新闻弹窗 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        dialogData={newsDialogData}
        onCancel={() => setIsShowDialog(false)}
      />
    </div>
  );
};

export default NewsPage;
