import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';


export default () => {
  const data = [
    {
      type: 'Gia đình',
      value: 27,
    },
    {
      type: 'Sự nghiệp',
      value: 25,
    },
    {
      type: 'Tình cảm',
      value: 18,
    },
    {
      type: 'Tâm lý',
      value: 15,
    },
    {
      type: 'Tài chính',
      value: 10,
    },
    {
      type: 'Tình yêu',
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
    return <Pie {...config} />;

};
