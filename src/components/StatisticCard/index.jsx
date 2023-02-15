import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { Column } from '@ant-design/plots';
const { Statistic } = StatisticCard;
import { Avatar, Card, Rate, Skeleton, Switch, Col } from 'antd';

import { ProList } from '@ant-design/pro-components';
import { Button, Progress, Space, Tag } from 'antd';
import { useState } from 'react';

const dataSource = [
  {
    title: 'Vũ Anh Tuấn',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn A',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn B',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn C',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn D',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Vũ Anh Tuấn',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn A',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn B',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn C',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Nguyễn Văn D',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
];
export default ({ d }) => {
  const config = {
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
        width="70%"
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            {/* <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: 'DOANH THU NGÀY',

                  value: d[0].incomeDaily,
                  description: (
                    <Statistic
                      title="Ngày hôm qua"
                      value={d[0].incomeDailyYesterday}
                      suffix="%"
                      trend="down"
                    />
                  ),
                }}
              />
            </ProCard> */}
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: 'TỔNG RÚT (VNĐ)',
                  value: d[0].totalWithdrawal * 1000,
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'TỔNG NẠP (VNĐ)',
                  value: d[0].totalDeposit * 1000,
                }}
              />
            </ProCard>
          </ProCard>
          <h1>Tỉ lệ rút/nạp</h1>
          <h5>1 đơn vị = 1,000vnđ</h5>
          <Column
            {...config}
            style={{
              height: '300px',
            }}
          />
        </ProCard>
        <ProCard split="horizontal">
          <ProList
            rowKey="id"
            headerTitle="TOP 10 TƯ VẤN VIÊN CÓ LƯỢT ĐẶT LỊCH NHIỀU NHẤT"
            expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
            dataSource={d[3].map((item) => ({
              ...item,
              title: item.fullName,
              avatar: item.imageUrl,
            }))}
            metas={{
              title: {},
              subTitle: {},
              description: {
                render: (_, record) => {
                  return (
                    <div>
                      <Rate disabled value={record.rating} />
                      <div>{record.email}</div>
                      <div>{record.phone}</div>
                      {/* <div>Cấp độ: {record.experience}</div> */}
                      <div>{record.experience && `Cấp độ: ${record.experience}`}</div>
                    </div>
                  );
                },
              },

              avatar: {},

              actions: {
                render: ({ props: { record } }) => {
                  return <a key="invite">Số lượt đặt lịch thành công : {record.booking}</a>;
                },
              },
            }}
          />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
};
