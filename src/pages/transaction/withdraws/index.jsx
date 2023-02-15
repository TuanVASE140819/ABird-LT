import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import request from 'umi-request';

// https://psycteamv2.azurewebsites.net/api/Deposits/acceptdeposit?id=1
const acceptDeposit = async (id) => {
  const res = await request(
    `https://psycteamv2.azurewebsites.net/api/Withdrawals/acceptwithdraw?id=${id}`,
    {
      method: 'PUT',
    },
  );
  return res;
};

//https://psycteamv2.azurewebsites.net/api/Withdrawals/rejectwithdraw?id=1&description=nono
const rejectDeposit = async (id, description) => {
  const res = await request(
    `https://psycteamv2.azurewebsites.net/api/Withdrawals/rejectwithdraw?id=${id}&description=${description}`,
    {
      method: 'PUT',
    },
  );
  return res;
};

export default () => {
  const actionRef = useRef();
  const [rejectPopup, setRejectPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const showRejectPopup = () => setRejectPopup(true);
  const hideRejectPopup = () => setRejectPopup(false);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'Tên tư vấn viên',
      dataIndex: 'consultantName',
      valueType: 'text',
      sorter: (a, b) => a.consultantName - b.consultantName,
      copyable: true,
      ellipsis: true,
    },
    {
      title: 'Tên tài khoản',
      search: false,
      dataIndex: 'accountName',
      valueType: 'text',
      sorter: (a, b) => a.accountName - b.accountName,
      copyable: true,
      ellipsis: true,
      tip: 'Tên tài khoản',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Tên tài khoản là bắt buộc',
          },
        ],
      },
    },
    {
      title: 'Tên ngân hàng',
      dataIndex: 'bankName',
      valueType: 'text',
      search: false,
      sorter: (a, b) => a.bankName - b.bankName,
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankNumber',
      valueType: 'text',
      width: 150,
      search: false,
      sorter: (a, b) => a.bankNumber - b.bankNumber,
      copyable: true,
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'dateCreate',
      valueType: 'date',
      search: true,
      width: 100,
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
      title: 'Số tiền yêu cầu (VNĐ)',
      search: false,
      width: 100,
      dataIndex: 'requestAmount',
      valueType: 'text',
      sorter: (a, b) => a.requestAmount - b.requestAmount,
      // render: (dom, entity) => {
      //   return (
      //     <Tag color="green">
      //       {/* {nếu amount nhỏ hơn 999 và lớn hơn 0 thì hiện thị amount và thêm dấu phẩn ở hàng nghìn} */}
      //       {entity.requestAmount < 999 && entity.requestAmount < 0
      //         ? entity.requestAmount
      //         : entity.requestAmount < 0
      //         ? entity.requestAmount
      //         : entity.requestAmount.toLocaleString('vi-VN', { minimumFractionDigits: 3 })}
      //     </Tag>
      //   );
      // },
      render: (dom, entity) => {
        return (
          <div
            style={{
              // in đậm
              fontWeight: 'bold',
            }}
          >
            {/* {nếu amount nhỏ hơn 999 và lớn hơn 0 thì hiện thị amount và thêm dấu chấm ở hàng nghìn} */}
            {entity.requestAmount < 999 && entity.requestAmount < 0
              ? entity.requestAmount
              : entity.requestAmount < 0
              ? entity.requestAmount
              : // sau 3 chữ số thì thêm dấu chấm ở hàng nghìn
                entity.requestAmount.toLocaleString('vi-VN', { minimumFractionDigits: 3 })}
          </div>
        );
      },
    },
    // {
    //   title: 'Số tiền thực tế (VNĐ)',
    //   search: false,
    //   width: 100,
    //   dataIndex: 'actualWithdrawal',
    //   valueType: 'text',
    //   sorter: (a, b) => a.actualWithdrawal - b.actualWithdrawal,
    //   render: (dom, entity) => {
    //     return (
    //       <div
    //         style={{
    //           // in đậm
    //           fontWeight: 'bold',
    //         }}
    //       >
    //         {/* {nếu amount nhỏ hơn 999 và lớn hơn 0 thì hiện thị amount và thêm dấu phẩn ở hàng nghìn} */}
    //         {entity.actualWithdrawal < 999 && entity.actualWithdrawal < 0
    //           ? entity.actualWithdrawal
    //           : entity.actualWithdrawal < 0
    //           ? entity.actualWithdrawal
    //           : entity.actualWithdrawal.toLocaleString('vi-VN', { minimumFractionDigits: 3 })}
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Trạng thái',
      width: 100,
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
          return <Tag color="error">Từ chối</Tag>;
        }
      },
    },
    {
      title: 'Ghi chú',
      width: 100,
      dataIndex: 'description',
      valueType: 'text',

      search: false,
      sorter: (a, b) => a.description - b.description,
      ellipsis: true,
      tip: 'Mô tả',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Mô tả là bắt buộc',
          },
        ],
      },
    },
    {
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
              <Button
                onClick={() => {
                  setSelectedId(entity.id);
                  showRejectPopup();
                }}
              >
                Từ chối
              </Button>
            </Space>
          )
        );
      },
    },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          //psycteam.azurewebsites.net/api/Deposits/Getalldeposit?date=2002&walletid=1&pagesize=20&pagenumber=1
          https: return request(
            'https://psycteamv2.azurewebsites.net/api/Withdrawals/Getallwithdraw',
            {
              params: {
                ...params,
                search: params.consultantName,
                date: params.dateCreate,
                pageSize: params.pageSize,
                pageNumber: params.current,
              },
            },
          );
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
          //phân trang theo api trả về
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          defaultPageSize: 10,
          defaultCurrent: 1,
          total: 100,
          showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} kết quả`,
        }}
        dateFormatter="string"
        headerTitle="Danh sách giao dịch rút tiền"
        toolBarRender={() => []}
      />

      {rejectPopup && (
        <RejectPopup
          id={selectedId}
          onCancel={hideRejectPopup}
          onOK={() => {
            actionRef.current?.reload();
          }}
        />
      )}
    </>
  );
};

const RejectPopup = ({ id, onCancel, onOK }) => {
  const [reason, setReason] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const _onOK = async () => {
    try {
      setConfirmLoading(true);
      await rejectDeposit(id, reason);
      onCancel();
      onOK();
    } catch (error) {
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="Chọn lý do từ chối"
      open
      onOk={_onOK}
      //Button OK sẽ hiện thị khi có lý do từ chối
      okButtonProps={{ disabled: !reason }}
      okText="Từ chối"
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Input value={reason} onChange={(e) => setReason(e.target.value)} />
    </Modal>
  );
};
