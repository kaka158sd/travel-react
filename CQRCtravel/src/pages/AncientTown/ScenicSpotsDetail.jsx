import { getActivitiesAPI } from '@/apis/activities';
import { getHumanStoriesDetailAPI } from '@/apis/human_stories';
import { getScenicSpotDetailAPI } from '@/apis/scenic_spots';
import {
  CommentSection,
  DialogCommon,
  HighlightKeywords,
  LoadError,
  Loading,
  LoadingSkeleton,
} from '@/components';
import { Button, Card, Image, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  PlusOutlined,
  CalendarOutlined,
  StarOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  useFavoriteStatus,
  useReservationForm,
  useReserveConfirm,
} from '@/hook';
import { getCommentsAPI } from '@/apis/comments';
import { tagsColor } from '@/store';
import { matchRelateActivities } from '@/utils';
import { useSelector } from 'react-redux';

// 景点描述中需要高亮的词语
const keywords = [
  '千年古镇',
  '宋代',
  '明清',
  '川渝',
  '最具代表性',
  '红色教育基地',
  '红色精神',
  '国家级',
  '非遗',
  '夏布',
  '三大名陶',
  '非遗技艺',
  '天然氧吧',
  '哥特式',
  '中西文化',
  '山间古刹',
  '宗教文化',
  '城市生态',
  '宜居风貌',
];

// 活动列表中需要的高亮词语
const activitiesKeywords = [
  '荣昌',
  '汉服',
  '古镇',
  '传统',
  '国家级',
  '非遗',
  '自然风光',
  '寺庙景观',
  '亲子露营活动',
];

const ScenicSpotsDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 获取详情id
  const { id } = useParams();
  const [spotData, setSpotData] = useState({ spot_tags: [] });
  // 获取人文故事
  const [story, setStory] = useState(null);
  // 获取活动列表
  const [activity, setActivity] = useState([]);
  // 获取评论列表
  const [comments, setComments] = useState([]);
  const { touristId: currentUserId } = useSelector((state) => state.user);

  useEffect(() => {
    let timer;
    const getActivitiesList = async () => {
      try {
        setLoading(true);
        const res = await getActivitiesAPI();
        setActivity(res.data);
      } catch (error) {
        console.error('获取活动列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    const getCommentsList = async () => {
      try {
        setLoading(true);
        const res = await getCommentsAPI();
        setComments(res.data);
      } catch (error) {
        console.error('获取评论列表失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    getActivitiesList();
    getCommentsList();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    const getScenicSpotDetail = async () => {
      try {
        setLoading(true);
        const res = await getScenicSpotDetailAPI(id);
        setSpotData(res.data[0]);
      } catch (error) {
        console.error('获取景点详情失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    const getHumanStory = async () => {
      if (!spotData?.story_id) {
        setStory(null);
        return;
      }

      try {
        setLoading(true);
        const res = await getHumanStoriesDetailAPI(spotData.story_id);
        setStory(res.data[0]);
      } catch (error) {
        console.error('获取人文故事详情失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    getScenicSpotDetail();
    getHumanStory();
    return () => clearTimeout(timer);
  }, [id, spotData?.story_id]);

  // 定义字段配置
  const fieldConfigs = [
    { label: '景点类型', value: spotData?.spot_type },
    { label: '景点等级', value: spotData?.spot_star },
    { label: '开放状态', value: spotData?.open_status },
    {
      label: '门票价格',
      render: () => (
        <>
          {spotData?.ticket_price ? `￥${spotData?.ticket_price} 元` : '免费'}
        </>
      ),
    },
    {
      label: '开放时间',
      render: () => (
        <>
          {spotData?.open_time?.slice(0, 5)} -{' '}
          {spotData?.close_time?.slice(0, 5)}
        </>
      ),
    },
    { label: '景点地址', value: spotData?.spot_address },
    { label: '占地面积', value: `${spotData?.area} ㎡` },
    { label: '评分', value: `${spotData?.score} 分` },
  ];

  const currentList = matchRelateActivities(activity, 1, spotData.spot_id);

  // 处理时间格式
  const formatDate = (dateStr) => dayjs(dateStr).format('YYYY年MM月DD日 HH:mm');

  // 弹窗开关
  const [isShowReservationDialog, setIsShowReservationDialog] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 预约表单
  const reservationForm = {
    item_name: spotData.spot_name,
    single_price: spotData.ticket_price,
  };

  // 弹窗传参数据
  const { form, formFields, initialValues } = useReservationForm(
    reservationForm || {},
  );

  const dialogData = {
    type: 1,
    title: `预约-${spotData.spot_name}`,
    data: {
      formType: 'reservation',
      form,
      maxWidth: 500,
      initialValues,
      formFields,
    },
    width: 750,
  };

  const { submitReservation, reserveContextHolder } = useReserveConfirm();

  const favoriteData = {
    touristId: currentUserId,
    businessType: 1,
    businessId: spotData?.spot_id,
  };
  const reservationData = {};
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
  const {
    isFavorite,
    loading: favLoading,
    handleFavClick,
    contextHolder,
  } = useFavoriteStatus(currentUserId, 1, spotData?.spot_id);

  // 按钮配置
  const btnConfig = [
    {
      title: '加入行程',
      color: 'volcano',
      icon: <PlusOutlined />,
      icon2: <CheckOutlined />,
    },
    {
      title: '立即预约',
      color: 'blue',
      icon: <CalendarOutlined />,
      onClick: () => setIsShowReservationDialog(true),
    },
    {
      title: isFavorite ? '已收藏' : '收藏',
      color: 'gold',
      icon: isFavorite ? <StarFilled /> : <StarOutlined />,
      onClick: () => handleFavClick(),
    },
  ];

  // 处理的评论列表：对应该景点的评论
  const commentData = comments.filter(
    (item) => item.business_type === 1 && item.business_id === spotData.spot_id,
  );

  // 发表评论
  const handlePublishComment = async (data) => {
    // 调用你的发表评论API，data格式：
    // { business_id, business_type, content, score, images }
    console.log('发表评论：', data);
    // 刷新评论列表
  };
  // 点赞评论
  const handleLikeComment = async (commentId) => {
    console.log('点赞评论：', commentId);
  };
  // 删除评论
  const handleDeleteComment = async (commentId) => {
    console.log('删除评论：', commentId);
    // 刷新评论列表
  };
  // 回复评论
  const handleReplyComment = async (commentId, replyContent) => {
    console.log('回复评论：', commentId, replyContent);
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <LoadError />;

  return (
    <div className="max-w-300 h-fit mx-auto py-4 relative">
      <div className="flex gap-4">
        <span>景点编号：{spotData?.spot_id}</span>
        <span className="flex gap-2">
          {spotData?.spot_tags.map((item, index) => (
            <Tag key={index} variant="outlined" color={tagsColor[index]}>
              {item}
            </Tag>
          ))}
        </span>
      </div>

      <div className="px-6">
        <div className="text-4xl font-semibold py-4">{spotData?.spot_name}</div>
        <p className="text-base indent-8">
          {HighlightKeywords(spotData?.spot_desc, keywords)}
        </p>

        <div className="w-full py-6 flex justify-center">
          <Image width={600} src={spotData?.spot_image} />
        </div>
      </div>

      <div className="text-xl font-semibold my-4">景点介绍：</div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-gray-700">
        {fieldConfigs.map((field, idx) => (
          <div key={idx} className="p-3 border rounded-lg">
            <span className="font-medium">{field.label}：</span>
            {field.render ? field.render() : field.value}
          </div>
        ))}
      </div>

      {/* 交通 + 注意事项 */}
      <div className="mt-8 space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-1">交通指南</h3>
          <p className="text-gray-600 indent-4">
            {spotData?.traffic_guide || '暂无信息'}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-1">注意事项</h3>
          <p className="text-gray-600 indent-4">
            {spotData?.notice || '暂无信息'}
          </p>
        </div>
      </div>

      {/* 关联的人文故事 */}
      {story && (
        <div className="my-6">
          <div className="text-xl font-semibold py-4">
            关联的人文故事 - {story?.story_title}
          </div>
          <p className="indent-8">{story?.story_desc}</p>
        </div>
      )}

      {/* 相关活动 */}
      {currentList.length > 0 && (
        <div>
          <div className="text-xl font-semibold my-4">相关活动</div>
          {currentList.map((item) => (
            <div key={item.activity_id}>
              <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">
                      活动名称：
                    </span>
                    {item.activity_name}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      活动地址：
                    </span>
                    {item.address}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">主办方：</span>
                    {item.sponsor}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      活动时间：
                    </span>
                    {formatDate(item.start_time)} - {formatDate(item.end_time)}
                  </div>
                </div>

                <div className="my-3">
                  <h3 className="text-lg font-semibold mb-2">活动详情</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {HighlightKeywords(item.activity_desc, activitiesKeywords)}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h4 className="text-amber-800 font-medium mb-1">
                    ⚠️ 注意事项
                  </h4>
                  <p className="text-amber-700">{item.notice}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* 评论区 */}
      <div className="px-10">
        <CommentSection
          businessId={spotData?.spot_id}
          businessType={1} // 景点类型为1
          currentUserId={currentUserId}
          commentList={commentData}
          onPublishComment={handlePublishComment}
          onLikeComment={handleLikeComment}
          onDeleteComment={handleDeleteComment}
          onReplyComment={handleReplyComment}
        />
      </div>

      {/* 按钮 */}
      <div className="absolute top-70 -left-40 flex flex-col gap-8">
        {contextHolder}

        {btnConfig.map((item) => (
          <Tooltip title={item.title} key={item.title}>
            {favLoading ? (
              <Loading size="small" className="my-2" />
            ) : (
              <Button
                variant="solid"
                color={item.color}
                shape="circle"
                icon={item.icon}
                size="large"
                onClick={item.onClick}
              />
            )}
          </Tooltip>
        ))}
      </div>

      {reserveContextHolder}
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
    </div>
  );
};

export default ScenicSpotsDetail;
