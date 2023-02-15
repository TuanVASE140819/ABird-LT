import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useModel, useRequest } from 'umi';
import { getNotices, seenAllNoti } from '@/services/ant-design-pro/api';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import 'moment/locale/vi';

const NoticeIconView = () => {
  // const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState([]);

  const [notifyList, setNotifyList] = useState([]);

  useEffect(() => {
    const getNotifyList = async () => {
      try {
        // const { data } = await getNotices();
        // hiện thị 12 thông báo mới nhất
        const { data } = await getNotices({ limit: 20 });
        setNotifyList(data);
      } catch (error) {}
    };

    getNotifyList();

    const interval = setInterval(() => {
      getNotifyList();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const depositList = notifyList.filter((item) => item.type === 'deposit');
  const withdrawList = notifyList.filter((item) => item.type === 'withdraw');
  const depositUnread = depositList.filter((item) => item.status === 'notseen').length;
  const withdrawUnread = withdrawList.filter((item) => item.status === 'notseen').length;
  const totalUnread = depositUnread + withdrawUnread;

  const changeReadState = (id) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };

        if (notice.id === id) {
          notice.read = true;
        }

        return notice;
      }),
    );
  };

  const clearReadState = (title, key) => {
    //  seen all notification
    seenAllNoti(currentUser.id).then((res) => {
      if (res.status === 201) {
        message.success('Đã đánh dấu tất cả là đã đọc');
      }
    });
  };

  return (
    <>
      <NoticeIcon
        className={styles.action}
        // set timeout 1000 s for variable coun
        count={totalUnread}
        onItemClick={(item) => {
          changeReadState(item.id);
          // nếu tyle là deposit thì chuyển hướng đến trang nạp tiền
          if (item.type === 'deposit') {
            window.location.href = '/transaction/deposits';
          }
          // nếu tyle là withdraw thì chuyển hướng đến trang rút tiền
          if (item.type === 'withdraw') {
            window.location.href = '/transaction/withdraws';
          }
        }}
        onClear={(title, key) => clearReadState(title, key)}
        loading={false}
        clearText="Xem hết -"
        viewMoreText="Xem thêm"
        onViewMore={
          () => {
            // chuyển hướng đến trang thông báo
            window.location.href = '/notification';
          }
          // onClickDetail
        }
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="message"
          color="#108ee9"
          count={depositUnread}
          list={depositList}
          title="Nạp tiền"
          emptyText="您已读完所有消息"
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="event"
          title="Rút tiền"
          emptyText="你已完成所有待办"
          count={withdrawUnread}
          list={withdrawList}
          showViewMore
        />
      </NoticeIcon>
    </>
  );
};

export default NoticeIconView;
