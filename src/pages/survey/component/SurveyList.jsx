import { Col, Row } from 'antd';
import React from 'react';
import ZodiacDetail from './ZodiacDetail';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const SurveyList = (props) => {
  const { dataList } = props;

  const handleChange = (key) => {
    console.log(key);
  };

  const handleTabClick = (key) => {
    console.log(key);
  };

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        tabPosition="top"
        size="large"
        type="line"
        centered={true}
        onChange={handleChange}
        onTabClick={handleTabClick}
      >
        <TabPane>
          <ZodiacDetail zodiac={dataList} />
        </TabPane>
      </Tabs>
    </>
  );
};
export default SurveyList;
