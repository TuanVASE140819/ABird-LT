import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image, message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import style from './zodiacdetail.less';
import { Content } from 'antd/lib/layout/layout';
import dayjs from 'dayjs';

const ShortZodiacDetail = (props) => {
  const { zodiac } = props;
  const buttonSubmitter = [
    {
      key: 'clearFieldFormZodiac',
      type: 'default',
      click: 'reset',
      name: 'Quay lại',
      loading: false,
    },
    {
      key: 'submitAddZodiac',
      type: 'primary',
      click: 'submit',
      name: 'Lưu',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'name',
      label: 'Tên khảo sát',
      width: 'lg',
      placeholder: 'Nhập tên khảo sát',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Vui lòng nhập tên khảo sát',
    },
  ];

  return (
    <>
      <Content
        className={style.site_layout_background}
        style={{
          padding: '40px 50px',
          boxShadow: '-1px 0px 12px -2px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* hiện thị  name và căn giữa  */}
        <Title level={2} style={{ textAlign: 'center' }}>
          {zodiac.name}
        </Title>
      </Content>
    </>
  );
};

export default ShortZodiacDetail;
