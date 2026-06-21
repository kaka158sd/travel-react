import { getTouristsAPI } from '@/apis/users';
import {
  getPlatformWalletAPI,
  getPlatformWalletFlowsAPI,
  getWalletFlowsAPI,
  getWalletRefundAuditsAPI,
} from '@/apis/wallet';
import { LoadError, LoadingSkeleton } from '@/components';
import { setRefund } from '@/store';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useOutletContext } from 'react-router-dom';

const PlatformWalletManage = () => {
  const [platformData, setPlatformData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [platformFlow, setPlatformFlow] = useState([]);
  const { users = [], adminId = 0 } = useOutletContext();
  const [touristList, setTouristList] = useState([]);
  const [walletFlow, setWalletFlow] = useState([]);
  const { refund = [] } = useSelector((state) => state.refund);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    try {
      const getPlatformData = async () => {
        const res = await getPlatformWalletAPI();
        setPlatformData(res.data[0]);
      };
      const getPlatformFlowData = async () => {
        const res = await getPlatformWalletFlowsAPI();
        setPlatformFlow(res.data);
      };
      const getTouristList = async () => {
        const res = await getTouristsAPI();
        setTouristList(res.data);
      };
      const getWalletFlow = async () => {
        const res = await getWalletFlowsAPI();
        setWalletFlow(res.data);
      };

      getPlatformData();
      getPlatformFlowData();
      getTouristList();
      getWalletFlow();
    } catch (error) {
      console.error('获取数据失败！', error);
      setError(true);
    } finally {
      setLoading(false);
      setError(false);
    }
  }, []);

  useEffect(() => {
    try {
      const getRefundAudit = async () => {
        const res = await getWalletRefundAuditsAPI();
        dispatch(setRefund(res.data));
      };
      getRefundAudit();
    } catch (error) {
      console.error('获取退款审核列表失败！', error);
    }
  }, [dispatch]);

  // 获取单个游客的流水数据
  const getTouristFlow = useCallback(
    (id) => {
      const filterData = walletFlow.filter((item) => item.tourist_id === id);
      if (!filterData) return { charge: 0, pay: 0, refund: 0 };
      const charge = (
        filterData.filter((item) => item.flow_type === 0) || []
      ).reduce((sum, item) => sum + Math.abs(item.amount || 0), 0);
      const payRaw = (
        filterData.filter((item) => item.flow_type === 1) || []
      ).reduce((sum, item) => sum + Math.abs(item.amount || 0), 0);
      const refund = (
        filterData.filter((item) => item.flow_type === 2) || []
      ).reduce((sum, item) => sum + Math.abs(item.amount || 0), 0);
      return { charge, pay: payRaw - refund, refund };
    },
    [walletFlow],
  );

  const userFilter = users.filter((item) => item.identity_type === 1);
  // 获取游客昵称数组便于筛选
  const touristUserName = userFilter.map((item) => {
    return { text: item.user_name, value: item.user_name };
  });

  // 处理游客钱包数据
  const touristWalletData = useMemo(() => {
    const map = new Map();
    touristList.forEach((item) => map.set(item.user_id, item));
    return userFilter.map((item) => {
      const matchItem = map.get(item.user_id);
      if (!matchItem) return null;
      const idx = matchItem.tourist_id;
      const flows = getTouristFlow(idx);
      return {
        key: idx,
        user_name: item.user_name,
        wallet: matchItem?.wallet,
        tourist_id: idx,
        charge: flows.charge || 0,
        pay: flows.pay || 0,
        refund: flows.refund || 0,
      };
    });
  }, [touristList, getTouristFlow, userFilter]);

  // 处理退款申请数据列表
  const refundList = [...refund]
    ?.sort((a, b) => b.audit_id - a.audit_id)
    .map((item) => {
      return {
        ...item,
        key: item.audit_id,
        audit_time: dayjs(item.audit_time).format('YYYY-MM-DD HH:mm:ss'),
      };
    });

  // 处理退款审核的审核id
  const auditIds = [...refund]?.map((item) => {
    return { text: item.audit_id, value: item.audit_id };
  });

  // 刷新退款审核列表的方法
  async function refreshRefund() {
    try {
      const getRefundAudit = async () => {
        const res = await getWalletRefundAuditsAPI();
        dispatch(setRefund(res.data));
      };
      getRefundAudit();
    } catch (error) {
      console.error('获取退款审核列表失败！', error);
    }
  }

  if (loading)
    return (
      <div className="py-30">
        <LoadingSkeleton />
      </div>
    );
  if (error) return <LoadError />;

  return (
    <div>
      <div className="text-xl font-semibold">平台资金管理</div>
      <div className="px-4 py-6">
        <Outlet
          context={{
            platformData,
            platformFlow,
            touristWalletData,
            touristUserName,
            walletFlow,
            refundList,
            auditIds,
            adminId,
            refreshRefund,
          }}
        />
      </div>
    </div>
  );
};

export default PlatformWalletManage;
