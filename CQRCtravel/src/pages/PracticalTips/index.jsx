import { Title, Card, LookMore } from '@/components';
import {
  CalendarOutlined,
  ProfileOutlined,
  BellOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import './index.less';
import { Flex, Carousel, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getNewsAPI } from '@/apis/news';
import dayjs from 'dayjs';

const titleData = {
  title: '实用贴士 · 出行无忧',
  desc: '为你的荣昌之旅提供全方位的实用信息，让旅行更加便捷、舒适',
};

const trafficList = [
  {
    trafficName: '飞机',
    trafficIcon: 'icon-chunvzuo',
    trafficDesc: '可乘坐飞机抵达重庆江北国际机场，再转乘交通前往荣昌',
    trafficContent: [
      '重庆江北国际机场 → 荣昌区，全程约110公里',
      '机场大巴直达荣昌，车程约1.5小时',
      '机场网约车/出租车直达，车程约1小时20分钟',
      '机场换乘高铁至荣昌北站，全程约1小时',
    ],
  },
  {
    trafficName: '高铁/动车',
    trafficIcon: 'icon-tianhezuo',
    trafficDesc: '成渝高铁贯穿荣昌，是最快捷的出行方式',
    trafficContent: [
      '重庆北站/重庆西站 → 荣昌北站，最快28分钟',
      '成都东站 → 荣昌北站，最快1小时10分钟',
      '荣昌北站有公交、出租车直达城区各景点',
      '高铁班次密集，日均发车30+趟次',
    ],
  },
  {
    trafficName: '长途汽车',
    trafficIcon: 'icon-tianchengzuo',
    trafficDesc: '省内外多地可乘坐长途客车直达荣昌城区',
    trafficContent: [
      '重庆主城各大汽车站 → 荣昌汽车站，约1.5小时',
      '泸州、内江、自贡等周边城市直达荣昌，1-2小时',
      '荣昌汽车站位于城区中心，换乘便利',
      '支持线上购票，班次稳定',
    ],
  },
  {
    trafficName: '城区公交',
    trafficIcon: 'icon-jinniuzuo',
    trafficDesc: '荣昌城区公交覆盖景点、商圈、居民区，出行经济实惠',
    trafficContent: [
      '可直达万灵古镇、夏布小镇、安陶小镇等景区',
      '票价2元/人，支持扫码支付',
      '运营时间：6:00-22:00，班次间隔10-15分钟',
      '多条线路串联高铁站与汽车站',
    ],
  },
  {
    trafficName: '出租车/网约车',
    trafficIcon: 'icon-muyangzuo',
    trafficDesc: '灵活便捷，适合短途出行、景点直达、夜间出行',
    trafficContent: [
      '起步价8元，城区内短途费用较低',
      '荣昌北站 → 城区中心，约10元',
      '城区 → 万灵古镇，约25-35元',
      '24小时运营，扫码叫车方便快捷',
    ],
  },
  {
    trafficName: '自驾',
    trafficIcon: 'icon-meishi',
    trafficDesc: '自驾前往荣昌路线通畅，高速直达，适合家庭出游',
    trafficContent: [
      '重庆主城 → 荣昌：渝蓉高速直达，约1小时',
      '成都 → 荣昌：成渝高速，约2.5小时',
      '景区配套停车场充足，停车便利',
      '适合自由规划行程，灵活游览各景点',
    ],
  },
];

const hotelList = [
  {
    hotel_id: 1,
    hotel_type: '豪华型',
    hotel_name: '荣昌瑞尔大酒店',
    hotel_desc:
      '荣昌首家五星级标准酒店，地理位置优越，设施齐全，服务周到，是商务出行和高端旅游的理想选择。',
    hotel_image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.TiBXt3fJ6br3lOLmd4zVtgHaFj?w=240&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    score: 4.8,
    price_range: '450-800/晚',
    address: '荣昌区昌元街道广场路1号',
    phone: '023-46738888',
  },
  {
    hotel_id: 2,
    hotel_type: '舒适型',
    hotel_name: '维也纳国际酒店（荣昌高铁北站店）',
    hotel_desc:
      '位于荣昌高铁北站站前广场，交通便利，装修典雅舒适，配备健康美食、高性价比客房，适合差旅与旅游入住。',
    hotel_image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.tpAlIhjSSZTWeUmsy5F7MgHaE8?w=270&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    score: 4.7,
    price_range: '220-400/晚',
    address: '荣昌区高顺路9号',
    phone: '023-46237999',
  },
  {
    hotel_id: 3,
    hotel_type: '经济型',
    hotel_name: '尚客优品酒店（荣昌夏布小镇店）',
    hotel_desc:
      '紧邻夏布小镇与濑溪河，步行可达昌州故里，交通网络发达，环境简约舒适，是体验荣昌慢生活的高性价比之选。',
    hotel_image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.c3kr-RYujqakcqn7BnVeJgHaFj?w=240&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    score: 4.6,
    price_range: '160-300/晚',
    address: '荣昌区昌元街道海棠北路88号',
    phone: '023-46781888',
  },
  {
    hotel_id: 4,
    hotel_type: '精品民宿',
    hotel_name: '荣见·尊享民宿',
    hotel_desc:
      '全新配置的精品民宿，临近夏布小镇与万灵古镇，81㎡两室两厅，全屋空调，停车方便，适合家庭出游或结伴旅行。',
    hotel_image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.k_xbAtTix2dlPEcX72FsNgHaE4?w=267&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    score: 4.9,
    price_range: '200-350/晚',
    address: '荣昌区体育馆附近',
    phone: '138XXXX1234',
  },
];

const { Text } = Typography;

const PracticalTips = () => {
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

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  // 新增一个控制淡入的状态
  const [isFading, setIsFading] = useState(true);
  // 创建轮播的 ref
  const carouselRef = useRef(null);

  // 将新闻按时间排序
  const sortNewsList = useMemo(() => {
    if (!newsList.length) return [];
    return [...newsList].sort(
      (a, b) =>
        new Date(b.publish_time).getTime() - new Date(a.publish_time).getTime(),
    );
  }, [newsList]);

  const newsSevenList = sortNewsList.slice(0, 7);

  // 监听轮播切换，更新索引
  const handleCarouselChange = (index) => {
    setCurrentNewsIndex(index);
    setIsFading(true); // 淡入新内容
  };

  // 点击右侧的行为并切换
  const handleUpdateNews = (index) => {
    // 先淡出文字
    setIsFading(false);
    // 调用 goTo 方法，直接切换到指定索引
    carouselRef.current?.goTo(index);

    // 等待淡出完成，再更新索引
    const timer = setTimeout(() => {
      setCurrentNewsIndex(index);
      setIsFading(true); // 淡入新内容
    }, 100);

    return () => clearTimeout(timer);
  };

  return (
    <div className="max-w-350 m-auto">
      <Title titleData={titleData} />

      <p className="titie1">交通指南</p>
      <div className="w-full mx-auto grid grid-cols-3 gap-20 justify-content-stretch mb-25 pl-8">
        {trafficList.map((item) => {
          const boxStyle = {
            width: 'w-[400px]',
            height: 'h-[341px]',
          };

          const cardData = {
            mode: 1,
            iconType: 2, //图标类型：1：没有背景色（如首页卡片）；2：有背景色（如交通卡片）；3：图标在左（如功能卡片）
            icon: item.trafficIcon,
            title: item.trafficName,
            desc: item.trafficDesc,
            content: item.trafficContent,
          };

          return (
            <Card
              key={item.trafficName}
              boxStyle={boxStyle}
              cardData={cardData}
            />
          );
        })}
      </div>

      <p className="titie1">住宿推荐</p>
      <div className="w-full mx-auto grid grid-cols-4 gap-20 justify-content-stretch mb-25">
        {hotelList.map((item) => {
          const boxStyle = {
            width: 'w-[300px]',
            imgHeight: 'h-[200px]',
          };

          const cardData = {
            mode: 2,
            img: item.hotel_image,
            type: item.hotel_type,
            title: item.hotel_name,
            desc: item.hotel_desc,
            score: item.score,
            rate: item.price_range,
            category: 2, //1：价格-number；2：价格-string；3：已体验人数-number
            content: {
              label: ['地址', '电话'],
              contents: [`${item.address}`, `${item.phone}`], //若为数字则与相应文字拼接变成字符串
            },
          };

          return (
            <Card key={item.hotel_id} boxStyle={boxStyle} cardData={cardData} />
          );
        })}
      </div>

      <p className="titie1">新闻公告</p>
      <LookMore path="/news_Page" />
      <div className="w-full h-140 flex justify-between border border-amber-500 px-8 rounded-2xl py-4">
        {/* 图片 + 标题 + 描述（显示2行） */}
        <div className="w-154 pt-12 pb-6 overflow-hidden rounded-xl">
          <Carousel
            arrows
            effect="fade"
            autoplay={true}
            infinite={true}
            speed={700}
            ref={carouselRef}
            beforeChange={() => setIsFading(false)}
            afterChange={handleCarouselChange}
          >
            {newsSevenList.map((item) => (
              <div className="rounded-xl" key={item.news_id}>
                <img
                  src={item.news_image}
                  className="w-full h-87.5 rounded-xl object-cover"
                />
              </div>
            ))}
          </Carousel>

          {/* 新闻标题和描述，随图片更换 */}
          <div
            className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-100' : 'opacity-0'}`}
          >
            <h3 className="title2 mt-6">
              {newsSevenList[currentNewsIndex]?.news_title}
            </h3>
            <p className="line-clamp-2 py-2">
              {newsSevenList[currentNewsIndex]?.news_content}
            </p>
          </div>
        </div>

        {/* 导航栏（发布时间 + 标题） */}
        <div>
          <div className="w-full h-fit mx-auto py-4 flex items-center gap-5">
            <SoundOutlined
              style={{
                fontSize: '30px',
                color: '#d97706',
                transform: 'rotate(-30deg)',
              }}
            />
            <p className="text-xl font-semibold">荣昌文旅最新公告</p>
          </div>

          {/* 新闻展示区，点击更换左侧轮播图和文字内容 */}
          <div className="w-150 h-105 border border-orange-200 bg-amber-50 rounded-xl">
            {newsSevenList.map((item, index) => (
              <Text
                key={item?.news_id}
                onClick={() => handleUpdateNews(index)}
                className={`h-15 flex gap-3 items-center ${index === newsSevenList.length - 1 ? '' : 'border-b border-orange-200'} p-4 text-hover`}
              >
                <i className="iconfont icon-RectangleCopy text-color1 pt-0.75" />
                {dayjs(item?.publish_time).format('YY-MM-DD')}
                <span></span>
                {item?.news_title}
              </Text>
            ))}
          </div>
        </div>
      </div>

      <p className="titie1">旅行建议</p>
      <div className="flex justify-between">
        {/* <!-- 最佳旅行时间卡片 --> */}
        <div className="card-border2 guide-card p-5">
          <Flex gap="small">
            <CalendarOutlined style={{ color: '#d97706', fontSize: '18px' }} />
            <h4 className="card-title">最佳旅行时间</h4>
          </Flex>
          <ul className="guide-list pt-4">
            <li className="mt-4 text-gray-800 tracking-widest">
              <span className="font-extrabold">春季（3-5月）</span>
              ：气温温暖宜人，万物复苏，是游览古镇、欣赏自然风光的好时节。此时荣昌的油菜花、桃花、海棠花等花卉盛开，万灵古镇濑溪河畔花海连片，风景优美；4月还可参与荣昌陶文化节，体验陶艺制作。
            </li>
            <li className="mt-2 text-gray-800 tracking-widest">
              <span className="font-extrabold">秋季（9-11月）</span>
              ：秋高气爽，气候宜人，是旅行的黄金季节。此时荣昌的农作物成熟，稻田金黄，能体验到丰收的喜悦；9-10月夏布小镇会举办夏布文化展，可沉浸式体验非遗文化；11月古佛山的红叶漫山，适合徒步赏景。
            </li>
            <li className="mt-2 text-gray-800 tracking-widest">
              <span className="font-extrabold">注意事项</span>
              ：夏季（6-8月）炎热多雨，气温较高（日均28-35℃），需注意防暑降温、携带雨具；冬季（12-2月）寒冷干燥，气温较低（日均5-12℃），需注意保暖；节假日（春节/国庆）游客较多，建议提前预订住宿和规划行程。
            </li>
          </ul>
        </div>

        {/* <!-- 旅行必备物品卡片 --> */}
        <div className="card-border2 guide-card  p-5">
          <Flex gap="small">
            <ProfileOutlined style={{ color: '#d97706', fontSize: '18px' }} />
            <h4 className="card-title">旅行必备物品</h4>
          </Flex>
          <ul className="guide-list pt-4">
            <li className="mt-4 text-gray-800 tracking-widest">
              <span className="font-extrabold">证件类</span>
              ：身份证、护照等证件；学生证、老年证（部分景区可享优惠）
            </li>
            <li className="mt-3 text-gray-800 tracking-widest">
              <span className="font-extrabold">财物类</span>
              ：现金、银行卡（部分小店仅支持现金）；手机支付软件（主流支付方式）
            </li>
            <li className="mt-3 text-gray-800 tracking-widest">
              <span className="font-extrabold">电子类</span>
              ：手机、相机、充电器、充电宝（拍照/导航必备）；耳机、自拍杆
            </li>
            <li className="mt-3 text-gray-800 tracking-widest">
              <span className="font-extrabold">防护类</span>
              ：防晒霜、太阳镜、帽子（春季/秋季紫外线较强）；口罩、消毒湿巾
            </li>
            <li className="mt-3 text-gray-800 tracking-widest">
              <span className="font-extrabold">衣物类</span>
              ：换洗衣物、舒适的鞋子（古镇游览需步行）；根据季节携带薄外套/厚外套
            </li>
            <li className="mt-3 text-gray-800 tracking-widest">
              <span className="font-extrabold">药品类</span>
              ：常用药品（感冒药、肠胃药、晕车药）；创可贴、驱蚊液（户外出行备用）
            </li>
            <li className="mt-3 text-gray-800 tracking-widest">
              <span className="font-extrabold">其他</span>
              ：雨具、驱蚊液、旅行攻略/地图；保温杯（荣昌部分古镇有特色茶饮可冲泡）
            </li>
          </ul>
        </div>
      </div>

      {/* <!-- 注意事项大卡片 --> */}
      <div className="notice-card my-16">
        <Flex gap="small">
          <BellOutlined style={{ color: '#d97706', fontSize: '18px' }} />
          <h4 className="card-title">注意事项</h4>
        </Flex>
        <div className="notice-content">
          {/* <!-- 文化礼仪 --> */}
          <div className="notice-column">
            <h3>文化礼仪</h3>
            <ul>
              <li>尊重当地风俗习惯，进入寺庙等场所时注意着装得体</li>
              <li>在古镇游览时，不要随意触摸古建筑和文物</li>
              <li>与当地人交流时，注意使用礼貌用语</li>
              <li>拍摄当地居民前建议提前沟通，尊重他人隐私</li>
              <li>体验非遗制作（陶艺/夏布）时，遵守工坊操作规范</li>
            </ul>
          </div>

          {/* <!-- 安全建议 --> */}
          <div className="notice-column">
            <h3>安全建议</h3>
            <ul>
              <li>保管好个人财物，特别是在人多拥挤的景点和交通工具上</li>
              <li>注意饮食卫生，选择正规餐厅就餐，避免食用生冷食物</li>
              <li>在景区游览时，遵守景区规定，不要擅自离开游览路线</li>
              <li>户外活动时，注意天气变化，避免在恶劣天气外出</li>
              <li>自驾出行前检查车况，遵守交通规则，不酒后驾车</li>
            </ul>
          </div>

          {/* <!-- 其他提示 --> */}
          <div className="notice-column">
            <h3>其他提示</h3>
            <ul>
              <li>提前了解荣昌的天气情况，做好相应准备（如夏季备雨具）</li>
              <li>可以提前下载离线地图，方便在信号弱的区域导航</li>
              <li>
                品尝美食时，可以多尝试当地特色小吃，但注意适量，避免肠胃不适
              </li>
              <li>购买特产时，建议选择正规店铺，注意辨别商品真伪和保质期</li>
              <li>景区内部分路段台阶较多，老人/小孩需有人陪同，注意脚下安全</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalTips;
