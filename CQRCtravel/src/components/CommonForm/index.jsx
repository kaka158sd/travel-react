import { Form, message } from 'antd';
import { rulesParse } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { getHeritageTypeAPI } from '@/apis/intangible_heritage';
import { getAdminsDepartmentAPI, getAdminsPositionAPI } from '@/apis/users';
import { DialogCommon, DataField } from '@/components';
import { getSpotTagsAPI, getSpotTypeAPI } from '@/apis/scenic_spots';
import { getHumanStoriesAPI } from '@/apis/human_stories';

// 修改表单
const edit = {
  // 手机号
  // oldPhone: '13800001111',
  // newPhone: '',
  // code: 111111,
  editType: 2, //1：手机号；2：密码
  // 密码
  oldPassword: '123456aa',
  newPassword: '',
  passwordAgain: '',
};

// 新增表单
const add = {
  // spot_id: 1,
  spot_name: '万灵古镇',
  spot_image:
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.kBlSRPpi00LXAXUljsfJ5wHaED?w=319&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  spot_desc:
    '万灵古镇是宋代始建的千年古镇，依山傍水，明清建筑保存完好，曾为川渝重要水陆驿站，古桥、老街、宗祠遍布，兼具自然风光与厚重历史，是荣昌最具代表性的文化地标与旅游胜地。',
  spot_tags: ['古风', '历史', '古镇'],
  spot_type: '古镇',
  spot_star: '4A',
  open_status: '正常开放',
  is_ticket: true,
  ticket_price: 40.0,
  open_time: '08:00:00',
  close_time: '18:00:00',
  spot_address: '荣昌区万灵镇',
  story_id: 1,
  // created_time: '2026-04-19T13:54:35.026635+00:00',
  // updated_time: '2026-04-19T13:54:35.026635+00:00',
  area: 126000.0,
  traffic_guide: '乘106路公交',
  notice: '文明游览',
  score: 4.8,
  comments: null,
};

