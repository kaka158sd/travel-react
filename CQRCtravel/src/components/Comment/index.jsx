import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Image,
  message,
  Input,
  Rate,
  Divider,
  App,
} from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getTouristsAPI, getUsersAPI } from '@/apis/users';
import { defaultAvatar } from '@/store';
import { DataField } from '..';

const { TextArea } = Input;

// 上传框的配置
const formConfig = {
  name: 'upload',
  listType: 1,
};

// 单个评论项
const CommentItem = ({ comment, currentUserId, onLike, onDelete, onReply }) => {
  const [tourists, setTourists] = useState([]);
  const [users, setUsers] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { modal } = App.useApp();

  // 获取游客列表
  useEffect(() => {
    const getTouristsList = async () => {
      try {
        const res = await getTouristsAPI();
        setTourists(res.data);
      } catch (error) {
        console.error('获取游客列表失败', error);
      }
    };
    const getUsersList = async () => {
      try {
        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (error) {
        console.error('获取用户列表失败', error);
      }
    };

    getTouristsList();
    getUsersList();
  }, []);

  // 获取当前评论区的游客列表
  const currentTourist = useMemo(() => {
    const tourist = tourists.find(
      (item) => item.tourist_id === comment.tourist_id,
    );
    return tourist || {};
  }, [comment.tourist_id, tourists]);
  const currentUser = useMemo(() => {
    const user =
      users.find((item) => item.user_id === currentTourist.user_id) || {};
    return user || {};
  }, [currentTourist.user_id, users]);

  // 处理回复提交
  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }
    onReply(comment.comment_id, replyContent);
    setReplyContent('');
    setShowReplyInput(false);
    message.success('回复成功');
  };

  //处理删除确认
  const handleDeleteClick = () => {
    modal.confirm({
      title: '确认删除评论？',
      content: '删除后评论将无法恢复',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => onDelete(comment.comment_id),
    });
  };

  return (
    <div className="border-b border-gray-100 py-3">
      {/* 1. 游客头像 + 昵称 + 星级 */}
      <div className="flex items-center gap-3 mb-2">
        <Avatar src={currentUser?.avatar || defaultAvatar} size={58} />
        <div>
          <div className="font-medium">
            {currentUser?.user_name || '匿名用户'}
          </div>
          <Rate
            disabled
            value={comment.score}
            size="small"
            className="text-yellow-400 text-xs mt-1"
          />
        </div>
      </div>

      {/* 2. 评论内容 */}
      <div className="pl-12 text-gray-700 mb-2 indent-2">{comment.content}</div>

      {/* 3. 评论配图（数组） */}
      {comment.images?.filter(Boolean).length > 0 && (
        <div className="pl-12 flex gap-2 flex-wrap mb-2">
          <Image.PreviewGroup>
            {comment.images.filter(Boolean).map((img, i) => (
              <Image key={i} src={img} width={120} height={120} />
            ))}
          </Image.PreviewGroup>
        </div>
      )}

      {/* 4. 操作区：时间、点赞、回复、删除、跳转 */}
      <div className="pl-12 text-xs text-gray-400 flex items-center gap-4">
        {/* 发布时间格式化 */}
        <span>{dayjs(comment.publish_time).format('YYYY-MM-DD HH:mm')}</span>

        {/* 点赞 */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => onLike(comment.comment_id)}
        >
          {comment.is_liked ? (
            <LikeFilled className="text-red-500" />
          ) : (
            <LikeOutlined />
          )}
          {comment.like_count || 0}
        </div>

        {/* 回复 */}
        <div
          className="flex items-center gap-1 cursor-pointer mr-6"
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          <MessageOutlined />
          回复
        </div>

        {/* 删除：仅本人可见 */}
        {comment.tourist_id === currentUserId && (
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleDeleteClick}
          >
            删除
          </Button>
        )}
      </div>

      {/* 回复输入框 */}
      {showReplyInput && (
        <div className="pl-12 mt-3">
          <TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={2}
            placeholder="写下你的回复..."
            className="mb-2"
          />
          <div className="flex gap-4 justify-end py-2">
            <Button size="small" onClick={() => setShowReplyInput(false)}>
              取消
            </Button>
            <Button size="small" type="primary" onClick={handleReplySubmit}>
              提交回复
            </Button>
          </div>
        </div>
      )}

      {/* 回复列表（如果你的数据包含回复字段） */}
      {comment.replys?.length > 0 && (
        <div className="mt-3 ml-2 border-l-2 border-gray-100 pl-3">
          {comment.replys.map((reply) => (
            <div key={reply.reply_id} className="py-2 text-sm">
              <div className="text-blue-600 font-medium">
                {reply.reply_nickname}：
              </div>
              <div className="text-gray-600">{reply.reply_content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {dayjs(reply.publish_time).format('MM-DD HH:mm')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 发表评论组件
const CommentPublish = ({ businessId, businessType, onSubmit }) => {
  const [content, setContent] = useState('');
  const [score, setScore] = useState(5);
  const [images, setImages] = useState([]);
  const [uploadValue, setUploadValue] = useState(null);

  const handlePublish = () => {
    if (!content.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    // 提交数据格式完全匹配数据库字段
    onSubmit({
      business_id: businessId,
      business_type: businessType,
      content,
      score,
      images,
    });
    // 重置表单
    setContent('');
    setScore(5);
    setImages([]);
    message.success('评论发表成功');
  };

  // 上传框处理时间
  const uploadOnChange = () => {};

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      {/* 上传框，评论的图片上传 */}
      <div className="py-4">
        <DataField
          type="upload"
          value={uploadValue}
          onChange={uploadOnChange}
          formConfig={formConfig}
        />
      </div>

      <div className="flex items-center mb-2">
        <span className="mr-3">评分：</span>
        <Rate value={score} onChange={setScore} />
      </div>

      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="分享你的游玩体验～"
        className="mb-3"
      />

      <div className="flex justify-end py-4">
        <Button type="primary" onClick={handlePublish}>
          发表评论
        </Button>
      </div>
    </div>
  );
};

// 评论区总组件
const CommentSection = ({
  businessId, // 当前景点/活动ID（对应 business_id）
  businessType, // 项目类型：1=景点，2=非遗体验（对应 business_type）
  currentUserId, // 当前登录游客ID（对应 tourist_id）
  commentList, // 评论列表
  onPublishComment, // 发表评论回调
  onLikeComment, // 点赞评论回调
  onDeleteComment, // 删除评论回调
  onReplyComment, // 回复评论回调
}) => {
  return (
    <div className="w-full mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">评论区</h2>

      {/* 发表评论 */}
      <CommentPublish
        businessId={businessId}
        businessType={businessType}
        onSubmit={onPublishComment}
      />

      <Divider />

      {/* 评论列表 */}
      <div>
        {commentList.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            暂无评论，快来发表第一条评论吧～
          </div>
        ) : (
          commentList.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              currentUserId={currentUserId}
              onLike={onLikeComment}
              onDelete={onDeleteComment}
              onReply={onReplyComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
