import { getDetailNewItems } from '@/utils';
import { ConfigProvider, Divider, message, Pagination } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DialogCommon, SearchAndFilter } from '@/components';
import { useAddNewsForm, usePageList } from '@/hook';
import { useOutletContext } from 'react-router-dom';
import { deleteNewsAPI, postNewsAPI } from '@/apis/news';

const NewsManage = () => {
  const {
    news = [],
    currentUser = {},
    userPrivacyData = {},
    refreshNews,
  } = useOutletContext() || {};
  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1); //1：详情；2：新增；
  const [dialogItem, setDialogItem] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const timerRef = useRef(null); // 用 ref 保存定时器ID
  const [inputValue, setInputValue] = useState('');

  const addNew = {
    publisher: currentUser.user_name,
    publish_unit: userPrivacyData.department,
  };

  // 获取新闻新增表单
  const { form, formFields, initialValues } = useAddNewsForm({
    addNew: addNew || {},
  });

  useEffect(() => {
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const dialogData = useMemo(() => {
    if (dialogType === 1) {
      const items = getDetailNewItems(dialogItem);
      return {
        type: 3,
        items,
        title: dialogItem.news_title,
        width: 1000,
      };
    } else if (dialogType === 2) {
      return {
        type: 1,
        title: '新增新闻公告',
        data: {
          formType: 'add',
          form,
          initialValues,
          formFields,
        },
        width: 800,
      };
    }

    return {
      type: 3,
      items: [],
      title: '',
    };
  }, [dialogItem, dialogType, form, formFields, initialValues]);

  // 按 publish_time 时间戳从新到旧排序
  const sortedNewsList = useMemo(() => {
    if (!news.length) return [];
    return [...news]
      .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
      .map((item) => {
        return {
          ...item,
          publish_time: dayjs(item.publish_time).format('YYYY-MM-DD'),
        };
      });
  }, [news]);

  // 点击打开详情弹窗事件
  const handleOpenDialog = (item) => {
    setDialogType(1);
    setDialogItem(item);
    setIsShowDialog(true);
  };

  // 新增弹窗提交事件
  const handleAddConfiem = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      console.log('表单的值：', values);

      // 标题是否已有记录
      const isExisted = news.some(
        (item) => item.news_title === values.news_title,
      );
      if (isExisted) {
        messageApi.error('新闻标题已存在，请重新填写！');
        return;
      }

      await postNewsAPI(values);
      await refreshNews();

      messageApi.success('发表成功！');
    } catch (error) {
      console.error('新增新闻公告失败！', error);
      messageApi.error('新增新闻公告失败！');
    } finally {
      setIsShowDialog(false);
      setConfirmLoading(false);
    }
  };

  // 新闻删除事件
  const handleDeleteNews = async (id) => {
    // 先清理之前的定时器，防止重复调用
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!id) {
      messageApi.error('获取需要删除新闻的id错误，请重试！');
      return;
    }

    try {
      const confirm = window.confirm('是否要删除该新闻？');

      if (confirm) {
        messageApi.open({
          type: 'loading',
          content: '正在删除中..',
          duration: 0,
        });
        timerRef.current = setTimeout(() => {
          messageApi.destroy();
          timerRef.current = null; // 执行后清空引用
        }, 2000);

        await deleteNewsAPI(id);
        await refreshNews();

        messageApi.success('下架新闻成功！');
      }
    } catch (error) {
      console.error('删除新闻失败！', error);
      messageApi.error('删除新闻失败！');
    } finally {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        messageApi.destroy(); // 同时销毁消息实例
      }
    }
  };

  // 搜索和筛选
  const { currentPage, currentData, total, setCurrentPage, setSearchText } =
    usePageList(sortedNewsList, 8, ['news_title']);

  // 下拉菜单 / 搜索框配置
  const newsConfig = {
    search: {
      placeholder: '搜索新闻标题...',
      width: 460,
      value: inputValue,
      size: 'large',
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorSplit: '#c2c2c2',
        },
      }}
    >
      <div className="text-xl font-semibold">新闻管理</div>
      {contextHolder}
      <div className="flex justify-between py-4">
        {/* 搜索框和筛选框 */}
        <div className="ml-6">
          <SearchAndFilter fieldConfig={newsConfig} />
        </div>

        {/* 新增按钮 */}
        <div className="w-22">
          <div
            className="btn2"
            onClick={() => {
              form.resetFields();
              setDialogType(2);
              setIsShowDialog(true);
            }}
          >
            新增
          </div>
        </div>
      </div>

      {/* 新闻列表,需要分页 */}
      <div className="pr-12 pl-6">
        <div className="w-full border border-slate-200 rounded-xl shadow shadow-amber-300">
          {[...currentData]
            .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
            .map((item) => (
              <div key={item.news_id}>
                <div className="text-base flex items-center justify-between px-4 py-2">
                  <div
                    onClick={() => handleOpenDialog(item)}
                    className="hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer"
                  >
                    {item.publish_time}&emsp;{item.news_title}
                  </div>
                  <i
                    className="iconfont icon-close cursor-pointer hover:text-orange-500 hover:scale-115"
                    style={{ fontSize: 22 }}
                    onClick={() => handleDeleteNews(item.news_id)}
                  />
                </div>
                <Divider size="small" />
              </div>
            ))}
        </div>
      </div>

      {/* 分页组件 */}
      <div className="my-4">
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          pageSize={8}
          total={total}
          align="end"
          onChange={(page) => setCurrentPage(page)}
          size="large"
        />
      </div>

      {/* 新闻弹窗 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        dialogData={dialogData}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsShowDialog(false);
          setDialogItem({});
        }}
        onOk={handleAddConfiem}
      />
    </ConfigProvider>
  );
};

export default NewsManage;
