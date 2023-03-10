import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { Column } from '@ant-design/plots';
const { Statistic } = StatisticCard;
import { Avatar, Card, Rate, Skeleton, Switch, Col } from 'antd';

import { ProList } from '@ant-design/pro-components';
import { Button, Progress, Space, Tag } from 'antd';

import { useEffect, useState } from 'react';

export default ({ d }) => {
  const config = {
    data: topServices.map((item) => ({ month: item.name, value: item.total })),
    xField: 'month',
    yField: 'value',
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  const config1 = {
    data: [...d[1], ...d[2]].map((item) => ({ ...item, value: item.total })),
    isGroup: true,
    xField: 'month',
    yField: 'value',
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
  const [topServices, setTopServices] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  useEffect(() => {
    fetch('https://swpbirdboardingv1.azurewebsites.net/api/Home/Gettopservice?accountid=3')
      .then((response) => response.json())
      .then((data) => setTopServices(data))
      .catch((error) => console.log(error));
    console.log('topServices', topServices);
  }, []);

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
        width="70%"
      >
        <ProCard split="horizontal">
          <ProList
            rowKey="id"
            headerTitle="TOP 10 TƯ VẤN VIÊN CÓ LƯỢT ĐẶT LỊCH NHIỀU NHẤT"
            expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
            dataSource={topServices.map((item) => ({
              ...item,
              title: item.name,
              description: item.total,
            }))}
          />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
};