const CommonForm = ({
  formType,
  form,
  maxWidth,
  initialValues,
  formFields,
}) => {
  const [heritageType, setHeritageType] = useState([]);
  const [adminDepartment, setAdminDepartment] = useState([]);
  const [adminPosition, setAdminPosition] = useState([]);
  const [spotType, setSpotType] = useState([]);
  const [spotTags, setSpotTags] = useState([]);
  const [humanStories, setHumanStories] = useState([]);

  useEffect(() => {
    const getHeritageType = async () => {
      try {
        const res = await getHeritageTypeAPI();
        setHeritageType(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getAdminDepartment = async () => {
      try {
        const res = await getAdminsDepartmentAPI();
        setAdminDepartment(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getAdminPosition = async () => {
      try {
        const res = await getAdminsPositionAPI();
        setAdminPosition(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getSpotType = async () => {
      try {
        const res = await getSpotTypeAPI();
        setSpotType(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getSpotTags = async () => {
      try {
        const res = await getSpotTagsAPI();
        setSpotTags(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };
    const getHumanStories = async () => {
      try {
        const res = await getHumanStoriesAPI();
        setHumanStories(res.data);
      } catch (error) {
        console.error('获取非遗类型失败', error);
      }
    };

    getHeritageType();
    getAdminDepartment();
    getAdminPosition();
    getSpotType();
    getSpotTags();
    getHumanStories();
  }, []);

  // 表单
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const heritageLevelOptions = ['世界级', '国家级', '省级', '市级', '县级'].map(
    (item) => ({
      value: item,
      label: item,
    }),
  );
  const heritageTypeOptions = heritageType?.map((item) => ({
    value: item.type_name,
    label: item.type_name,
  }));
  const adminDepartmentOptions = adminDepartment?.map((item) => ({
    value: item.department_name,
    label: item.department_name,
  }));
  const adminPositionOptions = adminPosition?.map((item) => ({
    value: item.position_name,
    label: item.position_name,
  }));
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

  // 手动设置表单初始值
  // 设置个人信息表单初始值
  useEffect(() => {
    if (form && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);
  // 设置修改表单初始值
  useEffect(() => {
    if (edit) {
      editForm.setFieldsValue({
        // 手机号
        // oldPhone: edit.oldPhone,
        // newPhone: '',
        // code: '',

        // 密码
        edit,
      });
    }
  }, [edit, editForm]);

  // 控制弹窗的开关
  const [isShowDialog, setIsShowDialog] = useState(false);
  // 存储【当前激活的表单项】,以控制打开的弹窗
  const [activeDialogField, setActiveDialogField] = useState(null);

  // 修改表单的数据项
  const editFormFields = [
    // 手机号
    // {
    //   name: 'oldPhone',
    //   label: '原手机号',
    //   rules: 'required phone',
    //   type: 'textInput',
    //   formConfig: {
    //     placeholder: edit.oldPhone || '',
    //     isDisabled: true,
    //     width: 250,
    //   },
    // },
    // {
    //   name: 'newPhone',
    //   label: '新手机号',
    //   rules: 'required phone',
    //   type: 'textInput',
    //   formConfig: {
    //     placeholder: '请输入新的手机号',
    //     width: 250,
    //   },
    // },
    // {
    //   name: 'code',
    //   label: '验证码',
    //   rules: 'required',
    //   type: 'textInput',
    //   formConfig: {
    //     placeholder: '请输入验证码',
    //     width: 120,
    //   },
    // },

    // 密码
    {
      name: 'oldPassword',
      label: '原密码',
      rules: 'required password',
      type: 'password',
      formConfig: {
        placeholder: edit.oldPassword || '',
        isDisabled: true,
        width: 250,
      },
    },
    {
      name: 'newPassword',
      label: '新密码',
      rules: 'required password',
      type: 'password',
      formConfig: {
        placeholder: '请输入密码',
        width: 250,
      },
    },
    {
      name: 'passwordAgain',
      label: '确认密码',
      rules: 'required password',
      type: 'password',
      formConfig: {
        placeholder: '请再次输入密码',
        width: 250,
      },
    },
  ];

  // 通过 message.useMessage 创建支持读取 context 的 contextHolder
  const [messageApi, contextHolder] = message.useMessage();
  // 倒计时秒数
  const [countDown, setCountDown] = useState(0);
  const timerRef = useRef(null);
  // 是否正在倒计时
  const isRunning = countDown > 0;

  // 验证码按钮点击事件：点击之后变成60s倒计时，并弹窗发送验证码成功消息
  const handleButtonClick = () => {
    messageApi.open({
      type: 'success',
      content: '验证码发送成功！',
    });

    // 防止重复点击
    if (isRunning) return;

    // 初始60s
    setCountDown(60);
  };

  useEffect(() => {
    // 没秒数就不执行
    if (countDown <= 0) return;

    timerRef.current = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          // 倒计时结束，清除定时器
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清除定时器：组件卸载/依赖变化
    return () => {
      clearInterval(timerRef.current);
    };
  }, [countDown]);

  // 新增表单
  const addFormFields = [
    {
      name: 'spot_name',
      label: '景点名称',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入景点名称...',
        isAllowClear: true,
        count: { max: 20 },
      },
      column: 'left',
    },
    {
      name: 'spot_image',
      label: '景点图片',
      rules: 'required',
      type: 'upload',
      formConfig: {
        name: 'spotUpload',
        listType: 1,
        width: 200,
      },
      column: 'left',
    },
    {
      name: 'spot_type',
      label: '景点类型',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择/输入景点类型...',
        isAllowClear: true,
        isShowSearch: true,
        options: spotTypeOptions,
      },
      column: 'left',
    },
    {
      name: 'spot_tags',
      label: '景点标签',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择/输入景点标签...',
        isAllowClear: true,
        isShowSearch: true,
        mode: 2,
        options: spotTagsOptions,
      },
      column: 'left',
    },
    {
      name: 'spot_star',
      label: '景点星级',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择景点星级...',
        options: [
          { value: '5A', label: '5A' },
          { value: '4A', label: '4A' },
          { value: '3A', label: '3A' },
          { value: '无', label: '无' },
        ],
      },
      column: 'left',
    },
    {
      name: 'open_status',
      label: '开放状态',
      rules: 'required',
      type: 'select',
      formConfig: {
        placeholder: '请选择景点开放状态...',
        options: [
          { value: '正常开放', label: '正常开放' },
          { value: '临时维护', label: '临时维护' },
          { value: '暂停开放', label: '暂停开放' },
        ],
      },
      column: 'left',
    },
    {
      name: 'spot_desc',
      label: '景点描述',
      rules: 'required',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入景点描述...',
        isAllowClear: true,
        maxCount: 1000,
      },
      column: 'left',
    },
    {
      name: 'ticket_price',
      label: '门票',
      rules: 'required',
      type: 'number',
      formConfig: {
        placeholder: add.is_ticket ? '请输入门票价格...' : '免费',
        isDisabled: add.is_ticket ? false : true,
        prefix: '￥',
      },
      column: 'right',
    },
    {
      name: 'open_time',
      label: '开放时间',
      rules: 'required',
      type: 'timePicker',
      formConfig: {
        placeholder: '请选择时间...',
      },
      column: 'right',
    },
    {
      name: 'close_time',
      label: '结束时间',
      rules: 'required',
      type: 'timePicker',
      formConfig: {
        placeholder: '请选择时间...',
      },
      column: 'right',
    },
    {
      name: 'story_id',
      label: '关联故事',
      rules: 'optional',
      type: 'select',
      formConfig: {
        placeholder: '请选择关联的人文故事(可不填)',
        options: humanStoriesOptions,
      },
      column: 'right',
    },
    {
      name: 'spot_address',
      label: '景点地址',
      rules: 'required string',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入地址...',
        isAllowClear: true,
        count: { max: 50 },
      },
      column: 'right',
    },
    {
      name: 'area',
      label: '占地面积',
      rules: 'required number',
      type: 'textInput',
      formConfig: {
        placeholder: '请输入占地面积(/平方米)...',
      },
      column: 'right',
    },
    {
      name: 'traffic_guide',
      label: '交通指南',
      rules: 'optional',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入交通指南...',
        maxCount: 500,
      },
      column: 'right',
    },
    {
      name: 'notice',
      label: '注意事项',
      rules: 'optional',
      type: 'textArea',
      formConfig: {
        placeholder: '请输入注意事项...',
        maxCount: 500,
      },
      column: 'right',
    },
    {
      name: 'score',
      label: '评分',
      rules: 'required',
      type: 'rate',
      formConfig: {},
      column: 'right',
    },
  ];

  return (
    <div>
      {/* 虚拟绑定闲置表单实例，消除警告 */}
      <Form form={editForm} style={{ display: 'none' }} />
      <Form form={addForm} style={{ display: 'none' }} />

      {/* 修改表单-新的不能于原来的相同 */}
      {formType === 'edit' && (
        <div className="relative w-100">
          <Form
            form={editForm}
            style={{ maxWidth: 400 }}
            size="medium"
            layout="horizontal"
            labelCol={{ span: 8 }}
          >
            {editFormFields.map((item) => (
              <Form.Item
                key={item.name}
                label={item.label}
                rules={rulesParse(item.rules)}
                name={item.name}
              >
                <DataField formConfig={item.formConfig} type={item.type} />
              </Form.Item>
            ))}
          </Form>

          {contextHolder}
          {edit.editType === 1 && (
            <button
              className="btn3 absolute top-28 right-6"
              onClick={handleButtonClick}
              disabled={isRunning}
              style={{ cursor: ` ${isRunning ? 'not-allowed' : ''}` }}
            >
              {isRunning ? `${countDown}s后重新获取` : '获取验证码'}
            </button>
          )}
        </div>
      )}

      {formType === 'add' && (
        <Form
          form={addForm}
          style={{ maxWidth: 1200 }}
          size="medium"
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 18 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: 140,
            }}
          >
            {/* 左列：先排完所有左边的字段 */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {addFormFields
                .filter((item) => item.column === 'left')
                .map((item) => (
                  <Form.Item
                    key={item.name}
                    label={item.label}
                    rules={rulesParse(item.rules)}
                    name={item.name}
                  >
                    <DataField formConfig={item.formConfig} type={item.type} />
                  </Form.Item>
                ))}
            </div>

            {/* 右列：再排完所有右边的字段 */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {addFormFields
                .filter((item) => item.column === 'right')
                .map((item) => (
                  <Form.Item
                    key={item.name}
                    label={item.label}
                    rules={rulesParse(item.rules)}
                    name={item.name}
                  >
                    <DataField formConfig={item.formConfig} type={item.type} />
                  </Form.Item>
                ))}
            </div>
          </div>
        </Form>
      )}

      <div>
        <Form
          key={JSON.stringify(initialValues)}
          form={form}
          style={{ maxWidth: maxWidth || 600 }}
          size="medium"
          layout="horizontal"
          labelCol={{ span: 8 }}
          initialValues={initialValues || {}}
        >
          {formFields?.map((item) => (
            <Form.Item
              key={item.name}
              label={item.label}
              rules={rulesParse(item.rules)}
              name={item.name}
            >
              <DataField
                formConfig={item.formConfig}
                type={item.type}
                handleOpenDialogClick={
                  formType === 'user'
                    ? () => {
                        if (item.userDialogData) {
                          setActiveDialogField(item);
                          setIsShowDialog(true);
                        }
                      }
                    : () => {}
                }
              />
            </Form.Item>
          ))}
        </Form>

        {/* 个人信息表单中的弹窗*/}
        <DialogCommon
          isShowDialog={isShowDialog}
          onCancel={() => {
            setIsShowDialog(false);
            setActiveDialogField(null);
          }}
          dialogData={activeDialogField?.userDialogData || {}}
          onOk={(value) => {
            // 确认时将值同步给表单
            form.setFieldValue(activeDialogField.name, value);
            setIsShowDialog(false);
            setActiveDialogField(null);
          }}
          // 传入表单当前值作为弹窗的初始值
          initialValue={form.getFieldValue(activeDialogField?.name) || null}
        />
      </div>
    </div>
  );
};

export default CommonForm;
