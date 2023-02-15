import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Col, Input, Row, Skeleton } from 'antd';
import { ProCard } from '@ant-design/pro-components';

import { Card } from 'antd';
import { SyncOutlined, UserOutlined } from '@ant-design/icons';

const { Meta } = Card;
const Dashboard = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
      <Input.Search allowClear defaultValue="26888888" />{' '}
      <ProCard
        tabs={{
          type: 'card',
        }}
        style={{}}
      >
        <ProCard.TabPane key="tab1" tab="产品一">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
          </Row>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="产品二">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
          </Row>
        </ProCard.TabPane>
      </ProCard>
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '25%',
        overflow: 'auto',
      }}
    >
      <Button
        type="primary"
        style={{
          marginBottom: 10,
          borderRadius: 10,
          // nút nằm cách bên trái 30%
          marginLeft: '70%',
          width: '30%',
          height: '40px',
        }}
      >
        Thêm đơn hàng
      </Button>

      <ProCard title="Đặt đơn hàng hiện tại" extra={<SyncOutlined />} style={{}}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProCard
            title={
              <div>
                {' '}
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                <span style={{ marginLeft: 10 }}>Nguyễn Văn A</span>
              </div>
            }
            extra={<div>Đã gặp mặt</div>}
            bordered
          >
            {
              <div
                style={{
                  color: 'blue',
                }}
              >
                400.000VND
              </div>
            }
          </ProCard>
          <ProCard
            title={
              <div>
                {' '}
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                <span style={{ marginLeft: 10 }}>Nguyễn Văn A</span>
              </div>
            }
            extra={<div>Đã gặp mặt</div>}
            bordered
          >
            {
              <div
                style={{
                  color: 'blue',
                }}
              >
                400.000VND
              </div>
            }
          </ProCard>
          <ProCard
            title={
              <div>
                {' '}
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                <span style={{ marginLeft: 10 }}>Nguyễn Văn A</span>
              </div>
            }
            extra={<div>Đã gặp mặt</div>}
            bordered
          >
            {
              <div
                style={{
                  color: 'blue',
                }}
              >
                400.000VND
              </div>
            }
          </ProCard>
          <ProCard
            title={
              <div>
                {' '}
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                <span style={{ marginLeft: 10 }}>Nguyễn Văn A</span>
              </div>
            }
            extra={<div>Đã gặp mặt</div>}
            bordered
          >
            {
              <div
                style={{
                  color: 'blue',
                }}
              >
                400.000VND
              </div>
            }
          </ProCard>
        </div>
      </ProCard>
    </div>
  </div>
);

export default Dashboard;
