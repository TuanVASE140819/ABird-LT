import { PageContainer, ProCard } from '@ant-design/pro-components';
import { EyeFilled, EditOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Skeleton } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { history } from 'umi';
import { deleteSurvey } from '@/services/SurveyService/survey';

import React, { useEffect, useState } from 'react';

const surveyType = (props) => {
  const { surveyType, onClick, onEdit, onDelete, onChange } = props;
  return (
    <ProCard style={{ height: 180 }}>
      <Card
        style={{
          width: '100%',
          border: '1px solid #722ED1',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          transition: '0.3s',
          cursor: 'pointer',
          borderBlockColor: '#722ED1',
        }}
        actions={[
          <EditOutlined key="edit" style={{}} onClick={() => onEdit(surveyType)} />,
          surveyType.status === 'inactive' ? (
            <EyeInvisibleOutlined style={{}} onClick={() => onDelete(surveyType)} />
          ) : (
            <EyeFilled style={{}} onClick={() => onDelete(surveyType)} />
          ),
        ]}
      >
        <Meta
          style={{
            height: '150%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={surveyType.name}
          onClick={() => onClick(surveyType)}
        />
      </Card>
    </ProCard>
  );
};

export default surveyType;
