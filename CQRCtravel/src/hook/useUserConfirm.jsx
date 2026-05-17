// 用户个人信息保存

import {
  updateAdminAPI,
  updateInheritorAPI,
  updateTouristApi,
  updateUserAPI,
} from '@/apis/users';
import { setCurrentUser, setUserPrivacyData } from '@/store';
import { useDispatch } from 'react-redux';

export const useUserConfirm = (
  userForm,
  currentUser,
  userId,
  userPrivacyData,
  messageApi,
) => {
  const dispatch = useDispatch();
  const type = currentUser.identity_type;

  const handleUserConfirm = async () => {
    try {
      const values = await userForm.validateFields();
      const { avatar, user_name, privacyData } = values;
      // console.log('privacyData', privacyData);

      // 打印调试：确认拿到的表单值
      console.log('表单原始值:', values);

      // 给 privacyData 做空值保护，默认设为空数组
      const newPrivacyOne = privacyData?.[0] ?? '';
      const newPrivacyTwo = privacyData?.[1] ?? '';
      const newPrivacyThree = privacyData?.[2] ?? [];

      // 判断是否有更改
      const isAvatarChanged = avatar !== currentUser.avatar;
      const isUserNameChanged = user_name !== currentUser.user_name;
      const isPrivacyOneChanged =
        newPrivacyOne !==
        (type === 1
          ? userPrivacyData.signature
          : type === 2
            ? userPrivacyData.personal_profile
            : userPrivacyData.position);
      const isPrivacyTwoChanged =
        type === 1
          ? false
          : newPrivacyTwo !==
            (type === 2
              ? userPrivacyData.inherit_level
              : userPrivacyData.department);
      const isPrivacyThreeChanged =
        type === 2
          ? JSON.stringify(newPrivacyThree) !==
            JSON.stringify(userPrivacyData.field || [])
          : false;

      const hasChange =
        isAvatarChanged ||
        isUserNameChanged ||
        isPrivacyOneChanged ||
        isPrivacyTwoChanged ||
        isPrivacyThreeChanged;

      if (!hasChange) {
        messageApi.info('未检测到修改的信息，请修改后再保存！');
        return;
      }

      // 构建用户更新数据（只传修改的字段）
      const userData = {
        avatar,
        user_name,
      };

      await updateUserAPI(currentUser.user_id, userData);
      dispatch(
        setCurrentUser({
          ...currentUser,
          avatar,
          user_name,
        }),
      );
      // 处理需要更新的数据
      const updateData = {
        privacyOne: isPrivacyOneChanged ? newPrivacyOne : userPrivacyData[0],
        privacyTwo: isPrivacyTwoChanged ? newPrivacyTwo : userPrivacyData[1],
        privacyThree: isPrivacyThreeChanged
          ? newPrivacyThree
          : userPrivacyData[2],
      };

      // 判断身份
      switch (currentUser.identity_type) {
        case 1:
          await updateTouristApi(userId, {
            signature: newPrivacyOne,
          });
          dispatch(
            setUserPrivacyData({
              ...userPrivacyData,
              signature: newPrivacyOne,
            }),
          );
          break;
        case 2:
          await updateInheritorAPI(userId, {
            personal_profile: updateData.privacyOne,
            inherit_level: updateData.privacyTwo,
            field: updateData.privacyThree,
          });
          dispatch(
            setUserPrivacyData({
              ...userPrivacyData,
              personal_profile: updateData.privacyOne,
              inherit_level: updateData.privacyTwo,
              field: updateData.privacyThree,
            }),
          );
          break;
        case 3:
          await updateAdminAPI(userId, {
            position: updateData.privacyOne,
            department: updateData.privacyTwo,
          });
          dispatch(
            setUserPrivacyData({
              ...userPrivacyData,
              position: updateData.privacyOne,
              department: updateData.privacyTwo,
            }),
          );
          break;
        default:
          messageApi.error('当前身份有误，请联系客服或者系统管理员！');
      }

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
    handleUserConfirm,
  };
};
