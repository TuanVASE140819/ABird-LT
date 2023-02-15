import { ProCard } from '@ant-design/pro-components';
import { history } from 'umi';
import Withdraws from '../transaction/withdraws';
import Deposits from '../transaction/deposits';

const onClickDetail = (item) => {
  // chuyển qua trang thông báo
  history.push('/notification');
};

export default () => {
  return (
    <ProCard
      tabs={{
        type: 'card',
      }}
    >
      <ProCard.TabPane key="tab1" tab="Thông báo nạp tiền">
        <Deposits />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab2" tab="Thông báo rút tiền">
        <Withdraws />
      </ProCard.TabPane>
    </ProCard>
  );
};
