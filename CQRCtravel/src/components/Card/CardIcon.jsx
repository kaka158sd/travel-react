const color = ['#d97706', '#349c3d', '#F76560', '#3491FA']; //图标颜色
const bgColor = ['#fbf1e6', '#AFF0B5', '#FDCDC5', '#C3E7FE']; //背景颜色

const CardIcon = ({ iconfont }) => {
  return (
    <div>
      {/* 有无背景色 + 颜色 */}
      {iconfont.isBgColor ? (
        // 有背景色
        <div
          className="w-12.5 h-12.5 rounded flex items-center justify-center"
          style={{ backgroundColor: bgColor[iconfont.color] }}
        >
          <i
            className={`iconfont ${iconfont.icon}`}
            style={{ fontSize: 28 + 'px', color: color[iconfont.color] }}
          />
        </div>
      ) : (
        // 无背景色
        <div className="w-12.5 h-12.5 rounded flex items-center justify-center">
          <i
            className={`iconfont ${iconfont.icon}`}
            style={{ fontSize: 34 + 'px', color: color[iconfont.color] }}
          />
        </div>
      )}
    </div>
  );
};

export default CardIcon;
