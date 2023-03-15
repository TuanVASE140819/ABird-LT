import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row, Skeleton } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import ProSkeleton from '@ant-design/pro-skeleton';
import Divider from '@/components/Divider';
import StatisticCard from '@/components/StatisticCard';
import {
  getReportDepositByYear,
  getTopConsultantsByRate,
  getTotalDashboard,
} from '@/services/Report';
const Revenue = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await Promise.all([
          getTotalDashboard(),

          getReportDepositByYear(),
          getTopConsultantsByRate(),
        ]);

        setData(res);
      } catch (error) {}
    };

    getData();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <>
      {
        //loading 3 giây
        (setTimeout(() => {
          setLoading(true);
        }, 3000),
        loading ? (
          <PageContainer>
            <Content>
              <Row gutter={16}>
                <Col span={24}>
                  <Divider data={data[0]} />
                </Col>
              </Row>
              <Row
                gutter={16}
                style={{
                  marginTop: 24,
                  width: '100%',
                }}
              >
                <StatisticCard d={data} />z
              </Row>
            </Content>
          </PageContainer>
        ) : (
          <ProSkeleton
            type="descriptions"
            loading={loading}
            active
            title
            paragraph={{ rows: 4 }}
            avatar
            row={4}
            delay={4000}
          >
            <PageContainer>
              <Content>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Divider data={data[0]} />
                  </Col>
                  <Col span={24}>
                    <StatisticCard data={data[1]} />
                  </Col>
                  <Col span={24}>
                    <StatisticCard data={data[2]} />
                  </Col>
                  <Col span={24}>
                    <StatisticCard data={data[3]} />
                  </Col>
                </Row>
              </Content>
            </PageContainer>
          </ProSkeleton>
        ))
      }
    </>
  );
};

export default Revenue;
