const CardScore = ({ scoreRate }) => {
  return (
    <div className="w-full">
      {/* 评分 */}
      <div className="flex justify-between">
        <div className="flex items-center">
          {scoreRate.score !== 0 && (
            <i className="iconfont icon-favorite-filling text-amber-500 mr-0.5" />
          )}
          <span>
            {scoreRate.score === 0 ? '暂无评分' : `${scoreRate.score} 分`}
          </span>
        </div>
        {/* 价格-number + string / 已体验人数-number */}
        <div>
          {/* 非遗价格-number */}
          {scoreRate.type === 1 && (
            <div className="text-color1 font-semibold">
              ￥{scoreRate.rate}/人
            </div>
          )}

          {/* 价格-string */}
          {scoreRate.type === 2 && (
            <div className="text-color1 font-semibold">￥{scoreRate.rate}</div>
          )}

          {/* 已体验人数 */}
          {scoreRate.type === 3 && (
            <div className="text-neutral-500">（{scoreRate.rate}人已体验）</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardScore;
