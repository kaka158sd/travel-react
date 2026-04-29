import { Flex } from 'antd';
import './index.less';
import { Card } from '@/components';
import { useNavigate } from 'react-router-dom';

// 设置卡片的宽高、背景色、图片高度
const boxStyle = {
  width: 'w-[440px]',
  bgColor: 'bg-white',
};

const cardList = [
  {
    path: '/ancient-town',
    icon: 'icon-jingdian',
    title: '古镇人文',
    desc: '万灵古镇、安陶小镇、夏布小镇，三大古镇承载千年移民文化与非遗传承',
  },
  {
    path: '/intangible-cultural',
    icon: 'icon-agriculture',
    title: '非遗体验',
    desc: '荣昌陶、夏布、折扇三大国家级非遗，可亲手参与制作，感受匠人精神',
  },
  {
    path: '/food-exploration',
    icon: 'icon-yingyangke',
    title: '特色美食',
    desc: '百年卤鹅、手工铺盖面、盘龙黄凉粉，每道美食都是荣昌文化的味觉表达',
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="w-full h-180 bg-color p-30 flex justify-between">
        <div className="w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            荣昌深度游
          </h1>
          <div className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-amber-100">
            古镇非遗 <span className="mx-2">•</span> 美食秘境
          </div>
          <p className="mt-8 max-w-3xl text-lg sm:text-xl text-gray-100 leading-relaxed">
            探索中国四大名陶之乡，品味百年卤鹅鲜香，感受夏布纺织的千年传承，让旅行从走马观花变为沉浸式体验
          </p>
          <div className="mt-10 flex gap-6">
            <button className="px-16 py-4 bg-amber-600 text-white font-medium text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <a href="/itinerary-planning">行程规划</a>
            </button>
            <button className="px-16 py-4 bg-white/90 text-amber-600 border-2 border-amber-600 font-medium text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <a href="/practical-tips">实用贴士</a>
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="-translate-x-70 -translate-y-28">
            <i
              className="iconfont icon-yangguang flex items-center justify-center text-[#e5993b] animate-spin"
              style={{
                fontSize: 200 + 'px',
                animation: 'spin 3s linear infinite',
              }}
            />
          </div>
          <i
            className="iconfont icon-dujia -translate-y-80"
            style={{ fontSize: 500 + 'px', color: '#5eba65', opacity: 0.7 }}
          />
        </div>
      </div>

      <div className="px-28 mb-20">
        <div className="titie1">荣昌核心亮点</div>
        <Flex justify="space-between">
          {cardList.map((cardData, index) => (
            <Card
              key={index}
              boxStyle={boxStyle}
              cardData={{ ...cardData, mode: 1, iconType: 1 }}
              onClick={() => handleCardClick(cardData.path)}
            />
          ))}
        </Flex>
      </div>
    </div>
  );
};

export default Home;
