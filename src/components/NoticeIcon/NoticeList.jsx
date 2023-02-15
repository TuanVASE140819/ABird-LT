import { Avatar, List } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import { seenNoti } from '@/services/ant-design-pro/api';
const moment = require('moment');
const NoticeList = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }

  return (
    <div>
      <List
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          }); // eslint-disable-next-line no-nested-ternary

          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;
          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={async () => {
                await seenNoti(item.id);
                onClick?.(item);
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div className={styles.description}>
                    {item.status === 'seen' ? (
                      <div style={{ color: 'gray' }}>
                        {item.description}
                        <div className={{ color: 'gray' }}>
                          {moment(item.dateCreate).locale('vi').fromNow()}
                        </div>
                        <div className={styles.datetime}>
                          {item.status === 'notseen' ? 'Chưa xem' : 'Đã xem'}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: 'black' }}>{item.description}</div>
                        <div className={{ color: 'black' }}>
                          {moment(item.dateCreate).locale('vi').fromNow()}
                        </div>
                        <div className={styles.datetime}>
                          {item.status === 'notseen' ? 'Chưa xem' : 'Đã xem'}
                        </div>
                      </div>
                    )}
                  </div>
                  // <div>
                  //   {/* cắt chuỗi mô tả không hiện thị Chở xử lý trở đi */}
                  //   <div className={styles.description}>
                  //     {item.description.length > 50
                  //       ? item.description.slice(0, 40) + '...'
                  //       : item.description}
                  //   </div>

                  //   <div className={styles.description}>
                  //     Mã giao dịch: {item.description.slice(-8)}
                  //   </div>
                  //   <div className={styles.datetime}>
                  //     {moment(item.dateCreate).locale('vi').fromNow()}
                  //   </div>
                  //   <div className={styles.datetime}>
                  //     {item.status === 'notseen' ? 'Chưa xem' : 'Đã xem'}
                  //   </div>
                  // </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
