import React, { useCallback, useState } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import { removeAppToken, removeUserInfo } from '@/utils/utils';

const loginOut = async () => {
  // await outLogin();
  location.href = '/user/login';
  // const { query = {}, pathname } = history.location;
  // const { redirect } = query; // Note: There may be security issues, please note

  // if (window.location.pathname !== '/user/login' && !redirect) {
  //   history.replace({
  //     pathname: '/user/login',
  //   });
  // }
};
const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;

      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        removeAppToken();
        removeUserInfo();
        loginOut();
        return;
      }
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  const { currentUser } = initialState;
  // console.log('currentUser InSite', currentUser);

  // if (!currentUser || !currentUser.username) {
  //   return loading;
  // }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={
            'https://firebasestorage.googleapis.com/v0/b/psycteamv1.appspot.com/o/useravatar%2F1668765098525th%20(3).jpg?alt=media&token=f04f8d82-c243-4072-8d87-45e955091e2d'
          }
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>Lưu Trú 1</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
