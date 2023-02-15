import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bar } from '@ant-design/plots';

export default () => {
  const data = [
    {
      label: 'Tháng 1',
      type: 'Nạp',
      value: 2800,
    },
    {
      label: 'Tháng 1',
      type: 'Rút',
      value: 2260,
    },
    {
      label: 'Tháng 2.',
      type: 'Nạp',
      value: 1800,
    },
    {
      label: 'Tháng 2.',
      type: 'Rút',
      value: 1300,
    },
    {
      label: 'Tháng 3',
      type: 'Nạp',
      value: 950,
    },
    {
      label: 'Tháng 3',
      type: 'Rút',
      value: 900,
    },
    {
      label: 'Tháng 4',
      type: 'Nạp',
      value: 500,
    },
    {
      label: 'Tháng 4',
      type: 'Rút',
      value: 390,
    },
    {
      label: 'Tháng 5',
      type: 'Nạp',
      value: 170,
    },
    {
      label: 'Tháng 5',
      type: 'Rút',
      value: 100,
    },
    {
        label: 'Tháng 6',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 6',
        type: 'Rút',
        value: 100,
    },
    {
        label: 'Tháng 7',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 7',
        type: 'Rút',
        value: 100,
    },
    {
        label: 'Tháng 8',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 8',
        type: 'Rút',
        value: 100,
    },
    {
        label: 'Tháng 9',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 9',
        type: 'Rút',
        value: 100,
    },
    {
        label: 'Tháng 10',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 10',
        type: 'Rút',
        value: 100,
    },
    {
        label: 'Tháng 11',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 11',
        type: 'Rút',
        value: 100,
    },
    {
        label: 'Tháng 12',
        type: 'Nạp',
        value: 170,
    },
    {
        label: 'Tháng 12',
        type: 'Rút',
        value: 100,
    }
  ];
  const config = {
    data,
    isGroup: true,
    xField: 'value',
    yField: 'label',

    /** 自定义颜色 */
    // color: ['#1383ab', '#c52125'],
    seriesField: 'type',
    marginRatio: 0,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'left', 'middle', 'right'
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
  return <Bar {...config} />;
};
