import React from 'react';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Menu, message, Modal, Space, Tag } from 'antd';
import { useRef } from 'react';
import request from 'umi-request';

const columns = [
  {
    title: 'STT',
    dataIndex: 'id',
    valueType: 'index',
    width: 48,
  },
  {
    title: 'Mã giao dịch',
    dataIndex: 'code',
    valueType: 'text',
    sorter: (a, b) => a.code - b.code,
    copyable: true,
    ellipsis: true,
    tip: 'Mã giao dịch là ID duy nhất của giao dịch',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Mã giao dịch là bắt buộc',
        },
      ],
    },
  },

  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    valueType: 'text',
    search: false,
    sorter: (a, b) => a.customerName - b.customerName,
    tip: 'Tên khách hàng',
    formItemProps: {
      rules: [
        {
          required: false,
          message: 'Tên khách hàng là bắt buộc',
        },
      ],
    },
  },
  {
    title: 'Số tiền (VNĐ)',
    dataIndex: 'amount',
    valueType: 'text',
    search: false,
    sorter: (a, b) => a.amount - b.amount,

    render: (dom, entity) => {
      return (
        <div
          style={{
            // in đậm
            fontWeight: 'bold',
          }}
        >
          {/* {nếu amount nhỏ hơn 999 và lớn hơn 0 thì hiện thị amount và thêm dấu chấm ở hàng nghìn} */}
          {entity.amount < 999 && entity.amount < 0
            ? entity.amount
            : entity.amount < 0
            ? entity.amount
            : // sau 3 chữ số thì thêm dấu chấm ở hàng nghìn
              entity.amount.toLocaleString('vi-VN', { minimumFractionDigits: 3 })}
        </div>
      );
    },
  },
  // render: (dom, entity) => {
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    search: false,
    valueType: 'text',
    render: (dom, entity) => {
      if (entity.status === 'waiting') {
        return <Tag color="warning">Đang chờ</Tag>;
      }

      if (entity.status === 'success') {
        return <Tag color="success">Chấp nhận</Tag>;
      }

      if (entity.status === 'fail') {
        return <Tag color="error">Quá hạn</Tag>;
      }
    },
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'dateCreate',
    valueType: 'date',
    search: true,
    sorter: (a, b) => a.dateCreate - b.dateCreate,
    // format 2022-10-23 (12:12:12)
    render: (dom, entity) => {
      if (entity.dateCreate) {
        return (
          entity.dateCreate.split('T')[0] +
          ' (' +
          entity.dateCreate.split('T')[1].split('.')[0] +
          ')'
        );
      }
    },
  },
  {
    // title: 'Hành động',
    valueType: 'option',
    render: (dom, entity) => {
      return (
        // Nếu trạng thái là đang chờ thì hiện thị 2 nút chấp nhận và từ chối giao dịch nếu không thì không hiện thị
        entity.status === 'waiting' && (
          <Space>
            <Button
              // màu xanh lá cây
              type="primary"
              onClick={() => {
                acceptDeposit(entity.id);
                // sau 4 s thì reload lại trang
                setTimeout(() => {
                  window.location.reload();
                  message.success('Chấp nhận giao dịch thành công');
                }, 4000);
              }}
            >
              Chấp nhận
            </Button>
            {/* <Button
              onClick={() => {
                // rejectDeposit(entity.id);
                // setTimeout(() => {
                //   window.location.reload();
                //   message.success('Chấp nhận giao dịch thành công');
                // }, 4000);
                Modal.confirm({
                  title: 'Từ chối giao dịch',
                  content: 'Bạn có chắc chắn muốn từ chối giao dịch này?',
                  okText: 'Từ chối',
                  cancelText: 'Hủy',
                  onOk: () => {
                    rejectDeposit(entity.id);
                    setTimeout(() => {
                      window.location.reload();
                      message.success('Từ chối giao dịch thành công');
                    }, 4000);
                  },
                });
              }}
            >
              Từ chối
            </Button> */}
          </Space>
        )
      );
    },
  },
];

// https://psycteamv2.azurewebsites.net/api/Deposits/acceptdeposit?id=1
const acceptDeposit = async (id) => {
  const res = await request(
    `https://psycteamv2.azurewebsites.net/api/Deposits/acceptdeposit?id=${id}`,
    {
      method: 'PUT',
    },
  );
  return res;
};

//https://psycteamv2.azurewebsites.net/api/Deposits/rejectdeposit?id=1
const rejectDeposit = async (id) => {
  const res = await request(
    `https://psycteamv2.azurewebsites.net/api/Deposits/rejectdeposit?id=${id}`,
    {
      method: 'PUT',
    },
  );
  return res;
};

export default () => {
  const actionRef = useRef();
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(90);
  //trigger render table
  const [triggerDataTable, setTriggerDataTable] = React.useState(false);
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        //psycteam.azurewebsites.net/api/Deposits/Getalldeposit?date=2002&walletid=1&pagesize=20&pagenumber=1
        return request('https://psycteamv2.azurewebsites.net/api/Deposits/Getalldeposit', {
          params: {
            ...params,
            date: params.dateCreate,
            pageSize: params.pageSize,
            pageNumber: params.current,
            total: params.totalpage,
          },
          setTotal: params.totalpage,
        });
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        searchText: 'Tìm kiếm',
        submittext: 'Xác nhận',
        resetText: 'Quay lại',
        placeholderTitle: 'Tìm kiếm',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return Object.assign(Object.assign({}, values), {
              created_at: [values.startTime, values.endTime],
            });
          }
          return values;
        },
      }}
      pagination={{
        //mặc định là 10
        pageSize: 10,
        showSizeChanger: true,
        total: total,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giao dịch`,
      }}
      dateFormatter="string"
      headerTitle="Danh sách giao dịch nạp tiền"
      toolBarRender={() => []}
    />
  );
};
