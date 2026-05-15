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
      const values = userForm.validateFields();
      const { avatar, password, phone, user_name, privacyData } = values;
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

      const userData = {
        ...currentUser,
        avatar,
        password,
        phone,
        user_name,
      };
      await updateUserAPI(currentUser.user_id, userData);
      await updateTouristApi(touristId, {
        signature: newSignature,
      });

      dispatch(setCurrentUser(userData));
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
      if (error.errorFields) {
        messageApi.error('表单校验失败，请检查输入！');
      }
    }
  };

  return {
    contextHolder,
    handleUserConfirm,
  };
};
