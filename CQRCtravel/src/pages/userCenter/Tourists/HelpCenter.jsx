import { Tabs, Collapse, Pagination, Space } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import './index.less';
import { useState } from 'react';
import { usePageList } from '@/hook';
import { SearchAndFilter } from '@/components';

// 全部问题列表
const questionsList = [
  // ========== 一、订单模块 10条 ==========
  {
    key: '1',
    label: '我的订单',
    children:
      '可集中查看平台所有景点门票、非遗体验、行程套餐、文创周边全部订单；可按全部、待支付、已支付、已取消筛选。若找不到历史订单，先确认是否切换登录账号，退出重新登录即可刷新列表。',
  },
  {
    key: '2',
    label: '待支付订单',
    children:
      '下单后系统保留15分钟支付时效，超时未付款订单自动关闭。若想继续购买可重新下单；若误下单不想支付，无需操作等待自动取消即可，不影响账号信用。',
  },
  {
    key: '3',
    label: '已支付订单',
    children:
      '可查看已付款订单详情、入园二维码、预约凭证、使用有效期。若支付成功但不显示订单，先刷新页面、检查登录账号，仍异常可清除缓存重新进入。',
  },
  {
    key: '4',
    label: '已取消订单',
    children:
      '包含用户手动取消和系统超时自动取消的所有记录。已取消订单无法恢复再次支付，如需同款产品需重新下单；取消后款项会按原支付渠道原路退回。',
  },
  {
    key: '5',
    label: '景点门票订单',
    children:
      '记录所有单人票、套票、联票购买记录，标注入园时间、检票方式、退改规则。到园无法检票时，检查是否过期、是否选错园区，核对身份证或二维码是否清晰。',
  },
  {
    key: '6',
    label: '非遗项目订单',
    children:
      '展示非遗手工体验、民俗演出、匠人授课等预约订单，包含体验时间、地点、预约名额。临时无法到场可提前申请取消，逾期未签到视为自动放弃名额不予退款。',
  },
  {
    key: '7',
    label: '订单退款记录',
    children:
      '可查看全部退款申请、审核中、退款成功、审核驳回状态。退款驳回多因超出可退时限、已核销使用；正常审核1-3个工作日原路退回，银行卡到账会比微信支付宝稍慢。',
  },
  {
    key: '8',
    label: '订单评价管理',
    children:
      '已完成游玩或体验的订单可进行文字评分、上传实拍图。若无法评价，多为订单未完成核销或超出评价时限；评价提交后不可恶意修改，违规评价会被系统隐藏。',
  },
  {
    key: '9',
    label: '订单发票申请',
    children:
      '已支付且未开票订单可在线申请电子发票，填写抬头、税号、邮箱即可。提交后1-3个工作日发送至邮箱；信息填写错误可撤销重新申请，已开具发票无法更改。',
  },
  {
    key: '10',
    label: '订单常见问题',
    children:
      '常见问题：下单成功无订单、支付成功无法入园、退款一直不到账、重复下单。解决：切换登录账号、刷新缓存、核对预约时间、避开高峰期操作，仍异常可联系人工客服核验订单号处理。',
  },

  // ========== 二、支付模块 10条 ==========
  {
    key: '11',
    label: '支付方式管理',
    children:
      '平台支持微信、支付宝主流支付渠道，无需绑定银行卡留存信息。若支付按钮无法点击，检查网络是否通畅、关闭浏览器拦截插件，切换支付渠道重试即可。',
  },
  {
    key: '12',
    label: '景点门票支付',
    children:
      '门票下单后在线付款，付款即刻生成电子入园凭证。支付卡住不要重复点击，避免重复扣款；若重复扣费，系统会自动多扣原路退回，也可提交订单号人工核对。',
  },
  {
    key: '13',
    label: '非遗项目支付',
    children:
      '非遗体验需支付锁定名额，付款成功才算预约生效。未支付不保留名额；临时取消需在体验日前24小时操作，超时取消不予退费，可转让同行亲友使用名额。',
  },
  {
    key: '14',
    label: '支付记录查询',
    children:
      '留存每一笔支付时间、金额、订单用途、支付渠道。找不到某笔记录，可按时间区间筛选、核对是否使用其他账号支付，也可查看微信/支付宝账单对照核验。',
  },
  {
    key: '15',
    label: '支付安全设置',
    children:
      '平台全程加密传输，不储存支付密码与银行卡隐私。建议开启手机账号绑定，陌生设备下单需短信验证；勿在公共WiFi下进行大额支付，防止信息泄露。',
  },
  {
    key: '16',
    label: '退款进度查询',
    children:
      '提交退款后可实时查看审核进度。一直显示审核中属于正常排队，1-7个工作日内处理完毕；超过7天未到账，保留订单号与支付账单联系客服人工跟进。',
  },
  {
    key: '17',
    label: '优惠券与支付',
    children:
      '下单支付可自动匹配可用优惠券，满减、立减券仅限指定产品使用。券无法抵扣时，查看有效期、使用范围、是否限新用户；过期券自动失效，可参与活动领取新券。',
  },
  {
    key: '18',
    label: '支付失败处理',
    children:
      '支付失败常见原因：账户余额不足、银行卡限额、网络中断、账号风控。解决：充值余额、修改银行卡限额、切换网络、稍后间隔几分钟重新提交付款。',
  },
  {
    key: '19',
    label: '第三方支付说明',
    children:
      '仅调用微信、支付宝官方正规接口，平台不获取你的支付密码与账户隐私。跳转支付失败，需检查是否安装对应APP、开启网页跳转权限，关闭隐私拦截模式。',
  },
  {
    key: '20',
    label: '支付限额说明',
    children:
      '单笔、单日支付限额由微信、支付宝或银行卡自身规则限制。超出限额可拆分订单分笔支付、更换支付方式，或在对应支付APP内提升限额额度。',
  },

  // ========== 三、收藏模块 10条 ==========
  {
    key: '21',
    label: '我的收藏',
    children:
      '统一归集收藏的景点、非遗项目、特色美食、行程方案，分类展示便于快速查找。收藏内容不显示时，退出账号重新登录、刷新页面，云端即可同步恢复数据。',
  },
  {
    key: '22',
    label: '收藏的景点',
    children:
      '可收藏任意景区、网红打卡点，保存简介、地址、票价、开放时间。想取消收藏进入详情页再次点击收藏按钮即可；批量整理可进入收藏列表批量取消。',
  },
  {
    key: '23',
    label: '收藏的非遗项目',
    children:
      '收藏非遗手工、民俗表演、传统技艺体验项目，方便后期预约下单。收藏后项目下架不会自动删除，仍可查看历史介绍，只是无法再预约报名。',
  },
  {
    key: '24',
    label: '收藏的美食',
    children:
      '收录本地特色小吃、老字号餐厅、网红美食店铺，附带位置、人均、推荐菜品。旅行途中可直接定位导航，收藏过多可按分类清理无效内容。',
  },
  {
    key: '25',
    label: '收藏的行程规划',
    children:
      '可收藏平台官方推荐精品行程路线，随时查看行程天数、景点排布、交通方案。收藏的行程支持一键复刻为自己的规划，二次编辑修改出行时间。',
  },
  {
    key: '26',
    label: '收藏夹管理',
    children:
      '支持新建分类收藏夹，把景点、美食、行程分开归类。可重命名、删除空收藏夹，删除收藏夹不会删除已收藏内容，仅清空分组归类关系。',
  },
  {
    key: '27',
    label: '收藏同步设置',
    children:
      '登录同一账号多设备自动云端同步收藏数据。换手机或电脑登录看不到收藏，开启账号自动同步、允许网页缓存，关闭无痕模式即可正常加载。',
  },
  {
    key: '28',
    label: '收藏过期提醒',
    children:
      '限时活动景点、季节性非遗项目会自动时效提醒。收到提醒可及时预约或规划出行；已过期收藏仍可保留查看介绍，不再支持优惠购票与预约。',
  },
  {
    key: '29',
    label: '取消收藏记录',
    children:
      '取消收藏仅从列表移除，不影响账号任何权限与数据。误取消想恢复，重新进入对应景点或项目详情页再次点击收藏即可一键找回。',
  },
  {
    key: '30',
    label: '收藏常见问题',
    children:
      '常见问题：点击收藏无反应、收藏后不显示、换设备收藏丢失、无法批量取消。解决：清理浏览器缓存、登录同一账号、关闭拦截插件、单个重新收藏同步即可。',
  },

  // ========== 四、账户模块 10条 ==========
  {
    key: '31',
    label: '账户基本信息',
    children:
      '可编辑头像、昵称、个性简介，维护个人公开展示资料。修改信息保存无反应，检查是否含敏感词汇、头像图片过大，压缩图片或更换昵称即可提交成功。',
  },
  {
    key: '32',
    label: '账户安全设置',
    children:
      '支持修改登录密码、更换绑定手机号、开启异地登录提醒。忘记密码可通过手机号验证码重置；手机号停用无法接收验证码，联系客服核验身份更换绑定。',
  },
  {
    key: '33',
    label: '实名认证',
    children:
      '购买实名门票、预约非遗体验必须完成实名，一人一证绑定。实名信息填写错误未提交可直接修改；已提交审核中不可更改，需等待审核结果后重新申请。',
  },
  {
    key: '34',
    label: '收货地址管理',
    children:
      '用于文创产品、旅游纪念品实物配送，可新增、编辑、设默认、删除地址。下单选错地址可在付款前切换默认地址，已下单无法自行修改需联系客服备注。',
  },
  {
    key: '35',
    label: '消息通知设置',
    children:
      '可开关订单推送、退款提醒、行程通知、活动优惠、系统公告。收不到消息提醒，检查浏览器通知权限、手机消息拦截，关闭免打扰模式即可正常接收。',
  },
  {
    key: '36',
    label: '隐私设置',
    children:
      '可设置行程公开、收藏公开、个人资料是否对外展示。不想他人查看旅行轨迹，设为仅自己可见即可；设置即时生效，随时可重新切换权限。',
  },
  {
    key: '37',
    label: '账户绑定管理',
    children:
      '支持微信快捷登录绑定，绑定后可一键免密进入平台。想解绑进入账户安全页操作即可，解绑后不会清空订单与收藏数据，仅关闭快捷登录方式。',
  },
  {
    key: '38',
    label: '积分与会员',
    children:
      '下单消费、发布评价、分享行程均可累计积分，积分可兑换优惠券、文创礼品。积分未到账，等待24小时系统自动结算，仍未到账可提交记录人工补登。',
  },
  {
    key: '39',
    label: '账户注销申请',
    children:
      '注销前需清空待处理订单、无未退款账务、解绑第三方账号。注销后所有订单、收藏、行程、个人资料永久清空无法恢复，谨慎操作。',
  },
  {
    key: '40',
    label: '账户常见问题',
    children:
      '常见问题：登录失败、账号被盗、收不到验证码、昵称无法修改、异地无法登录。解决：核对账号密码、更换网络、解除手机号拦截、按安全提示完成验证，异常账号立即修改密码并绑定手机。',
  },

  // ========== 五、行程模块 10条 ==========
  {
    key: '41',
    label: '我的行程',
    children:
      '汇总平台推荐行程、自己自定义规划、已购买套餐行程，按出行时间排序。新建行程不保存、列表不显示，规划完成务必点击保存按钮，退出前确认存入云端。',
  },
  {
    key: '42',
    label: '已购买的行程方案',
    children:
      '包含精品多日游、一日游套餐详情，每日景点安排、交通建议、用餐推荐。行程时间无法按时出行，可查看退改规则，在允许时间内申请改期或退款。',
  },
  {
    key: '43',
    label: '自定义行程规划',
    children:
      '可自选出行天数、游玩主题、偏好景点，系统自动生成路线；支持手动增删景点、调整游玩顺序、预留休息时间。生成路线不合理可重新重置参数再次规划。',
  },
  {
    key: '44',
    label: '行程方案收藏',
    children:
      '看好的官方行程可一键收藏，便于后续参考、复刻或直接购买。收藏的行程下架后仍可查看原有路线，只是无法再下单购买套餐。',
  },
  {
    key: '45',
    label: '行程编辑与修改',
    children:
      '已保存的自定义行程可随时改日期、换景点、调整停留时长。编辑后务必重新保存，直接退出不会自动生效；误改内容可放弃编辑恢复原方案。',
  },
  {
    key: '46',
    label: '行程分享功能',
    children:
      '可生成行程海报、分享链接发给亲友，对方可查看完整路线并复刻自用。分享链接失效多为行程已删除，重新保存行程再生成分享即可。',
  },
  {
    key: '47',
    label: '行程提醒设置',
    children:
      '可开启出发提醒、景点预约提醒、天气预警提醒。到时间未收到提醒，检查消息通知权限、是否关闭该行程单独提醒设置，重新开启即可。',
  },
  {
    key: '48',
    label: '行程地图导航',
    children:
      '行程所有景点自动串联在地图上，显示距离、游玩顺序、交通方式。定位不准可手动刷新位置，切换地图图层查看路况与步行驾车路线。',
  },
  {
    key: '49',
    label: '行程评价反馈',
    children:
      '体验完成后可对官方行程路线、景点安排、合理性进行评价建议。提交反馈后平台会迭代优化路线，提交后不可删除，仅可补充追加评价。',
  },
  {
    key: '50',
    label: '行程规划常见问题',
    children:
      '常见问题：无法生成行程、添加景点失败、保存后丢失、路线绕路不合理、分享打不开。解决：更换网络重新加载、减少单日景点数量、规划后立即保存、重新生成路线再分享即可。',
  },
];

