import { getHumanStoriesAPI } from '@/apis/human_stories';
import { getScenicSpotsAPI } from '@/apis/scenic_spots';
import { Title, Card, LookMore } from '@/components';
import { useEffect, useState } from 'react';

const titleData = {
  title: '古镇人文 · 千年底蕴',
  desc: '探索荣昌古镇群，感受“湖广填四川”的移民文化，触摸历史的温度',
};

const AncientTown = () => {
  // 获取景点列表
  const [scenicSpotsList, setScenicSpotsList] = useState([]);
  // 获取人文故事集列表
  const [humanStoriesList, setHumanStoriesList] = useState([]);

  // 在useEffect中调用接口获取数据并存入state中
  useEffect(() => {
    // 封装函数，在函数体内调用接口
    const getScenicSpotsList = async () => {
      try {
        const res = await getScenicSpotsAPI();
        setScenicSpotsList(res.data);
      } catch (error) {
        console.error('获取景点列表失败', error);
      }
    };

    const gethumanStoriesList = async () => {
      try {
        const res = await getHumanStoriesAPI();
        setHumanStoriesList(res.data);
      } catch (error) {
        console.error('获取人文故事集失败', error);
      }
    };

    // 调用函数
    getScenicSpotsList();
    gethumanStoriesList();
  }, []);

  // 截取列表前3项，若列表不足3项则取全部（避免报错）
  const scenicSpotsThreeList = scenicSpotsList.slice(0, 3);
  const humanStoriesThreeList = humanStoriesList.slice(0, 3);

  return (
    <div className="max-w-350 m-auto">
      <Title titleData={titleData} />

      {/* 查看更多-跳转至景点页面 */}
      <LookMore path="/scenicSpots_Page" />

      {/* 渲染景点卡片 */}
      <div className="w-full mx-auto grid grid-cols-3 gap-25 justify-content-stretch mb-25">
        {scenicSpotsThreeList.map((item) => {
          // 组装Card组件需要的数据
          const boxStyle = {
            width: 'w-[400px]',
            height: 'h-[450px]',
            imgHeight: 'h-[200px]',
          };

          const cardData = {
            mode: 2,
            img: item.spot_image,
            type: item.spot_type,
            title: item.spot_name,
            desc: item.spot_desc,
            tags: item.spot_tags,
            btn: [1, 2, 5],
          };

          // 给每个Card传递对象并添加key
          return (
            <Card key={item.spot_id} boxStyle={boxStyle} cardData={cardData} />
          );
        })}
      </div>

      {/* 人文故事集 */}
      <div>
        <p className="titie1">人文故事集</p>

        {/* 点击跳转至人文故事集页面 */}
        <LookMore path="/humanStories_Page" />

        {/* 渲染人文故事集卡片 */}
        <div className="w-full mx-auto grid grid-cols-3 gap-39 justify-content-stretch mb-25">
          {humanStoriesThreeList.map((item) => {
            const boxStyle = {
              width: 'w-[360px]',
            };

            const cardData = {
              mode: 1,
              iconType: 1,
              icon: 'icon-office',
              title: item.story_title,
              desc: item.story_desc,
            };

            return (
              <Card
                key={item.story_id}
                cardData={cardData}
                boxStyle={boxStyle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AncientTown;
