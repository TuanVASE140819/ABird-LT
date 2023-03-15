import { useEffect, useState } from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { Column } from '@ant-design/plots';
const { Statistic } = StatisticCard;
import { Avatar, Card, Rate, Skeleton, Switch, Col } from 'antd';

import { ProList } from '@ant-design/pro-components';
import { Button, Progress, Space, Tag } from 'antd';
import { getTopConsultantsByRate } from '@/services/Report';
import { log } from '@antv/g2plot/lib/utils';

export default ({ d }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getTopConsultantsByRate();
      setData(result.slice(0, 5)); // Lấy ra 5 phần tử đầu tiên
      console.log(result);
    }
    fetchData();
  }, []);

  const config = {
    data: [...d[1]].map((item) => ({ ...item, total: item.total })),
    isGroup: true,
    xField: 'month',
    yField: 'total',
    seriesField: 'name',

    /** 设置颜色 */
    //color: ['#1ca9e6', '#f88c24'],

    /** 设置间距 */
    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  const [responsive, setResponsive] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="THỐNG KÊ DOANH THU"
        extra=""
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard colSpan={21} split="horizontal">
            <ProCard colSpan={21} split="vertical"></ProCard>
          </ProCard>
          <h5>1 đơn vị = 1,000vnđ</h5>
          <Column
            {...config}
            style={{
              height: '300px',
            }}
          />
        </ProCard>
        <ProCard
          colSpan={9}
          split="horizontal"
          style={{
            height: '300px',
          }}
        >
          <ProList
            rowKey="id"
            headerTitle="TOP 5 DỊCH VỤ BÁN CHẠY"
            dataSource={data.length >= 5 ? data.slice(0, 5) : data}
            metas={{
              title: {
                dataIndex: 'serviceName',
                render: (text) => `Dịch vụ: ${text}`, // Thêm tiền tố "Dịch vụ: "
              },
              subTitle: {
                dataIndex: 'amount',
                render: (text) => `Số lượng: ${text}`, // Thêm tiền tố "Số lượng: "
                style: { textAlign: 'right' },
              },
            }}
          />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
};
