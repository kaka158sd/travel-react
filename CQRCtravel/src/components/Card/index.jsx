import { message, Tag, Spin } from 'antd';
import {
  MedicineBoxOutlined,
  BookOutlined,
  FormOutlined,
  DeleteOutlined,
  CarryOutOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import CardIcon from './CardIcon';
import CardScore from './CardScore';
import { useState } from 'react';
import { DialogCommon, Loading } from '@/components';
import {
  useReservationForm,
  useFavoriteStatus,
  useReserveConfirm,
  useAddItinerary,
} from '@/hook';
import {
  deleteIntangibleHeritageAPI,
  getIntangibleHeritageAPI,
} from '@/apis/intangible_heritage';
import { useDispatch } from 'react-redux';
import { setHeritage } from '@/store';
import { useNavigate } from 'react-router-dom';

// 传递的reservationForm需要时一个订单的空表单 + 点击的相关数据，一旦提交则生成一个新的order并存入这个用户的订单中
const Card = ({
  boxStyle,
  cardData,
  onClick,
  reservationForm,
  favoriteData = {},
  reservationData = {},
  processData = {},
  deleteData = {},
  editData = {},
}) => {
  // 图标配置
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

  // 评分配置
  const scoreRate = {
    score: cardData.score,
    type: cardData.category, //1：价格-number；2：价格-string；3：已体验人数-number
    rate: cardData.rate, //可放数字-20或者字符串-'20元/碗'
  };

  // 控制弹窗的开关
  const [isShowReservationDialog, setIsShowReservationDialog] = useState(false);
  // 控制提交按钮的异步关闭
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 全局消息
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 预约弹窗传参数据
  const { form, formFields, initialValues } = useReservationForm(
    reservationForm || {},
  );

  // 预约弹窗数据
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

  const { submitReservation } = useReserveConfirm(messageApi);

  // 预约表单提交
  const handleReserveConfirm = () =>
    submitReservation(
      form,
      favoriteData,
      reservationData,
      setConfirmLoading,
      setIsShowReservationDialog,
    );

  // 获取收藏状态
  const { isFavorite, loading, handleFavClick } = useFavoriteStatus(
    favoriteData?.touristId,
    favoriteData?.businessType,
    favoriteData?.businessId,
    messageApi,
  );

  // 获取项目与行程的数据
  const {
    isExisted,
    existItem,
    loading: customLoading,
    handleAddItinerary,
  } = useAddItinerary(favoriteData?.touristId, processData, messageApi);

  // 处理删除按钮点击事件
  const handleBtnDelete = async () => {
    if (!deleteData.id) {
      messageApi.error('未获取需要删除的卡片，请重试！');
      return;
    }

    try {
      const confirm = window.confirm('是否要删除点击的传承项目？');

      // 删除非遗
      if (deleteData.type === 1 && confirm) {
        try {
          await deleteIntangibleHeritageAPI(deleteData.id);
          const res = await getIntangibleHeritageAPI();
          dispatch(setHeritage(res.data));

          messageApi.success('删除成功！');
        } catch (error) {
          console.error('删除非遗请求失败！', error);
          messageApi.error('删除非遗请求失败！');
        }
      }
    } catch (error) {
      console.error('删除失败！', error);
      messageApi.error('删除失败！');
    }
  };

  // 处理编辑按钮点击事件
  const handleBtnEdit = async () => {
    if (!editData.id) {
      messageApi.error('未获取需要编辑的数据，请重试！');
      return;
    }

    try {
      // 非遗编辑
      if (editData.type === 1) {
        // 跳转至传承项目管理页面（默认是新增/编辑页面）
        navigate(`/inheritorCenter/heritageManage?id=${editData.id}`);
      }
    } catch (error) {
      console.error('编辑失败！', error);
    }
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
            {(cardData.score || cardData.score === 0) && (
              <CardScore scoreRate={scoreRate} />
            )}

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
                {contextHolder}
                <div className="flex py-6 gap-4 w-full">
                  {cardData.btn.includes(1) && (
                    <button
                      className="btn2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItinerary();
                      }}
                    >
                      {customLoading ? (
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                        />
                      ) : isExisted && existItem.is_added_to_custom ? (
                        <>
                          <CarryOutOutlined className="mr-2" />
                          已加入行程
                        </>
                      ) : (
                        <>
                          <MedicineBoxOutlined className="mr-2" />
                          加入行程
                        </>
                      )}
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
                        handleBtnEdit();
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
                        handleBtnDelete();
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
                      {loading ? (
                        <Loading size="small" className="my-8" />
                      ) : (
                        <div>
                          <i
                            className={`iconfont ${isFavorite ? 'icon-favorite-filling' : 'icon-favorite visibility'}  text-color1`}
                            style={{ fontSize: '24px' }}
                            onClick={async () => handleFavClick()}
                          />
                        </div>
                      )}
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
          form.resetFields();
          setIsShowReservationDialog(false);
        }}
        dialogData={dialogData}
        onOk={handleReserveConfirm}
        confirmLoading={confirmLoading}
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
