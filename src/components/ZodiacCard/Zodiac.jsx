import { EditOutlined, FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';
import styles from './zodiac.less';

const Zodiac = (props) => {
  const { style, handleClickCard, zodiac, button, handleButtonView } = props;

  const handleClickCardChild = (zodiac) => {
    if (handleClickCard) {
      handleClickCard(zodiac);
    }
  };

  const handleButtonViewChild = (zodiac) => {
    if (handleButtonView) {
      handleButtonView(zodiac);
    }
  };
  return (
    <>
      {style ? (
        <Card
          onClick={handleClickCardChild}
          bordered={true}
          style={{
            border: '1px solid #722ED1',
            boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          }}
          className={styles.card}
        >
          {button ? (
            <Row>
              <Col span={16}>
                <Meta
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  avatar={<Avatar src={zodiac.imageUrl} />}
                  title={zodiac.name}
                />
              </Col>
            </Row>
          ) : (
            <Meta avatar={<Avatar src={zodiac.imageUrl} />} title={zodiac.name} />
          )}
        </Card>
      ) : (
        <Card
          onClick={() => handleClickCardChild(zodiac)}
          bordered={true}
          style={{
            boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          }}
          className={styles.card}
        >
          {button ? (
            <Row>
              <Col span={16}>
                <Meta
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  avatar={<Avatar src={zodiac.imageUrl} />}
                  title={zodiac.name}
                />
              </Col>
            </Row>
          ) : (
            <Meta avatar={<Avatar src={zodiac.imageUrl} />} title={zodiac.name} />
          )}
        </Card>
      )}
    </>
  );
};

export default Zodiac;
