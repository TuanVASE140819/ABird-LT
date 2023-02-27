import { EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, message, Space, Tag, Rate, Modal } from 'antd';
import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import {
  getBookingList,
  getAConsutanlt,
  editConsutanlt,
  getSpecializationsByUserId,
  getSpecializations,
  editConsutanltSpecialization,
  editConsutanltStatus,
} from '@/services/UserService/consutanlts';
import { useModel } from 'umi';
import { uploadFile } from '@/utils/uploadFile';
import Profile from './component/Profile';
import { history } from 'umi';
import dayjs from 'dayjs';
import request from 'umi-request';

const User = () => {
  const column = [
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
      title: 'Dịch vụ',
      dataIndex: 'action',
      search: false,
      with: '30%',
      render: (_, record) => {
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '50%',
                marginRight: '8px',
              }}
            >
              <Button
                key="editConsutanlt"
                type="#722ED1"
                size="middle"
                // icon eye

                block={true}
                onClick={() => handleEditSpecialist(record)}
              >
                +
              </Button>
            </div>
          </div>
        );
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
                  cancelText: 'Hủy',
                  onOk: async () => {
                    console.log(record.id);
                    await acceptBooking(record.id);

                    message.success('Chấp nhận thành công');
                    action?.reload();
                  },
                });
              }}
            >
              <Button type="primary">Chấp nhận</Button>
            </a>,
          ];
        } else {
          return [];
        }
      },
    },
    {
      title: 'Xem thêm',
      valueType: 'option',
      render: (text, record, _, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              localStorage.setItem('bookingId', record.id);
              history.push(`/users/${record.id}`);
            }}
          >
            <Button type="primary">Chi tiết</Button>
          </a>,
        ];
      },
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFieldFormUser',
      type: 'default',
      click: 'reset',
      name: 'Quay lại',
      loading: false,
    },
    {
      key: 'submitAddUser',
      type: 'primary',
      click: 'submit',
      name: 'Lưu',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddUsername',
      label: 'Họ và tên',
      width: 'lg',
      placeholder: 'Nhập tên người dùng',
      name: 'username',
      requiredField: 'true',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPhoneNumberUser',
      label: 'Phone Number',
      width: 'lg',
      placeholder: 'Nhập số điện thoại',
      name: 'phoneNumber',
      requiredField: 'true',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Ảnh đại diện',
      width: 'lg',
      placeholder: 'Avatar Link',
      name: 'avatarLink',
      nameUpload: 'avatarUser',
      nameInputFile: 'avatarFileToFirebase',
      readOnly: 'true',
      // requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddUsername',
      label: 'Họ và tên',
      width: 'lg',
      placeholder: 'Nhập tên người dùng',
      name: 'fullName',
      value: 'fullname',
      requiredField: 'true',
      ruleMessage: 'Nhập tên người dùng',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPhoneNumberUser',
      label: 'Gmail',
      width: 'lg',
      placeholder: 'NHập gmail',
      name: 'email',
      readOnly: 'true',
      disabled: 'true',
      value: '',
      requiredField: 'true',
      ruleMessage: 'Nhập gmail',
      hidden: true,
    },
    // {
    //   fieldType: 'formSelect',
    //   key: 'selectStatusUser',
    //   name: 'status',
    //   label: 'Trạng thái',
    //   defaultValue: 1,
    //   valueEnum: [
    //     {
    //       valueName: 'active',
    //       valueDisplay: 'Hoạt động',
    //     },
    //     {
    //       valueName: 'inactive',
    //       valueDisplay: 'Khóa',
    //     },
    //   ],
    //   placeholder: 'Chọn trạng thái',
    //   requiredField: 'true',
    //   ruleMessage: 'Chọn trạng thái',
    // },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Ảnh đại diện',
      width: 'lg',
      placeholder: 'Avatar Link',
      name: 'imageUrl',
      nameUpload: 'avatarUser',
      nameInputFile: 'avatarFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Tải ảnh lên trước khi submit',
    },
  ];
  const formFieldEditSpecialist = [
    {
      fieldType: 'ProFormSelect',
      key: 'selectSpecialist',
      name: 'specialist',
      label: 'Chuyên môn',
      options: [
        //api get specialist
        {
          value: '1',
          label: 'Sự Nghiệp',
        },
        {
          value: '2',
          label: 'Gia Ðình',
        },
        {
          value: '3',
          label: 'Tình yêu',
        },
        {
          value: '4',
          label: 'Bạn Bè',
        },
        {
          value: '5',
          label: 'Các loại Bệnh',
        },
        {
          value: '6',
          label: 'Chuyên môn khác',
        },
      ],
    },
  ];

  const acceptBooking = async (id) => {
    const res = await request(
      // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/AcceptBooking?id=1
      `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/AcceptBooking?id=${id}`,
      {
        method: 'PUT',
      },
    );
    return res;
  };

  const actionRef = React.useRef();
  const formUserRef = React.useRef();
  const [showModal, setShowModel] = React.useState(false);
  //state cua upload img len Firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);

  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [userRecord, setUserRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterUser, setButtonSubmitterUser] = React.useState(buttonSubmitter);
  const [formFieldAddUser, setFormFieldAddUser] = React.useState(formFieldAdd);
  const [formFieldEditUser, setFormFieldEditUser] = React.useState(formFieldEdit);
  const [formFieldEditSpecialist1, setFormFieldEditSpecialist] = React.useState([]);

  const { initialState, setInitialState } = useModel('@@initialState');

  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(10);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await getSpecializations();
        if (Array.isArray(response)) {
          setFormFieldEditSpecialist([
            {
              fieldType: 'ProFormSelect',
              key: 'selectSpecialist',
              name: 'specialist',
              // label: 'Chuyên môn',

              options: response.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            },
          ]);
        }
      } catch (error) {}
    })();
  }, []);

  React.useEffect(() => {
    if (loadingUploadImgFirebase) {
      message.loading('Đang tải ...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [loadingUploadImgFirebase]);

  React.useEffect(() => {
    if (buttonEditLoading) {
      message.loading('Đang tải...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [buttonEditLoading]);

  React.useEffect(() => {
    const newButtonSubmitUser = buttonSubmitterUser.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterUser(newButtonSubmitUser);
  }, [buttonLoading]);

  //customupload img
  const customUpload = async ({ onError, onSuccess, file }) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      setLoadingUploadingImgFirebase(false);
      message.destroy();
      message.error('Bạn chỉ có thể tải lên tệp IMAGE!');
      return isImage;
    }
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
      message.error('Hình ảnh phải nhỏ hơn 4MB!');
      return isLt4M;
    }
    try {
      setLoadingUploadingImgFirebase(true);
      const imgLink = await uploadFile(file, 'useravatar');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formUserRef?.current?.setFieldsValue({
          ['imageUrl']: imgLink,
        });
        setLoadingUploadingImgFirebase(false);
        message.success('Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoadingUploadingImgFirebase(false);
    }
  };

  const handleModal = () => {
    setShowModel(!showModal);
    setFlagEditForm('');
    //vì hàm này ko liên quan đến edit user nên phải set lại user record = null
    setUserRecord(null);
  };

  const handleCancelModel = () => {
    setShowModel(false);
    setButtonLoading(false);
    setFlagEditForm('');
    // hàm này tắt modal nên cũng phải set lại edit user
    setImgLinkFirebase(null);
    setUserRecord(null);
    if (formUserRef) {
      formUserRef?.current?.resetFields();
    }
  };

  const handleResetForm = () => {
    formUserRef?.current?.resetFields();
    setImgLinkFirebase(null);
    setLoadingUploadingImgFirebase(false);
  };

  const handleSubmitFormUser = async (values) => {
    setButtonEditLoading(true);
    await editConsutanlt({ ...values, id: userRecord.id });
    setButtonEditLoading(false);
    setShowModel(false);
    actionRef?.current?.reload();
    message.success('Cập nhật thành công!');
    // setButtonLoading(false);
  };

  const handleSubmitFormUser1 = async (values) => {
    try {
      await editConsutanltSpecialization({
        bookingId: userRecord.id,
        serId: values.specialist,
      });
      setShowModel(false);
      actionRef?.current?.reload();
    } catch (error) {}

    // setButtonLoading(false);
  };

  const handleEditUserForm = async (record) => {
    const userId = record?.id;
    setButtonEditLoading(true);
    const user = await getAConsutanlt(userId);
    if (user) {
      setUserRecord(user);
      setFlagEditForm('edit');
      setShowModel(!showModal);
      setImgLinkFirebase(user.imageUrl);
      formUserRef?.current?.setFieldsValue(user);
    }
    setButtonEditLoading(false);
  };

  const handleEditStatus = async (record) => {
    try {
      message.loading('Đang xử lí ...', 9999);
      const userId = record?.id;
      const user = await editConsutanltStatus(userId);
      if (user) {
        actionRef?.current?.reload();
        message.destroy();
      }
    } catch (error) {
      console.log(error);
    } finally {
      message.destroy();
      setButtonEditLoading(false);
      message.success('Thay đổi trạng thái thành công!');
    }
  };

  const expandedRowRender = (record) => {
    return <Profile user={record} />;
  };
  const handleEditSpecialist = async (record) => {
    const userId = record?.id;
    setButtonEditLoading(true);
    const user = await getSpecializationsByUserId(userId);
    if (user) {
      setUserRecord({ id: userId });
      setShowModel(!showModal);
      formUserRef?.current?.setFieldsValue({
        specialist: user.map((item) => item.id),
      });
    }
    setButtonEditLoading(false);
  };
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          rowKey={(record) => record.id}
          request={async (params, sorter, filter) => {
            const res = await getBookingList(params);
            if (res) {
              console.log(res);
              setTotal(res.total);
              return {
                data: res.data,
                success: true,
              };
            }
          }}
          onReset={true}
          actionRef={actionRef}
          pagination={{
            //mặc định là 10
            pageSize: 10,
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Tìm kiếm',
            submittext: 'Lưu',
            resetText: 'Quay lại',
          }}
          // toolBarRender={(action) => [
          //   <Button
          //     size="middle"
          //     key="buttonAddNews"
          //     type="primary"
          //     onClick={() => {
          //       //chuyển qua trang chuyên môn
          //       history.push('/users/consutanlts/specialization');
          //     }}
          //   >
          //     Chuyên môn
          //   </Button>,
          // ]}
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Chỉnh sửa :${userRecord?.fullName}`}
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleSubmitFormUser}
          formField={formFieldEditUser}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleResetForm={handleResetForm}
          buttonLoading={buttonEditLoading}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Chỉnh sửa dịch vụ"
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleSubmitFormUser1}
          formField={formFieldEditSpecialist1}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleResetForm={handleResetForm}
          buttonLoading={buttonEditLoading}
        />
      )}
    </>
  );
};

export default React.memo(User);
