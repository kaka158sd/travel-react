import { getHumanStoriesAPI } from '@/apis/human_stories';
import { Card, Title, SearchAndFilter } from '@/components';
import { useEffect, useState } from 'react';
import './index.less';
import { LoadError, LoadingSkeleton } from '@/components/EmptyStates';
import { usePageList } from '@/hook';
import { Pagination } from 'antd';

const HumanStoriesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [humanStoriesList, setHumanStoriesList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let timer; // 用于最小加载时间
    const getHumanStoriesList = async () => {
      try {
        setIsLoading(true);
        const res = await getHumanStoriesAPI();
        setHumanStoriesList(res.data);
      } catch (error) {
        console.error('获取人文故事集失败', error);
        setError(true);
      } finally {
        // 强制等待至少 300ms，避免请求太快导致的闪烁
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    getHumanStoriesList();
    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearTimeout(timer);
  }, []);

  const { currentPage, currentData, total, setCurrentPage, setSearchText } =
    usePageList(
      humanStoriesList.sort((a, b) => b.story_id - a.story_id),
      5,
      ['story_title'],
    );

  //搜索框配置
  const formConfig = {
    search: {
      placeholder: '输入标题...',
      width: 600,
      value: inputValue,
      size: 'large',
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <LoadError />;
  }

  return (
    <div className="w-full">
      <Title titleData={{ title: '荣昌人文故事集' }} />

      {/* 筛选框和搜索框 */}
      <div className="pt-4 pb-10 text-center">
        <SearchAndFilter fieldConfig={formConfig} />
      </div>

      {/* 人文故事集列表渲染 */}
      <div className="w-350 bg-amber-50 mx-auto py-12 rounded-2xl ring-offset-2 ring-1 ring-amber-500 ring-offset-amber-400">
        <div className="listbox grid grid-cols-1 gap-14 px-24">
          {currentData.map((item) => {
            const boxStyle = {
              width: 'w-full',
              // height: 'h-[400px]',
            };

            const cardData = {
              mode: 1,
              iconType: 1, //图标类型：1：没有背景色（如首页卡片）；2：有背景色（如交通卡片）；3：图标在左（如功能卡片）
              icon: 'icon-office',
              title: item.story_title,
              desc: item.story_desc,
            };

            return (
              <Card
                key={item.story_id}
                boxStyle={boxStyle}
                cardData={cardData}
              />
            );
          })}
        </div>
      </div>

      {/* 分页组件 */}
      <div className="mt-4">
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={5}
          total={total}
          align="end"
          onChange={(page) => setCurrentPage(page)}
          size="large"
        />
      </div>
    </div>
  );
};

export default HumanStoriesPage;
