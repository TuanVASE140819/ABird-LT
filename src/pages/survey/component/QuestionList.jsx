import { Col, Modal, Row, Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Question from './Question';
import SurveyCard from './SurveyCard';

const QuestionList = (props) => {
  const { dataList } = props;

  return (
    <>
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
    </>
  );
};

export default QuestionList;
