// 用户个人信息保存

import { updateTouristApi, updateUserAPI } from '@/apis/users';
import { setCurrentUser, setUserPrivacyData } from '@/store';
import { message } from 'antd';
import { useDispatch } from 'react-redux';

export const useUserConfirm = (
  userForm,
  currentUser,
  touristId,
  userPrivacyData,
) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleUserConfirm = async () => {
    try {
      const values = await userForm.validateFields();
      const { avatar, user_name, privacyData } = values;

      // 打印调试：确认拿到的表单值
      console.log('表单原始值:', values);

      // 给 privacyData 做空值保护，默认设为空数组
      const newSignature = privacyData?.[0] ?? '';

      // 判断是否有更改
      const isAvatarChanged = avatar !== currentUser.avatar;
      const isUserNameChanged = user_name !== currentUser.user_name;
      const isSignatureChanged =
        newSignature !== (currentUser.privacyData?.[0] ?? '');

      if (!isAvatarChanged && !isUserNameChanged && !isSignatureChanged) {
        messageApi.info('未检测到修改的信息，请修改后再保存！');
        return;
      }

      // 构建用户更新数据（只传修改的字段）
      const userData = {
        avatar,
        user_name,
      };

      await updateUserAPI(currentUser.user_id, userData);
      await updateTouristApi(touristId, {
        signature: newSignature,
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          avatar,
          user_name,
        }),
      );
      dispatch(
        setUserPrivacyData({
          ...userPrivacyData,
          signature: newSignature,
        }),
      );

      messageApi.success('保存成功！');
      console.log('保存个人信息:', values);
    } catch (error) {
      console.error('保存用户信息失败！', error);
      // 打印 Supabase 返回的详细错误信息
      if (error.response) {
        console.error('Supabase 错误详情:', error.response.data);
        messageApi.error(
          `保存失败：${error.response.data.message || '请求错误'}`,
        );
      } else if (error.errorFields) {
        messageApi.error('表单校验失败，请检查输入！');
      } else {
        messageApi.error('保存失败，请稍后重试！');
      }
    }
  };

  return {
    contextHolder,
    handleUserConfirm,
  };
};
