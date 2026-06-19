import { getPlatformWalletAPI, getPlatformWalletFlowsAPI } from '@/apis/wallet';
import { LoadError, LoadingSkeleton } from '@/components';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PlatformWalletManage = () => {
  const [platformData, setPlatformData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [platformFlow, setPlatformFlow] = useState([]);

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

      getPlatformData();
      getPlatformFlowData();
    } catch (error) {
      console.error('获取数据失败！', error);
      setError(true);
    } finally {
      setLoading(false);
      setError(false);
    }
  }, []);

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
      <div>
        <Outlet
          context={{
            platformData,
            platformFlow,
          }}
        />
      </div>
    </div>
  );
};

export default PlatformWalletManage;
