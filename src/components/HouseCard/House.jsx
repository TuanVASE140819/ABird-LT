import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import React from 'react';

export default function HouseCard({ house, handleClickCard }) {
  return (
    <Card hoverable onClick={() => handleClickCard(house)}>
      <Card.Meta avatar={<Avatar src={house.imageUrl} />} title={house.name} />
    </Card>
  );
}
