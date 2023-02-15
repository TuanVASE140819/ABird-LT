import { StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';

export default function ABC({ data }) {
  const [responsive, setResponsive] = useState(false);

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
            title: 'ĐẶT LỊCH THÀNH CÔNG',
            value: data.sucessBooking,
            // icon: (<img style={imgStyle} src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ" alt="icon"/>),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'KHÁCH HÀNG',
            value: data.totalCustomer,
          }}
        />
        <StatisticCard
          statistic={{
            title: 'TƯ VẤN VIÊN',
            value: data.totalConsultant,
          }}
        />
        <StatisticCard
          statistic={{
            title: 'TỔNG TIỀN TỪ ĐẶT LỊCH (VNĐ)',
            // totalIncome nhân 1000 để đổi từ triệu sang đồng
            value: data.totalPriceFromBooking * 1000,
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
}
