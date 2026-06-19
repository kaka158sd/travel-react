// 导入重命名
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function SimpleBar({ xData, value }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const safeX = Array.isArray(xData) ? xData.filter(Boolean) : [];
    const safeVal = Array.isArray(value)
      ? value.map((v) => Number(v) || 0)
      : [];
    const maxLen = Math.max(safeX.length, safeVal.length);
    while (safeX.length < maxLen) safeX.push('');
    while (safeVal.length < maxLen) safeVal.push(0);

    const option = {
      tooltip: { trigger: 'axis' },
      grid: { left: 10, right: 10, bottom: 30 },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          fontSize: 16,
          margin: 20,
        },
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: value,
          barWidth: '30%',
        },
      ],
    };

    chart.setOption(option);

    const resize = () => chart.resize();
    window.addEventListener('resize', resize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', resize);
    };
  }, [value, xData]);

  return <div ref={chartRef} style={{ width: '100%', height: 360 }} />;
}
