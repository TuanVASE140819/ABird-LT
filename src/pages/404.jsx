import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Quay lại trang chủ
      </Button>
    }
  />
);

export default NoFoundPage;
