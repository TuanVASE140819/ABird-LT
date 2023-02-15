import { Col, Row } from 'antd';
import React from 'react';
import SurveyCard from './SurveyCard';

const SurveyTypeList = (props) => {
  const { dataList } = props;

  return (
    <Col
      gutter={[16, 16]}
      style={{
        marginBottom: '12px',
        marginTop: '12px',
      }}
    >
      {dataList.map((item) => (
        <SurveyCard surveyType={item} {...props} />
      ))}
    </Col>
  );
};

export default SurveyTypeList;
