import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Col, Input, Row, Skeleton, Modal, Space } from 'antd';
import { ProCard } from '@ant-design/pro-components';

import { Card } from 'antd';
import { SyncOutlined, UserOutlined } from '@ant-design/icons';
const { Meta } = Card;
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
        <Input.Search allowClear defaultValue="Chào mào" />{' '}
        <ProCard
          tabs={{
            type: 'card',
          }}
          style={{}}
        >
          <ProCard.TabPane key="tab1" tab="Tất cả">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/anh-chim-chao-mao.jpg"
                    />
                  }
                >
                  <Meta title="Gà đi bộ" description="1 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-chao-mao-cui-800x450.jpg"
                    />
                  }
                >
                  <Meta title="Sáo nâu" description="2 ngày" />
                </Card>
              </Col>
            </Row>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="Ngày">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/anh-chim-chao-mao.jpg"
                    />
                  }
                >
                  <Meta title="Gà đi bộ" description="1 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-chao-mao-cui-800x450.jpg"
                    />
                  }
                >
                  <Meta title="Sáo nâu" description="2 ngày" />
                </Card>
              </Col>
            </Row>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab3" tab="Loại chim">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-anh-chao-mao-lan-te-trong-long.jpg"
                    />
                  }
                >
                  <Meta title="Chào mào" description="3 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/anh-chim-chao-mao.jpg"
                    />
                  }
                >
                  <Meta title="Gà đi bộ" description="1 ngày" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src="https://haycafe.vn/wp-content/uploads/2022/03/Hinh-chao-mao-cui-800x450.jpg"
                    />
                  }
                >
                  <Meta title="Sáo nâu" description="2 ngày" />
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
          onClick={showModal}
        >
          Tạo mới
        </Button>
        <Modal
          title="Modal"
          open={open}
          onOk={hideModal}
          onCancel={hideModal}
          okText="确认"
          cancelText="取消"
        >
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </Modal>
        <ProCard title="Đặt đơn hàng hiện tại" extra={<SyncOutlined />} style={{}}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ProCard
              title={
                <div>
                  {' '}
                  <Avatar shape="square" size="large" icon={<UserOutlined />} />
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 10,
                    }}
                  >
                    Nguyễn Văn A
                  </span>
                </div>
              }
              extra={
                <div
                  style={{
                    fontSize: 10,
                  }}
                >
                  Đã gặp mặt
                </div>
              }
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
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 10,
                    }}
                  >
                    Nguyễn Văn A
                  </span>
                </div>
              }
              extra={
                <div
                  style={{
                    fontSize: 10,
                  }}
                >
                  Đã gặp mặt
                </div>
              }
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
};

export default Dashboard;
