import { getHumanStoriesAPI } from '@/apis/human_stories';
import {
  getScenicSpotDetailAPI,
  getSpotTagsAPI,
  getSpotTypeAPI,
  postScenicSpotAPI,
  updateScenicSpotAPI,
} from '@/apis/scenic_spots';
import { CommonForm, Card, SearchAndFilter } from '@/components';
import { useAddSpotForm, usePageList } from '@/hook';
import { deepEqual, delay } from '@/utils';
import { message, Pagination } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

const SpotManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    adminNav = 'spotAdd',
    scenicSpots = [],
    refreshSpotList,
  } = useOutletContext() || {};
  const [messageApi, contextHolder] = message.useMessage();
  // 获取id
  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  // 判断模式:有id，则为编辑模式
  const isEdit = !!id;
  const [editItem, setEditItem] = useState(null);
  console.log('页面路由的id:', id);

  const [spotType, setSpotType] = useState([]);
  const [spotTags, setSpotTags] = useState([]);
  const [humanStories, setHumanStories] = useState([]);
  const [inputValue, setInputValue] = useState('');
  // 多选值状态
  const [selectedValues, setSelectedValues] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const getSpotType = async () => {
      try {
        const res = await getSpotTypeAPI();
        setSpotType(res.data);
      } catch (error) {
        console.error('获取景点类型失败', error);
      }
    };
    const getSpotTags = async () => {
      try {
        const res = await getSpotTagsAPI();
        setSpotTags(res.data);
      } catch (error) {
        console.error('获取景点标签失败', error);
      }
    };
    const getHumanStories = async () => {
      try {
        const res = await getHumanStoriesAPI();
        setHumanStories(res.data);
      } catch (error) {
        console.error('获取人文故事失败', error);
      }
    };

    getSpotType();
    getSpotTags();
    getHumanStories();
  }, []);

  const spotTypeOptions = spotType?.map((item) => ({
    value: item.type_name,
    label: item.type_name,
  }));
  const spotTagsOptions = spotTags?.map((item) => ({
    value: item.tag_name,
    label: item.tag_name,
  }));
  const humanStoriesOptions = humanStories?.map((item) => ({
    value: item.story_id,
    label: item.story_title,
  }));

  const { form, formFields, initialValues } =
    useAddSpotForm({
      addSpot: editItem ? editItem : {},
      spotTypeOptions,
      spotTagsOptions,
      humanStoriesOptions,
    }) || {};

  // 编辑模式需要回显数据
  useEffect(() => {
    if (!isEdit) return;

    const getDetail = async () => {
      const res = await getScenicSpotDetailAPI(id);
      const data = {
        ...res.data[0],
        open_time: dayjs(res.data[0].open_time, 'HH:mm'),
        close_time: dayjs(res.data[0].close_time, 'HH:mm'),
      };

      setEditItem(data);
      form.setFieldsValue(data);
    };

    getDetail();
  }, [id, form, isEdit]);

  // 监听editItem的变化，更新表单
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
    }
  }, [editItem, form]);

  // 处理新增或者编辑按钮点击事件
  const handleAddOrEdit = async () => {
    // 先清理之前的定时器，防止重复调用
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      const values = await form.validateFields();
      const {
        area,
        spot_name,
        open_time,
        close_time,
        ticket_price,
        spot_desc,
      } = values;

      // 处理可以用于接口请求的数据
      const postData = {
        ...values,
        area: Number(area),
        open_time: open_time.format('HH:mm'),
        close_time: close_time.format('HH:mm'),
        is_ticket: ticket_price === 0 ? false : true,
      };

      if (!values) {
        messageApi.error('表单获取失败！请重试！');
        return;
      }

      // 占地面积校验
      if (area <= 0) {
        messageApi.error('占地面积不能小于等于0，请重新输入！');
        return;
      }

      // 新增
      if (!id) {
        try {
          // 判断景点名称是否已有记录
          const isExistedName = scenicSpots.some(
            (item) => item.spot_name === spot_name,
          );
          // console.log('是否存在景点名称相同：', isExistedName);
          if (isExistedName) {
            messageApi.error(
              '该景点名称已存在于数据库中！请确认景点名称是否书写错误！',
            );
            return;
          }

          // 判断描述是否已有记录
          const isDescExisted = scenicSpots.some(
            (item) => item.spot_desc === spot_desc,
          );
          if (isDescExisted) {
            messageApi.error('该描述已有一摸一样的记录，请修改景点的描述！');
            return;
          }

          messageApi.open({
            type: 'loading',
            content: '正在新增中..',
            duration: 0,
          });
          timerRef.current = setTimeout(() => {
            messageApi.destroy();
            timerRef.current = null; // 执行后清空引用
          }, 2000);

          await postScenicSpotAPI(postData);
          // 刷新列表
          await refreshSpotList();

          messageApi.success('新增景点成功！可前往景点列表查看详情！');
          // 清空表单
          form.resetFields();
        } catch (error) {
          console.error('新增景点失败！', error);
          messageApi.error('新增景点失败！请重试！');
          if (error.response?.data) {
            console.error('Supabase 错误详情:', error.response.data);
            // 提示用户具体错误
            messageApi.error(
              `保存失败：${error.response.data.message || '数据格式错误'}`,
            );
          }
        } finally {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            messageApi.destroy(); // 同时销毁消息实例
          }
        }
      }
      // console.log('编辑数据：', editItem);

      // 编辑
      try {
        // 处理editItem中的数据，与表单的数据进行对比，判断是否有修改部分
        const {
          created_time: _created_time,
          spot_id: _spot_id,
          comments: _comments,
          updated_time: _updated_time,
          ...needData
        } = editItem;
        const processData = {
          ...needData,
          open_time: open_time.format('HH:mm'),
          close_time: close_time.format('HH:mm'),
        };

        // 数据改变了，则为 false
        const isContextChange = deepEqual(postData, processData);
        // console.log('isContextChange', isContextChange);
        // console.log('处理后的值postData:', postData);
        // console.log('处理后的数据processData:', processData);
        if (isContextChange) {
          messageApi.info('未发现修改内容，请修改后再保存！');
          return;
        }

        messageApi.open({
          type: 'loading',
          content: '正在保存编辑中..',
          duration: 0,
        });
        timerRef.current = setTimeout(() => {
          messageApi.destroy();
          timerRef.current = null; // 执行后清空引用
        }, 2000);

        await updateScenicSpotAPI(id, postData);
        await refreshSpotList();

        messageApi.success('编辑成功！请前往景点列表查看~');
        navigate('/adminCenter/spotManage');
        setEditItem(null);
        // 刷新页面
        window.location.reload();
        await delay(1000);
      } catch (error) {
        console.error('编辑景点失败！', error);
        messageApi.error('编辑景点失败！请重试！');
        if (error.response?.data) {
          console.error('Supabase 错误详情:', error.response.data);
          // 提示用户具体错误
          messageApi.error(
            `保存失败：${error.response.data.message || '数据格式错误'}`,
          );
        }
      } finally {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          messageApi.destroy(); // 同时销毁消息实例
        }
      }
    } catch (error) {
      console.error('新增或者编辑失败！', error);
      messageApi.error('新增或者编辑失败！请重试！');
      if (error.response?.data) {
        console.error('Supabase 错误详情:', error.response.data);
        // 提示用户具体错误
        messageApi.error(
          `保存失败：${error.response.data.message || '数据格式错误'}`,
        );
      }
    }
  };

  // 搜索和筛选
  const {
    currentPage,
    currentData,
    total,
    setCurrentPage,
    changeFilter,
    setSearchText,
  } = usePageList(
    [...scenicSpots]?.sort((a, b) => b.spot_id - a.spot_id),
    6,
    ['spot_name'],
  );

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    // console.log('当前选中的值：', value);
    setSelectedValues(value);
    changeFilter('spot_type', value); // 筛选 type 字段
  };

  // 下拉菜单 / 搜索框配置
  const heritageListConfig = {
    select: {
      width: 360,
      optionsItem: spotTypeOptions,
      placeholder: '选择景点类型...',
      showSearch: true,
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
    search: {
      placeholder: '搜索景点名称...',
      width: 360,
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value),
      onSearch: (value) => setSearchText(value),
      onClear: () => {
        setInputValue('');
        setSearchText('');
      },
    },
  };

  return (
    <div>
      {contextHolder}
      {/* 新增景点 */}
      {adminNav === 'spotAdd' && (
        <div>
          <div className="text-xl font-semibold">
            {isEdit ? '编辑' : '新增'}景点
          </div>

          {/* 景点新增表单 */}
          <div className="py-8">
            <div className="-translate-x-10">
              <CommonForm
                formType="add"
                form={form}
                maxWidth={1100}
                initialValues={initialValues || {}}
                formFields={formFields || []}
              />
            </div>

            {/* 新增/编辑按钮 */}
            <div className="w-30 mx-auto -translate-x-16">
              <div className="btn2" onClick={handleAddOrEdit}>
                {isEdit ? '保存编辑' : '新增'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 景点列表 */}
      {adminNav === 'spotList' && (
        <div>
          <div className="text-xl font-semibold">景点列表</div>

          {/* 搜索框和筛选框 */}
          <div className="py-4">
            <SearchAndFilter fieldConfig={heritageListConfig} />
          </div>

          {/* 景点列表 */}
          <div className="grid grid-cols-3 gap-y-6 gap-x-10 px-4 py-6">
            {[...currentData]
              .sort((a, b) => b.spot_id - a.spot_id)
              .map((item) => {
                // 组装Card组件需要的数据
                const boxStyle = {
                  width: 'w-[340px]',
                  imgHeight: 'h-[160px]',
                };

                const cardData = {
                  mode: 2,
                  img: item.spot_image,
                  type: item.spot_type,
                  title: item.spot_name,
                  desc: item.spot_desc,
                  tags: item.spot_tags,
                  btn: [3, 4],
                };

                // 删除数据和编辑所需数据
                const deleteAndEditData = {
                  type: 2,
                  id: item.spot_id,
                };

                // 给每个Card传递对象并添加key
                return (
                  <Card
                    key={item.spot_id}
                    boxStyle={boxStyle}
                    cardData={cardData}
                    deleteData={deleteAndEditData}
                    editData={deleteAndEditData}
                    onClick={() =>
                      navigate(`/scenicSpotsDetail/${item.spot_id}`)
                    }
                  />
                );
              })}
          </div>

          {/* 分页组件 */}
          <div className="my-4">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              pageSize={6}
              total={total}
              align="end"
              onChange={(page) => setCurrentPage(page)}
              size="large"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotManage;
