import { StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ABC() {
  const [responsive, setResponsive] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const accountId = localStorage.getItem('accountId');
    axios
      .get(
        `https://swpbirdboardingv1.azurewebsites.net/api/Home/Gettotaldashboard?accountid=${accountId}`,
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: 'TỔNG KHÁCH HÀNG',
            value: data.customer,
          }}
        />
        <StatisticCard
          statistic={{
            title: 'TỔNG DỊCH VU ĐÃ ĐĂT',
            value: data.service || '2000', // default value if data.totalCustomer is undefined
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
}
