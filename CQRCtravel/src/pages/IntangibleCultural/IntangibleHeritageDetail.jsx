import { getHumanStoriesDetailAPI } from '@/apis/human_stories';
import { getIntangibleHeritageDetailAPI } from '@/apis/intangible_heritage';
import {
  CommentSection,
  DialogCommon,
  HighlightKeywords,
  LoadError,
  Loading,
  LoadingSkeleton,
} from '@/components';
import { Button, Card, Image, message, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  PlusOutlined,
  CalendarOutlined,
  StarOutlined,
  StarFilled,
  CheckOutlined,
} from '@ant-design/icons';
import {
  useAddItinerary,
  useFavoriteStatus,
  useIsTourist,
  useReservationForm,
  useReserveConfirm,
} from '@/hook';
import { getCommentsAPI } from '@/apis/comments';
import { getActivitiesAPI } from '@/apis/activities';
import dayjs from 'dayjs';
import { tagsColor } from '@/store';
import { matchRelateActivities } from '@/utils';
import { useSelector } from 'react-redux';

// 非遗描述中需要高亮的词语
const keywords = [
  '荣昌',
  '国家级',
  '省级',
  '市级',
  '县级',
  '传统技艺',
  '民俗',
  '传统音乐',
  '传统舞蹈',
  '非遗',
  '技艺',
  '文化',
  '传承',
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

const IntangibleHeritageDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 获取详情id
  const { id } = useParams();
  // 初始化时给 tags 兜底，避免 undefined.map 报错
  const [heritageData, setHeritageData] = useState({ heritage_tags: [] });
  // 获取关联人文故事
  const [story, setStory] = useState(null);
  // 获取活动列表
  const [activity, setActivity] = useState([]);
  // 获取评论列表
  const [comments, setComments] = useState([]);
  const { touristId: currentUserId } = useSelector((state) => state.user);
  const [messageApi, contextHolder] = message.useMessage();
  const isTourist = useIsTourist();

  // 获取评论列表（复用你原有的逻辑）
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

  // 获取非遗详情和关联人文故事
  useEffect(() => {
    let timer;
    const getHeritageDetail = async () => {
      try {
        setLoading(true);
        const res = await getIntangibleHeritageDetailAPI(id);
        setHeritageData(res.data[0]);
      } catch (error) {
        console.error('获取非遗详情失败', error);
        setError(true);
      } finally {
        timer = setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    const getHumanStory = async () => {
      if (!heritageData?.story_id) {
        setStory(null);
        return;
      }

      try {
        setLoading(true);
        const res = await getHumanStoriesDetailAPI(heritageData.story_id);
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

    getHeritageDetail();
    getHumanStory();
    return () => clearTimeout(timer);
  }, [id, heritageData?.story_id]);

  // 定义字段配置
  const fieldConfigs = [
    { label: '非遗类型', value: heritageData?.heritage_type },
    { label: '非遗等级', value: heritageData?.heritage_level },
    { label: '适合人群', value: heritageData?.suitable_people },
    {
      label: '预约周数',
      value: `提前 ${heritageData?.reserve_weeks} 天`,
    },
    {
      label: '体验时长',
      value: `${heritageData?.experience_duration} 分钟`,
    },
    {
      label: '价格',
      render: () => (
        <>{heritageData?.price ? `￥${heritageData?.price} 元` : '免费体验'}</>
      ),
    },
    { label: '非遗地址', value: heritageData?.heritage_address },
    {
      label: '评分',
      render: () => (
        <>
          {heritageData?.score === 0 ? '暂无评分' : `${heritageData?.score} 分`}
        </>
      ),
    },
  ];

  // 弹窗开关（预约功能）
  const [isShowReservationDialog, setIsShowReservationDialog] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 预约表单数据
  const reservationForm = {
    business_type: 2,
    item_name: heritageData?.heritage_name,
    single_price: heritageData?.price,
  };

  // 弹窗传参数据
  const { form, formFields, initialValues } = useReservationForm(
    reservationForm || {},
  );

  const dialogData = {
    type: 1,
    title: `预约-${heritageData?.heritage_name}`,
    data: {
      formType: 'reservation',
      form,
      maxWidth: 500,
      initialValues,
      formFields,
    },
    width: 750,
  };

  const currentList = matchRelateActivities(
    activity,
    2,
    heritageData.heritage_id,
  );

  const { submitReservation } = useReserveConfirm(messageApi);

  const favoriteData = {
    touristId: currentUserId,
    businessType: 2,
    businessId: heritageData?.heritage_id,
  };
  const reservationData = {
    inheritor_id: heritageData?.inheritor_id,
  };
  // 处理的用于加入行程的数据
  const processData = {
    business_type: 2,
    business_id: heritageData?.heritage_id,
    business_name: heritageData?.heritage_name,
    price: heritageData?.price,
  };
  // 预约表单提交
  const handleReserveConfirm = () =>
    submitReservation(
      form,
      favoriteData,
      reservationData,
      setConfirmLoading,
      setIsShowReservationDialog,
    );

  // 处理时间格式
  const formatDate = (dateStr) => dayjs(dateStr).format('YYYY年MM月DD日 HH:mm');

  // 获取收藏状态
  const {
    isFavorite,
    loading: favLoading,
    handleFavClick,
  } = useFavoriteStatus(
    currentUserId,
    2,
    heritageData?.heritage_id,
    messageApi,
  );

  // 获取加入行程方法
  const {
    isExisted,
    existItem,
    loading: customLoading,
    handleAddItinerary,
  } = useAddItinerary(currentUserId, processData, messageApi);
  const isAddToCustom = isExisted && existItem.is_added_to_custom;

  // 按钮配置
  const btnConfig = [
    {
      title: isAddToCustom ? '已加入行程' : '加入行程',
      color: 'volcano',
      icon: isAddToCustom ? <CheckOutlined /> : <PlusOutlined />,
      onClick: () => handleAddItinerary(),
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

  // 处理的评论列表：对应该非遗项目的评论
  const commentData = comments.filter(
    (item) =>
      item.business_type === 2 &&
      item.business_id === heritageData?.heritage_id,
  );

  // 发表评论
  const handlePublishComment = async (data) => {
    console.log('发表评论：', data);
  };
  // 点赞评论
  const handleLikeComment = async (commentId) => {
    console.log('点赞评论：', commentId);
  };
  // 删除评论
  const handleDeleteComment = async (commentId) => {
    console.log('删除评论：', commentId);
  };
  // 回复评论
  const handleReplyComment = async (commentId, replyContent) => {
    console.log('回复评论：', commentId, replyContent);
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <LoadError />;

  return (
    <div className="max-w-300 h-fit mx-auto py-4 relative">
      {contextHolder}
      <div className="flex gap-4">
        <span>非遗编号：{heritageData?.heritage_id}</span>
        <span className="flex gap-2">
          {heritageData?.heritage_tags?.map((item, index) => (
            <Tag key={index} variant="outlined" color={tagsColor[index]}>
              {item}
            </Tag>
          ))}
        </span>
      </div>

      <div className="px-6">
        <div className="text-4xl font-semibold py-4">
          {heritageData?.heritage_name}
        </div>
        <p className="text-base indent-8">
          {HighlightKeywords(heritageData?.heritage_desc, keywords)}
        </p>

        <div className="w-full py-6 flex justify-center">
          <Image width={600} src={heritageData?.heritage_image} />
        </div>
      </div>

      <div className="text-xl font-semibold my-4">非遗介绍：</div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-gray-700">
        {fieldConfigs.map((field, idx) => (
          <div key={idx} className="p-3 border rounded-lg">
            <span className="font-medium">{field.label}：</span>
            {field.render ? field.render() : field.value}
          </div>
        ))}
      </div>

      {/* 注意事项 */}
      <div className="mt-8 space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-1">注意事项</h3>
          <p className="text-gray-600 indent-4">
            {heritageData?.notice || '暂无信息'}
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

      {/* 评论区（businessType=2 对应非遗） */}
      <div className="px-10">
        <CommentSection
          businessId={heritageData?.heritage_id}
          businessType={2} // 非遗类型为2
          currentUserId={currentUserId}
          commentList={commentData}
          onPublishComment={handlePublishComment}
          onLikeComment={handleLikeComment}
          onDeleteComment={handleDeleteComment}
          onReplyComment={handleReplyComment}
        />
      </div>

      {/* 按钮 */}
      {isTourist && (
        <div className="absolute top-70 -left-20 flex flex-col gap-8">
          {btnConfig.map((item) => (
            <Tooltip title={item.title} key={item.title}>
              {favLoading || customLoading ? (
                <Loading size="small" className="my-1" />
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
    </div>
  );
};

export default IntangibleHeritageDetail;