// 底部客服反馈内容items
const serveItems = [
  {
    icon: <PhoneOutlined className="text-3xl text-color1" />,
    title: '客服电话',
    context: '400-123-4567',
  },
  {
    icon: (
      <i
        className="iconfont icon-iconfontfuwushichang text-color1"
        style={{ fontSize: 30 }}
      />
    ),
    title: '在线客服',
    context: '工作日 9:00-20:00',
  },
  {
    icon: (
      <i className="iconfont icon-mail text-color1" style={{ fontSize: 32 }} />
    ),
    title: '邮箱反馈',
    context: 'support@rongchuang.com',
  },
];

// 折叠面板通用样式
const collapseStyle = (list) => {
  return (
    <Collapse
      items={list}
      defaultActiveKey={['1']}
      bordered={false}
      size="large"
      style={{
        width: 1120,
        borderTop: '1px solid #d9d9d9',
        borderBottom: '1px solid #d9d9d9',
      }}
      expandIconPlacement="end"
    />
  );
};

// 各个标签的原始数据
const dataList = {
  all: questionsList,
  order: questionsList.slice(0, 10),
  pay: questionsList.slice(10, 20),
  favorite: questionsList.slice(20, 30),
  account: questionsList.slice(30, 40),
  itinerary: questionsList.slice(40, 50),
};

