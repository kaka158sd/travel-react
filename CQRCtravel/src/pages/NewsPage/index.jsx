import { getNewsAPI } from '@/apis/news';
import { DataField, Title } from '@/components';
import { useEffect, useState, useMemo } from 'react';
import { ConfigProvider, Splitter } from 'antd';

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);

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

  const sortedNewsSixItems = sortedNewsList.slice(0, 6);
  const sortedNewsOthersItems = sortedNewsList.slice(6);

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: {
            colorPrimary: '#d97706',
            controlItemBgActiveHover: '#faeedd',
            controlItemBgActive: '#faeedd',
          },
        },
      }}
    >
      <div className="flex flex-col items-center">
        <Title titleData={{ title: '荣昌新闻公告' }} />

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
                  <div className="hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer">
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
                  <div
                    key={item.news_id}
                    className="text-lg flex p-4 space-y-3"
                  >
                    <i className="iconfont icon-map-filling text-[#ff9671] px-2 cursor-pointer" />
                    <div className="hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer">
                      {item?.news_title}
                    </div>
                  </div>
                ))}
              </div>
            </Splitter.Panel>
          </Splitter>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default NewsPage;
