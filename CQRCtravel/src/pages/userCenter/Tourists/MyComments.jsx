import { Empty } from 'antd';

// 评论数据
const comments = [
  // {
  //   comment_id: 2,
  //   tourist_id: 1,
  //   business_type: 2,
  //   business_id: 1,
  //   content: '陶艺体验超棒，老师讲解很耐心',
  //   publish_time: '2026-04-19T13:54:35.026635+00:00',
  //   score: 4.0,
  //   images: null,
  // },
];

const MyComments = () => {
  return (
    <div className="max-w-280 mx-auto border-x-2 border-b-2 border-x-amber-400 border-b-amber-400 rounded-b-xl py-1 px-6">
      <div className="w-full text-xl text-center font-semibold tracking-widest py-4 border my-0 rounded-lg border-amber-500 bg-[#fff7eb]">
        我的评论
      </div>

      {/* 游客的评论 */}
      {comments.length > 0 ? (
        <div></div>
      ) : (
        <Empty
          description="暂未收到评论"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-60"
        />
      )}
    </div>
  );
};

export default MyComments;
