import { Title, Card } from '@/components';
const titleData = {
  title: '行程规划 · 荣昌之旅',
  desc: '根据你的兴趣和时间，定制专属的荣昌深度游行程',
};

const planList = [
  {
    route_id: 1,
    route_type: '古镇非遗',
    route_name: '荣昌一日游：古镇非遗文化之旅',
    route_desc:
      '打卡万灵古镇的明清老街、安陶小镇的千年陶艺与夏布小镇的非遗手作，沉浸式感受荣昌的文化底蕴。',
    route_image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.9frXpqA11-exqOjj1yKRIAHaEq?w=238&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    involved_spots: '万灵古镇、安陶小镇、夏布小镇',
    duration: '1天',
    experience_people: 236,
    score: 4.9,
    recommended_food: '荣昌卤鹅、铺盖面、黄凉粉',
  },
  {
    route_id: 2,
    route_type: '亲子研学',
    route_name: '荣昌亲子研学一日游：非遗体验营',
    route_desc:
      '带孩子走进安陶小镇陶艺工坊、夏布小镇手作课堂，亲手制作荣昌陶和夏布折扇，解锁非遗知识。',
    route_image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.pZBeZr4bIon6NqAlhA-zcgHaEh?w=268&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    involved_spots: '安陶小镇、夏布小镇、荣昌陶博物馆',
    duration: '1天',
    experience_people: 189,
    score: 4.8,
    recommended_food: '荣昌白糕、猪油泡粑、麻哥面',
  },
  {
    route_id: 3,
    route_type: '自然康养',
    route_name: '荣昌古佛山一日游：森林氧吧徒步之旅',
    route_desc:
      '攀登荣昌最高峰古佛山，漫步悬崖栈道，在森林氧吧里深呼吸，登顶俯瞰昌州百里风光。',
    route_image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.kr1jyh2Y6DQ4OebUbIkq7gHaEB?w=296&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    involved_spots: '古佛山景区、百佛园、三圣洞',
    duration: '1天',
    experience_people: 152,
    score: 4.7,
    recommended_food: '农家土鸡、山野菜、凉拌黄凉粉',
  },
  {
    route_id: 4,
    route_type: '美食探店',
    route_name: '荣昌美食打卡一日游：卤鹅与小吃狂欢',
    route_desc:
      '打卡老城百年卤鹅店、老字号铺盖面馆，从早吃到晚，一站式尝遍荣昌特色美食。',
    route_image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.vJS2g4Nx8YVoMku4SQ5jvgHaET?w=246&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    involved_spots: '荣昌老城、百年卤鹅店、老字号面馆',
    duration: '1天',
    experience_people: 312,
    score: 4.9,
    recommended_food: '荣昌卤鹅、铺盖面、黄凉粉、麻哥面、白糕',
  },
  {
    route_id: 5,
    route_type: '古镇慢游',
    route_name: '万灵古镇慢游一日游：水乡风情体验',
    route_desc:
      '漫步万灵古镇的濑溪河畔，乘坐摇橹船欣赏古镇风光，打卡湖广会馆与赵氏宗祠，感受移民水乡的慢生活。',
    route_image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.Rs0rwLOTQB5VAxTnSDZLFQHaF1?w=195&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    involved_spots: '万灵古镇、濑溪河、湖广会馆、提琴博物馆',
    duration: '1天',
    experience_people: 208,
    score: 4.8,
    recommended_food: '古镇卤鹅、河边凉虾、手工米糕',
  },
  {
    route_id: 6,
    route_type: '非遗深度游',
    route_name: '荣昌非遗深度一日游：陶与布的千年对话',
    route_desc:
      '深入安陶小镇了解荣昌陶的制作工艺，走进夏布小镇体验夏布织造，感受两项国家级非遗的魅力。',
    route_image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.p0besHB-qoJYO8I4-FnUjwHaE8?w=300&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    involved_spots: '安陶小镇、荣昌陶博物馆、夏布小镇、夏布博物馆',
    duration: '1天',
    experience_people: 176,
    score: 4.7,
    recommended_food: '荣昌卤鹅、手工豆花、红油抄手',
  },
];

const ItineraryPlanning = () => {
  return (
    <div className="max-w-350 m-auto">
      <Title titleData={titleData} />
      <div className="w-full mx-auto grid grid-cols-3 gap-25 justify-content-stretch mb-25">
        {planList.map((item) => {
          const boxStyle = {
            width: 'w-[400px]',
            imgHeight: 'h-[200px]',
          };

          const cardData = {
            mode: 2,
            img: item.route_image,
            type: item.route_type,
            title: item.route_name,
            desc: item.route_desc,
            score: item.score,
            rate: item.experience_people,
            category: 3, //1：价格-number；2：价格-string；3：已体验人数-number
            content: {
              label: ['行程时长', '涉及景点', '美食体验'],
              contents: [
                `${item.duration}`,
                `${item.involved_spots}`,
                `${item.recommended_food}`,
              ], //若为数字则与相应文字拼接变成字符串
            },
          };

          return (
            <Card key={item.route_id} boxStyle={boxStyle} cardData={cardData} />
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryPlanning;
