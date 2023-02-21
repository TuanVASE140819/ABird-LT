import React, { useState, useEffect } from 'react';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Descriptions, Dropdown, Menu, message, Modal, Space, Tag, Select } from 'antd';
import { useRef } from 'react';
import request from 'umi-request';
import dayjs from 'dayjs';
import { MoreOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Option } = Select;
const accountId = localStorage.getItem('accountId');

const Customers = () => {
  const [defaultValue, setDefaultValue] = useState([]);
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
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
      render: (_, record) => {
        const dateStart = dayjs(record.dateStart).format('DD/MM/YYYY');
        return (
          <Space>
            <Tag color="geekblue">{dateStart}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'dateEnd',

      valueType: 'text',
      search: false,

      sorter: (a, b) => a.dateEnd - b.dateEnd,
      tip: 'Ngày kết thúc',
      render: (_, record) => {
        const dateEnd = dayjs(record.dateEnd).format('DD/MM/YYYY');
        return (
          <Space>
            <Tag color="geekblue">{dateEnd}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'text',
      search: false,
      sorter: (a, b) => a.status - b.status,
      tip: 'Trạng thái',
      render: (text, record) => {
        if (record.status === 'waiting') {
          return <Tag color="warning">Đang chờ</Tag>;
        } else if (record.status === 'accepted') {
          return <Tag color="success">Đã chấp nhận</Tag>;
        } else {
          return <Tag color="error">Đã từ chối</Tag>;
        }
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (text, record, _, action) => {
        if (record.status === 'waiting') {
          return [
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
              <Button type="primary">Chấp nhận</Button>
            </a>,
            <a
              key="delete"
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận từ chối',
                  content: 'Bạn có chắc chắn muốn từ chối không?',
                  okText: 'Xác nhận',
                  cancelText: 'Hủy',
                  onOk: async () => {
                    await rejectBooking(record.id);
                    message.success('Từ chối thành công');
                    action?.reload();
                  },
                });
              }}
            >
              <Button type="danger">Từ chối</Button>
            </a>,
          ];
        } else {
          return [];
        }
      },
    },
    {
      // nút dịch vị thêm sẽ hiện thi modal để thêm dịch vụ
      title: 'Dịch vụ',
      valueType: 'option',
      render: (text, record, _, action) => {
        return [
          <a
            key="editable"
            onClick={async () => {
              try {
                const response = await axios.get(
                  `https://swpbirdboardingv1.azurewebsites.net/api/Services/GetServiceList?id=${accountId}&pagesize=10&pagenumber=1`,
                );
                const respbooking = await axios.get(
                  `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingDetail?id=${record.id}`,
                );
                const booking = respbooking.data;

                const databooked = booking.data[0].service.map((service) => service.id);
                console.log(defaultValue);
                const services = response.data;

                Modal.info({
                  title: 'Dịch vụ',
                  content: (
                    <Select
                      mode="multiple"
                      style={{
                        width: '100%',
                      }}
                      placeholder="Chọn dịch vụ"
                      optionLabelProp="label"
                      defaultValue={databooked}
                    >
                      {services.data.map((service) => (
                        <Option value={service.id} label={service.name}>
                          <div className="demo-option-label-item">{service.name}</div>
                        </Option>
                      ))}
                    </Select>
                  ),
                  onOk: async (value) => {
                    const data = {
                      id: record.id,
                      service: value,
                    };
                    try {
                      const response = await axios.post(
                        `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/UpdateServiceBooking`,
                        data,
                        {
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        },
                      );
                      if (response.status === 200) {
                        message.success('Cập nhật thành công');
                        action?.reload();
                      }
                    } catch (error) {
                      console.error(error);
                      message.error('Cập nhật thất bại');
                    }
                  },
                  onCancel() {},
                });
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <Button type="primary">Thêm dịch vụ</Button>
          </a>,
        ];
      },
    },

    {
      valueType: 'option',
      render: (text, record, _, action) => {
        return [
          <a
            key="editable"
            onClick={async () => {
              try {
                const response = await fetch(
                  `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingDetail?id=${record.id}`,
                );

                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // console.log(data.data[0].service);
                Modal.info({
                  title: 'Chi tiết đặt chỗ',
                  content: (
                    // hiện thị chi tiết đặt chỗ theo đúng id
                    <div>
                      <p>
                        <b>Tên khách hàng: </b>
                        {data.data[0].customerName}
                      </p>
                      <p>
                        <b>Tên chim: </b>
                        {data.data[0].birdOfCustomer}
                      </p>
                      <p>
                        <b>Ngày bắt đầu: </b>
                        {dayjs(data.data[0].dateStart).format('DD/MM/YYYY')}
                      </p>
                      <p>
                        <b>Ngày kết thúc: </b>
                        {dayjs(data.data[0].dateEnd).format('DD/MM/YYYY')}
                      </p>
                      <p>
                        <b>Trạng thái: </b>

                        {data.data[0].status === 'waiting' ? (
                          <Tag color="warning">Đang chờ</Tag>
                        ) : data.data[0].status === 'accepted' ? (
                          <Tag color="success">Đã chấp nhận</Tag>
                        ) : (
                          <Tag color="error">Đã từ chối</Tag>
                        )}
                      </p>
                      <p>
                        <b>Dịch vụ: </b>
                        {data.data[0].service.map((item) => (
                          <Tag color="geekblue">{item.name}</Tag>
                        ))}
                        ,
                      </p>
                    </div>
                  ),
                });
              } catch (error) {
                console.error('There was an error!', error);
              }
            }}
          >
            <MoreOutlined />
          </a>,
        ];
      },
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

        return request(
          // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingList?accountid=3&pagesize=10&pagenumber=1
          `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingList?accountid=${accountId}&pagesize=${params.pageSize}&pagenumber=${params.current}`,
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

export default React.memo(Customers);
