import {
  getIntangibleHeritageDetailAPI,
  postIntangibleHeritageAPI,
  updateIntangibleHeritageAPI,
} from '@/apis/intangible_heritage';
import { Card, CommonForm, NoData, SearchAndFilter } from '@/components';
import { useAddHeritageForm, usePageList } from '@/hook';
import { compareHeritageLevel, deepEqual, delay } from '@/utils';
import { message, Pagination } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

const HeritageManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    inheritorNav = '/inheritorCenter/heritageManage/heritageAdd',
    heritageTypeOptions = [],
    heritageTagsOptions = [],
    humanStoriesOptions = [],
    myHeritageList = [],
    inheritorId = 0,
    userPrivacyData = {},
    heritage = [],
    getIntangibleHeritageList,
  } = useOutletContext() || {};

  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  // console.log('页面路由中是否有id：', id);

  // 判断模式
  const isEdit = !!id; // 有 id = 编辑模式

  const [messageApi, contextHolder] = message.useMessage();
  const [editItem, setEditItem] = useState(null);

  const [inputValue, setInputValue] = useState('');
  // 多选值状态
  const [selectedValues, setSelectedValues] = useState([]);
  const timerRef = useRef(null);

  // 传承项目表单
  const { form, formFields, initialValues } = useAddHeritageForm({
    addHeritage: editItem ? editItem : {},
    heritageTypeOptions,
    heritageTagsOptions,
    humanStoriesOptions,
  });

  // 如果是编辑 → 请求详情回显
  useEffect(() => {
    if (!isEdit) return; // 新增模式直接跳过

    const getDetail = async () => {
      // 请求详情接口
      const res = await getIntangibleHeritageDetailAPI(id);
      const data = res.data[0];

      setEditItem(data);
      form.setFieldsValue(data);
    };

    getDetail();
  }, [id, isEdit, form]);

  // 监听 editItem 变化，更新表单
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
    }
  }, [editItem, form]);

  // console.log('编辑传承项目表单初始值：', initialValues);
  // console.log('编辑传承项目editItem：', editItem);

  // 处理新增或者编辑按钮点击事件
  const handleAddOrEdit = async () => {
    // 先清理之前的定时器，防止重复调用
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      const values = await form.validateFields();
      const { heritage_name, heritage_level, heritage_desc } = values;
      console.log('表单的值：', values);

      // 获取非遗列表中所以的名称
      const allHeritageNames = heritage.map((item) => item.heritage_name);

      // 判断当前传承项目等级是否高于自身的传承级别
      const isLevelOk = compareHeritageLevel(
        userPrivacyData.inherit_level,
        heritage_level,
      );
      if (isLevelOk === -1) {
        messageApi.error(
          '当前的传承项目等级大于您自身的传承级别，请修改项目的等级！',
        );
        return;
      }

      // 新增
      if (!id) {
        // 判断当前的传承项目名称是否已有记录
        const isNameExisted = allHeritageNames.includes(heritage_name);
        if (isNameExisted) {
          messageApi.error('当前名称已注册，请更换非遗名称！');
          return;
        }

        // 判断描述是否已有记录
        const isDescExisted = heritage.some(
          (item) => item.heritage_desc === heritage_desc,
        );
        if (isDescExisted) {
          messageApi.error('该描述已有一摸一样的记录，请修改传承项目的描述！');
          return;
        }

        messageApi.open({
          type: 'loading',
          content: '正在删除中..',
          duration: 0,
        });
        timerRef.current = setTimeout(() => {
          messageApi.destroy();
          timerRef.current = null; // 执行后清空引用
        }, 2000);

        try {
          await postIntangibleHeritageAPI({
            ...values,
            score: 0,
            inheritor_id: inheritorId,
            shelf_status: 0,
          });

          messageApi.success('新增传承项目成功！可前往传承项目列表查看~');

          // 清空表单
          form.resetFields();

          await getIntangibleHeritageList();
        } catch (error) {
          console.error('新增传承项目接口请求失败！', error);
          messageApi.error('新增传承项目接口请求失败！');
          if (error.response?.data) {
            console.error('Supabase 错误详情:', error.response.data);
            // 提示用户具体错误
            messageApi.error(
              `保存失败：${error.response.data.message || '数据格式错误'}`,
            );
          } else {
            messageApi.error('保存失败，请检查表单数据');
          }
        } finally {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            messageApi.destroy(); // 同时销毁消息实例
          }
        }
      }

      // 编辑
      try {
        // 过滤editItem数据
        const itemData = {
          experience_duration: editItem.experience_duration,
          heritage_address: editItem.heritage_address,
          heritage_desc: editItem.heritage_desc,
          heritage_image: editItem.heritage_image,
          heritage_level: editItem.heritage_level,
          heritage_name: editItem.heritage_name,
          heritage_tags: editItem.heritage_tags,
          heritage_type: editItem.heritage_type,
          notice: editItem.notice,
          price: editItem.price,
          reserve_weeks: editItem.reserve_weeks,
          story_id: editItem.story_id,
          suitable_people: editItem.suitable_people,
        };

        // 数据改变了，则为 false
        const isContextChange = deepEqual(values, itemData);
        // console.log('isContextChange', isContextChange);
        // console.log('values', values);
        // console.log('editItem', itemData);
        // 数据未发生改变
        if (isContextChange) {
          messageApi.info('未发现修改内容，请修改后再保存！');
          return;
        }

        messageApi.open({
          type: 'loading',
          content: '正在删除中..',
          duration: 0,
        });
        timerRef.current = setTimeout(() => {
          messageApi.destroy();
          timerRef.current = null; // 执行后清空引用
        }, 2000);

        // 更新数据
        await updateIntangibleHeritageAPI(id, values);
        // 刷新
        await getIntangibleHeritageList();
        messageApi.success('编辑成功！可前往传承项目列表查看！');

        await delay(1000);
        navigate('/inheritorCenter/heritageManage');
        setEditItem(null);
        // 刷新页面
        window.location.reload();
      } catch (error) {
        console.error('编辑传承项目失败！', error);
        messageApi.error('编辑传承项目失败！请重试！');
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
      console.error('新增传承项目失败！', error);
      messageApi.error('新增传承项目失败！请重试！');
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
  } = usePageList(myHeritageList, 6, ['heritage_name']);

  // 切换筛选框选中状态
  const handleFilter = (value) => {
    // console.log('当前选中的值：', value);
    setSelectedValues(value);
    changeFilter('heritage_type', value); // 筛选 type 字段
  };

  // 下拉菜单 / 搜索框配置
  const heritageListConfig = {
    select: {
      width: 360,
      optionsItem: heritageTypeOptions,
      placeholder: '选择传承项目类型...',
      showSearch: true,
      mode: 'multiple',
      value: selectedValues,
      onChange: handleFilter,
    },
    search: {
      placeholder: '搜索传承项目名称...',
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

      {/* 新增/编辑页面 */}
      {inheritorNav === '/inheritorCenter/heritageManage/heritageAdd' && (
        <div>
          <div className="text-2xl font-semibold mb-4">
            {id ? '编辑' : '新增'}传承项目
          </div>

          {/* 新增表单 */}
          <div className="w-310 py-6 border border-slate-200 bg-white rounded-2xl">
            <CommonForm
              formType="add"
              form={form}
              maxWidth={1000}
              initialValues={initialValues || {}}
              formFields={formFields || []}
            />

            {/* 新增/编辑按钮 */}
            <div className="w-30 mx-auto">
              <div className="btn2" onClick={handleAddOrEdit}>
                {id ? '保存编辑' : '新增'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 传承项目列表 */}
      {inheritorNav === '/inheritorCenter/heritageManage/heritageList' && (
        <div>
          <div className="text-2xl font-semibold mb-4">传承项目列表</div>

          {/* 筛选和搜索 */}
          <div className="py-4">
            <SearchAndFilter fieldConfig={heritageListConfig} />
          </div>

          {currentData.length > 0 ? (
            <div className="w-full px-8 py-4 mx-auto grid grid-cols-3 gap-y-10 gap-x-30">
              {currentData
                .sort((a, b) => b.heritage_id - a.heritage_id)
                .map((item) => {
                  // 组装Card组件需要的数据
                  const boxStyle = {
                    width: 'w-[350px]',
                    imgHeight: 'h-[200px]',
                  };

                  const cardData = {
                    mode: 2,
                    img: item.heritage_image,
                    type: item.heritage_type,
                    title: item.heritage_name,
                    desc: item.heritage_desc,
                    score: item.score,
                    rate: item.price,
                    category: 1,
                    content: {
                      label: ['预约周期', '体验时长', '适合人群'],
                      contents: [
                        `提前${item.reserve_weeks}天`,
                        `${item.experience_duration}分钟`,
                        `${item.suitable_people}`,
                      ],
                    },
                    btn: [3, 4],
                  };

                  // 删除数据和编辑所需数据
                  const deleteAndEditData = {
                    type: 1,
                    id: item.heritage_id,
                  };

                  // 给每个Card传递对象并添加key
                  return (
                    <Card
                      key={item.heritage_id}
                      boxStyle={boxStyle}
                      cardData={cardData}
                      deleteData={deleteAndEditData}
                      editData={deleteAndEditData}
                      onClick={() =>
                        navigate(
                          `/intangibleHeritageDetail/${item.heritage_id}`,
                        )
                      }
                    />
                  );
                })}
            </div>
          ) : (
            <NoData />
          )}

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

export default HeritageManage;
