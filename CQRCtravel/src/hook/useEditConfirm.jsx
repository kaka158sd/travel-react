// 处理修改弹窗的提交保存事件

import { getUsersAPI, updateUserAPI } from '@/apis/users';
import { setCurrentUser } from '@/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useEditConfirm = (
  phoneForm,
  paWForm,
  currentUser,
  setConfirmLoading,
  setIsShowDialog,
  messageApi,
) => {
  // 全局信息
  const dispatch = useDispatch();
  const userId = currentUser?.user_id;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (error) {
        console.error('获取用户列表失败！', error);
      }
    };

    getUsersList();
  }, []);

  // 修改手机号表单提交事件
  const phoneConfirm = async () => {
    setConfirmLoading(true);
    try {
      const values = await phoneForm.validateFields();
      const { newPhone, oldPhone, code } = values;
      // console.log('Phone values:', values);

      // 新的手机号不能与旧的相同
      if (newPhone === oldPhone) {
        messageApi.error('新的手机号与旧的手机号相同！');
        return;
      }

      // 手机号不能与其他用户的手机号冲突
      const isPhoneExist = users.some((item) => item.phone === newPhone);
      if (isPhoneExist) {
        messageApi.error('当前手机号已被注册，请重新填写手机号！');
        return;
      }

      // 验证码验证:验证码需为 111111
      if (code !== '111111') {
        messageApi.error('验证码错误！');
        return;
      }

      // 通过后，修改用户的手机号并同步修改全局变量
      await updateUserAPI(userId, {
        phone: newPhone,
      });
      dispatch(
        setCurrentUser({
          ...currentUser,
          phone: newPhone,
        }),
      );

      messageApi.success('修改手机号成功！');
      setIsShowDialog(false);
    } catch (error) {
      console.error('手机号表单提交失败', error);
      console.log('失败字段', error.errorFields);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 修改密码表单提交事件
  const passwordConfirm = async () => {
    setConfirmLoading(true);
    try {
      const values = await paWForm.validateFields();
      const { oldPassword, newPassword, passwordAgain } = values;
      // console.log('修改密码表单：', values);

      // 新的密码不能与旧的相同
      if (newPassword === oldPassword) {
        messageApi.error('新的密码与旧的密码相同！');
        return;
      }

      // 确认密码需要与新密码相同
      if (passwordAgain !== newPassword) {
        messageApi.error('确认密码与新的密码不相同！');
        return;
      }

      // 通过后，修改用户的手机号并同步修改全局变量
      await updateUserAPI(userId, {
        password: newPassword,
      });
      dispatch(
        setCurrentUser({
          ...currentUser,
          password: newPassword,
        }),
      );

      messageApi.success('修改密码成功！');
      setIsShowDialog(false);
    } catch (error) {
      console.error('密码表单提交失败', error);
      console.log('失败字段', error.errorFields);
    } finally {
      setConfirmLoading(false);
    }
  };

  return {
    phoneConfirm,
    passwordConfirm,
  };
};
