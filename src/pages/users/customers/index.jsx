import React from 'react';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Menu, message, Modal, Space, Tag } from 'antd';
import { useRef } from 'react';
import request from 'umi-request';

const columns = [
  // {
  //   "id": 1,
  //   "dateBooking": "2023-02-16T00:00:00",
  //   "customerName": "Tester",
  //   "birdOfCustomer": "Chim Sáo",
  //   "dateStart": "2023-02-16T00:00:00",
  //   "dateEnd": "2023-02-20T00:00:00",
  //   "status": "waiting"
  // },
  {
    title: 'STT',
    dataIndex: 'id',
    valueType: 'index',
    width: 48,
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
    title: 'Tên chim',
    dataIndex: 'birdOfCustomer',
    valueType: 'text',
    search: false,

    sorter: (a, b) => a.birdOfCustomer - b.birdOfCustomer,
    tip: 'Tên chim',
    formItemProps: {
      rules: [
        {
          required: false,
          message: 'Tên chim là bắt buộc',
        },
      ],
    },
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'dateStart',
    valueType: 'text',
    search: false,
    sorter: (a, b) => a.dateStart - b.dateStart,
    tip: 'Ngày bắt đầu',
    formItemProps: {
      rules: [
        {
          required: false,
          message: 'Ngày bắt đầu là bắt buộc',
        },
      ],
    },
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'dateEnd',

    valueType: 'text',
    search: false,

    sorter: (a, b) => a.dateEnd - b.dateEnd,
    tip: 'Ngày kết thúc',
    formItemProps: {
      rules: [
        {
          required: false,
          message: 'Ngày kết thúc là bắt buộc',
        },
      ],
    },
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    valueType: 'text',
    search: false,
    sorter: (a, b) => a.status - b.status,
    tip: 'Trạng thái',
    formItemProps: {
      rules: [
        {
          required: false,

          message: 'Trạng thái là bắt buộc',
        },
      ],
    },
  },
  {
    title: 'Thao tác',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          Modal.confirm({
            title: 'Xác nhận chấp nhận',
            content: 'Bạn có chắc chắn muốn chấp nhận không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
              await acceptBooking(record.id);
              message.success('Chấp nhận thành công');
              action?.reload();
            },
          });
        }}
      >
        Chap nhan
      </a>,
      <a
        key="delete"
        onClick={() => {
          Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
              await deleteBooking(record.id);
              message.success('Xóa thành công');
              action?.reload();
            },
          });
        }}
      >
        Xóa
      </a>,
    ],
  },
];

// https://psycteamv2.azurewebsites.net/api/Deposits/acceptdeposit?id=1
const acceptBooking = async (id) => {
  const res = await request(
    // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/AcceptBooking?id=12
    `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/AcceptBooking?id=${id}`,
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
        const id = localStorage.getItem('accountId');
        return request(
          // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingList?accountid=3&pagesize=10&pagenumber=1
          `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingList?accountid=${id}&pagesize=${params.pageSize}&pagenumber=${params.current}`,
          {
            method: 'GET',
            params: {
              page: params.current,
              pageSize: params.pageSize,
            },
          },
        ).then((res) => {
          setTotal(res.total);
          return {
            data: res.data,
            success: true,
          };
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