const HelpCenter = () => {
  // 当前的tab标签和页面数据列表
  const [currentDataList, setCurrentDataList] = useState(questionsList || []);

  const [inputValue, setInputValue] = useState('');

  // 搜索和筛选
  const { currentPage, currentData, total, setCurrentPage, setSearchText } =
    usePageList(currentDataList, 10, ['label', 'children']);

  // 下拉菜单 / 搜索框配置
  const searchConfig = {
    search: {
      placeholder: '请输入您的问题...',
      width: 500,
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  // 问题标签配置
  const tabItems = [
    {
      key: 'all',
      label: '全部问题',
      children: collapseStyle(currentData),
    },
    {
      key: 'order',
      label: '订单相关',
      children: collapseStyle(currentData),
    },
    {
      key: 'pay',
      label: '支付相关',
      children: collapseStyle(currentData),
    },
    {
      key: 'favorite',
      label: '收藏相关',
      children: collapseStyle(currentData),
    },
    {
      key: 'account',
      label: '账户相关',
      children: collapseStyle(currentData),
    },
    {
      key: 'itinerary',
      label: '行程相关',
      children: collapseStyle(currentData),
    },
  ];

  return (
    <div className="max-w-300 h-fit flex flex-col justify-center items-center shadow-2xl mx-auto py-10">
      <div className="text-2xl font-semibold">帮助中心</div>
      <p className="py-3">为您解答使用过程中遇到的常见问题</p>

      {/* 搜索框 */}
      <div>
        <SearchAndFilter fieldConfig={searchConfig} />
      </div>

      {/* 问题展示:顶部标签和分页 */}
      <div className="w-full px-8 mb-16">
        <Space orientation="vertical" size="medium">
          <Tabs
            defaultActiveKey="all"
            items={tabItems}
            onChange={(key) => {
              setCurrentDataList(dataList[key]);
            }}
            size="large"
          />
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={10}
            total={total}
            align="end"
            onChange={(page) => setCurrentPage(page)}
          />
        </Space>
      </div>

      <div className=" bg-[#fef7ed] rounded-lg flex gap-50 px-27 py-8">
        {serveItems.map((item) => (
          <div className="flex items-center gap-4" key={item.title}>
            {item.icon}
            <div>
              <p className="text-gray-500">{item.title}</p>
              <p>{item.context}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
