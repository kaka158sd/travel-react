import { Tag } from 'antd';
import {
  MedicineBoxOutlined,
  BookOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import CardIcon from './CardIcon';
import CardScore from './CardScore';
import { useState } from 'react';
import { DialogCommon } from '@/components';
import { useReservationForm } from '@/hook/formFields/useReservationForm';

// 设置卡片的宽高、背景色、图片高度
// const boxStyle = {
//   width: 'w-[350px]',
//   height: 'h-[800px]',
//   bgColor: 'bg-slate-100',
//   imgHeight: 'h-[200px]',
// };

// 模型1的数据示例
// const cardData = {
//   mode: 1,
//   iconType: 2, //图标类型：1：没有背景色（如首页卡片）；2：有背景色（如交通卡片）；3：图标在左（如功能卡片）
//   icon: 'icon-hot-for-ux-fill',
//   title: '古镇人文',
//   desc: '结合价洁通用、适合命最优统一单词',
//   content: [
//     'asasasasa阿还差我画荻和丸i好好玩ID好哇i',
//     'ssssssss服务费服务',
//     'ssssssssssss',
//   ],
// };

// 模型2的数据示例
// const cardData = {
//   mode: 2,
//   img: 'https://tse2-mm.cn.bing.net/th/id/OIP-C._sCwb2964-lNV5AVQGHlOwHaFD?w=271&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//   type: '非遗古镇',
//   title: '安陶小镇',
//   desc: '结合价洁通用、适合命最优统一单词结合价洁通用、适合命最优统一单词结合价洁通用、适合命最优统一单词结合价洁通用、适合命最优统一单词结合价洁通用、适合命最优统一单词',
//   tags: ['免费入园', '陶艺体验'],
//   score: 4.8,
//   rate: '10',
//   category: 3, //1：价格-number；2：价格-string；3：已体验人数-number
//   content: {
//     label: ['预约周期', '体验时长', '适合人群'],
//     contents: ['提前2天', '90分钟', '年轻人、亲子年轻人、亲子'], //若为数字则与相应文字拼接变成字符串
//   },
//   btn: [5], //1:行程；2：预约；3：编辑；4：删除；5：收藏（最好按顺序写，因为当第一项为5时不显示1-4按钮）
// };

// 模型3的数据示例
// const cardData = {
//   mode: 3,
//   iconType: 2, //1：游客的数据卡片（没有背景色,图标在上）；2：管理员数据卡片（有背景色,图标在右）
//   iconColor: 0,
//   icon: 'icon-hot-for-ux-fill',
//   title: '待支付',
//   data: 1,
// };

// 传递的reservationForm需要时一个订单的空表单 + 点击的相关数据，一旦提交则生成一个新的order并存入这个用户的订单中
const Card = ({ boxStyle, cardData, onClick, reservationForm }) => {
  const iconfont = [
    {
      icon: cardData.icon, //图标名称
      color: 0, //第几个颜色
      isBgColor: cardData.iconType !== 1, //是否有背景色
    },
    {
      icon: cardData.icon, //图标名称
      color: cardData.iconColor, //第几个颜色
      isBgColor: cardData.iconType !== 1, //是否有背景色
    },
  ];

  const scoreRate = {
    score: cardData.score,
    type: cardData.category, //1：价格-number；2：价格-string；3：已体验人数-number
    rate: cardData.rate, //可放数字-20或者字符串-'20元/碗'
  };

  // 控制弹窗的开关
  const [isShowReservationDialog, setIsShowReservationDialog] = useState(false);

  // 弹窗传参数据
  const { form, formFields, initialValues } = useReservationForm(
    reservationForm || {},
  );

  const dialogData = {
    type: 1,
    title: `预约-${cardData.title}`,
    data: {
      formType: 'reservation',
      form,
      maxWidth: 500,
      initialValues,
      formFields,
    },
    width: 750,
  };

  return (
    <div className={`${boxStyle.width} ${boxStyle.height}`}>
      {/* 模版1：图标、标题、描述（交通卡片有一个具体内容数组） */}
      {cardData.mode === 1 && (
        <div
          onClick={onClick}
          className={`w-full px-5 card-border ${boxStyle.bgColor} ${cardData.iconType === 3 ? 'flex justify-center items-center gap-4 py-2' : 'py-6'}`}
        >
          <CardIcon iconfont={iconfont[0]} />
          <div
            className={`${cardData.iconType === 3 && 'flex flex-col items-center'}`}
          >
            <h3 className="titie-card my-2 line-clamp-1">{cardData.title}</h3>
            <p className="text-slate-600 mb-4 line-clamp-3 desc-style">
              {cardData.desc}
            </p>
            {cardData.content && (
              <ul>
                {cardData.content.map((item, index) => (
                  <li key={index} className="flex items-start mb-2">
                    <i className="iconfont icon-tishifill mr-2 text-[#eaa353]" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* 模版2：图片（类型）、名称、描述、评分价格（景点没有）、标签（景点有）、内容、按钮（有的没有） */}
      {cardData.mode === 2 && (
        <div
          className={`w-full h-full ${boxStyle.bgColor} card-border relative`}
          onClick={onClick}
        >
          {/* 图片（类型） */}
          <div className="w-full h-fit">
            <img
              src={cardData.img ? cardData.img : '@/assets/withoutImage.png'}
              className={`w-full ${boxStyle.imgHeight} object-cover rounded-lg border-img`}
            />
            <div className="absolute top-0 left-0 z-10 mx-2 my-2">
              <Tag color="green">{cardData.type}</Tag>
            </div>
          </div>

          <div className="px-4">
            {/* 名称、描述 */}
            <div className="py-6">
              <h3 className="titie-card my-2 line-clamp-1">{cardData.title}</h3>
              <p className="text-gray-600 line-clamp-2">{cardData.desc}</p>
            </div>

            {/* 标签 */}
            {cardData.tags && (
              <div className="flex">
                {cardData.tags.map((tag) => (
                  <div key={tag} className="mr-2">
                    <Tag color="orange" variant="outlined">
                      {tag}
                    </Tag>
                  </div>
                ))}
              </div>
            )}

            {/* 评分价格 */}
            {cardData.score && <CardScore scoreRate={scoreRate} />}

            {/* 内容 */}
            {cardData.content && (
              <ul>
                {cardData.content.label.map((item, index) => (
                  <li
                    key={index}
                    className="text-gray-600 pt-3 flex items-center"
                  >
                    <i className="iconfont icon-icon text-color1 mr-2" />
                    <p className="line-clamp-1">
                      {item} : {cardData.content.contents[index]}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* 按钮(1:行程；2：预约；3：编辑；4：删除；5：收藏) */}
            {cardData.btn ? (
              <div>
                <div className="flex py-6 gap-4 w-full">
                  {cardData.btn.includes(1) && (
                    <button
                      className="btn2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MedicineBoxOutlined className="mr-2" />
                      加入行程
                    </button>
                  )}

                  {cardData.btn.includes(2) && (
                    <button
                      className="btn2"
                      onClick={(e) => {
                        // 阻止事件冒泡到父级卡片
                        e.stopPropagation();
                        setIsShowReservationDialog(true);
                      }}
                    >
                      <BookOutlined className="mr-2" />
                      立即预约
                    </button>
                  )}

                  {cardData.btn.includes(3) && (
                    <button
                      className="btn2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <FormOutlined className="mr-2" />
                      编辑
                    </button>
                  )}

                  {cardData.btn.includes(4) && (
                    <button
                      className="btn2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <DeleteOutlined className="mr-2 text-base" />
                      删除
                    </button>
                  )}

                  {cardData.btn.includes(5) && (
                    <button
                      className="absolute top-0 right-0 z-20 mx-3 my-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* 未收藏 */}
                      <i
                        className="iconfont icon-favorite text-color1 visibility"
                        style={{ fontSize: '24px' }}
                      />

                      {/* 已收藏 */}
                      {/* <i
                        className="iconfont icon-favorite-filling text-color1"
                        style={{ fontSize: '24px' }}
                      /> */}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <br />
            )}
          </div>
        </div>
      )}

      {/* 立即预约弹窗 */}
      <DialogCommon
        isShowDialog={isShowReservationDialog}
        onCancel={() => {
          setIsShowReservationDialog(false);
        }}
        dialogData={dialogData}
        onOk={() => setIsShowReservationDialog(false)}
      />

      {/* 模版3：图标、标题、数据（游客的卡片数据为0时不显示data） */}
      {cardData.mode === 3 && (
        <div
          onClick={onClick}
          className={`w-full ${boxStyle.bgColor} ${boxStyle.padding ? boxStyle.padding : 'px-5 py-2'} card-border flex items-center ${cardData.iconType === 1 ? 'flex-col' : 'flex-row-reverse justify-between'}`}
        >
          <CardIcon iconfont={iconfont[1]} />
          <div
            className={`flex flex-col ${cardData.iconType === 1 && 'items-center'} ${boxStyle.gap ? boxStyle.gap : ''}`}
          >
            <h3 className="titie-card my-1 line-clamp-1">{cardData.title}</h3>
            {cardData.iconType === 1 && cardData.data <= 0 ? (
              <></>
            ) : (
              <span className="titie-card">{cardData.data}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
