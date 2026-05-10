import { getAdminsDepartmentAPI, getAdminsPositionAPI } from '@/apis/users';
import { CommonForm, DialogCommon } from '@/components';
import { usePaWEditForm, usePhoneEditForm, useUserForm } from '@/hook';
import { useCallback, useEffect, useMemo, useState } from 'react';

// 管理员数据
const user = {
  // user_id: 1,
  identity_type: 3,
  user_name: '荣昌',
  phone: '13800001111',
  password: '123456a',
  avatar:
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.dL40B4NwCkdjug6poBJ6bQAAAA?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  // created_time: '2026-04-20T10:19:55.337782+00:00',
  privacyData: [null, null],
};
// 个人信息修改表单
// 手机号
const editPhone = {
  oldPhone: user.phone,
  newPhone: '',
  code: '', //验证码固定为111111
};
// 密码
const editPaW = {
  oldPassword: user.password,
  newPassword: '',
  passwordAgain: '',
};

const ActivityManage = () => {
  const [adminDepartment, setAdminDepartment] = useState([]);
  const [adminPosition, setAdminPosition] = useState([]);

  useEffect(() => {
    const getAdminDepartment = async () => {
      try {
        const res = await getAdminsDepartmentAPI();
        setAdminDepartment(res.data);
      } catch (error) {
        console.error('获取部门失败', error);
      }
    };
    const getAdminPosition = async () => {
      try {
        const res = await getAdminsPositionAPI();
        setAdminPosition(res.data);
      } catch (error) {
        console.error('获取职位失败', error);
      }
    };

    getAdminDepartment();
    getAdminPosition();
  }, []);

  const adminDepartmentOptions = adminDepartment?.map((item) => ({
    value: item.department_name,
    label: item.department_name,
  }));
  const adminPositionOptions = adminPosition?.map((item) => ({
    value: item.position_name,
    label: item.position_name,
  }));

  // 控制弹窗的开关和类型
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(1);

  // 获取管理员个人信息表单
  const { form, formFields, initialValues } = useUserForm({
    user,
    adminDepartmentOptions,
    adminPositionOptions,
  });

  // 获取修改手机号和密码的表单
  const {
    form: phoneForm,
    formFields: phoneFormFields = [],
    initialValues: phoneInitialValues,
  } = usePhoneEditForm(editPhone);
  const {
    form: paWForm,
    formFields: paWFormFields = [],
    initialValues: paWInitialValues,
  } = usePaWEditForm(editPaW);

  // 封装根据弹窗类型获取表单配置的函数
  const getFormConfig = useCallback(
    (type) => {
      if (type === 1) {
        return {
          form: phoneForm,
          formFields: phoneFormFields,
          initialValues: phoneInitialValues,
          title: '手机号',
        };
      } else if (type === 2) {
        return {
          form: paWForm,
          formFields: paWFormFields,
          initialValues: paWInitialValues,
          title: '密码',
        };
      } else return {};
    },
    [
      phoneForm,
      phoneFormFields,
      phoneInitialValues,
      paWForm,
      paWFormFields,
      paWInitialValues,
    ],
  );

  // 弹窗数据
  const dialogData = useMemo(() => {
    if (dialogType === 1 || dialogType === 2) {
      const config = getFormConfig(dialogType);

      return {
        type: 1,
        title: `修改${config.title}`,
        data: {
          formType: 'edit',
          form: config.form,
          initialValues: config.initialValues,
          formFields: config.formFields,
          maxWidth: 500,
        },

        width: 500,
      };
    }

    // 其他未匹配的 dialogType 也返回默认值，避免传递给弹窗的是未定义
    return {
      type: 3,
      items: [],
      title: '',
    };
  }, [dialogType, getFormConfig]);

  // 打开弹窗点击事件
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setIsShowDialog(true);
  };

  return (
    <div>
      <div className="text-xl font-semibold">个人资料</div>

      <div className="py-10 -translate-x-12">
        <div className="flex">
          <CommonForm
            formType="user"
            form={form}
            maxWidth={600}
            initialValues={initialValues}
            formFields={formFields || {}}
          />

          <div className="mt-58.5 ml-26">
            <div className="btn3 mb-5.5" onClick={() => handleOpenDialog(1)}>
              修改
            </div>
            <div className="btn3" onClick={() => handleOpenDialog(2)}>
              修改
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="w-26 ml-40 mt-4">
          <div className="btn2">保存</div>
        </div>
      </div>

      {/* 弹窗组件 */}
      <DialogCommon
        isShowDialog={isShowDialog}
        onCancel={() => setIsShowDialog(false)}
        onOk={() => setIsShowDialog(false)}
        dialogData={dialogData}
      />
    </div>
  );
};

export default ActivityManage;
