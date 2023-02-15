import { EditOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import ModalForm from '@/components/ModalForm';
import {
  getAnCustomer,
  getCustomers,
  editCustomer,
  banUnbanCustomer,
} from '@/services/UserService/customers';
import { useModel } from 'umi';
import { uploadFile } from '@/utils/uploadFile';
import Profile from './component/Profile';
import dayjs from 'dayjs';
import MapPicker from 'react-google-map-picker';

const User = () => {
  //config column
  const column = [
    {
      title: 'STT',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      copyable: true,
      valueType: 'fullname',
      sorter: (a, b) => a.fullname.length - b.fullname.length,
      filters: true,
      onFilter: true,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Nhập tên người dùng để tìm kiếm',
          },
        ],
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: false,
      copyable: true,
      valueType: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      filters: true,
      onFilter: true,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter phone number to search',
          },
        ],
      },
    },
    {
      title: 'Trạng thái',
      search: false,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        null: { text: 'Đang chờ', status: 'Default' },
        active: { text: 'Hoạt động', status: 'Success' },
        inactive: { text: 'Ngừng hoạt động', status: 'Error' },
      },
      width: '20%',
    },

    {
      title: 'Hành động',
      dataIndex: 'action',
      search: false,
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
                key="editUser"
                type="primary"
                size="middle"
                icon={<EditOutlined />}
                block={true}
                onClick={() => handleEditUserForm(record)}
              ></Button>
            </div>
            <div
              style={{
                width: '50%',
                marginRight: '8px',
              }}
            >
              {record.status === 'active' ? (
                <Button
                  key="editConsutanlt"
                  type="danger"
                  size="middle"
                  icon={<EyeInvisibleOutlined />}
                  block={true}
                  onClick={() => handleEditStatus(record)}
                ></Button>
              ) : (
                <Button
                  key="editConsutanlt"
                  // type màu xanh
                  type="primary"
                  size="middle"
                  icon={<EyeOutlined />}
                  block={true}
                  onClick={() => handleEditStatus(record)}
                ></Button>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFieldFormUser',
      type: 'default',
      click: 'reset',
      name: 'Làm mới',
      loading: false,
    },
    {
      key: 'submitAddUser',
      type: 'primary',
      click: 'submit',
      name: 'Thay đổi',
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
      ruleMessage: 'Nhập tên người dùng trước khi gửi',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPhoneNumberUser',
      label: 'Phone Number',
      width: 'lg',
      placeholder: 'Nhập số điện thoại',
      name: 'phoneNumber',
      requiredField: 'true',
      ruleMessage: 'Input phone number before submit',
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
      name: 'fullname',
      value: 'fullname',
      requiredField: 'true',
      ruleMessage: 'Nhập tên người dùng',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPhoneNumberUser',
      label: 'Gmail',
      width: 'lg',
      placeholder: 'Nhập gmail',
      name: 'email',
      readOnly: 'true',
      disabled: 'true',
      value: '',
      requiredField: 'true',
      ruleMessage: 'Input gmail before submit',
      hidden: true,
    },
    {
      fieldType: 'formText',
      key: 'fieldAddAddressUser',
      label: 'Địa chỉ',
      width: 'lg',
      placeholder: 'Địa chỉ',
      name: 'address',
      value: '',
      requiredField: 'true',
    },
    {
      fieldType: 'position',
      labelLatitude: 'Vĩ độ',
      widthLatitude: 'small',
      nameLatitude: 'latitude',
      labelLongtitude: 'Kinh độ',
      widthLongtitude: 'small',
      nameLongtitude: 'longitude',
      hidden: true,
    },
    {
      fieldType: 'formSelect',
      key: 'selectGenderUser',
      name: 'gender',
      label: 'Giới tính',
      defaultValue: 1,
      valueEnum: [
        {
          valueName: 'Male',
          valueDisplay: 'Nam',
        },
        {
          valueName: 'Female',
          valueDisplay: 'Nữ',
        },
        {
          valueName: 'Other',
          valueDisplay: 'Khác',
        },
      ],
      placeholder: 'Chọn giới tính',
      requiredField: 'true',
      ruleMessage: 'Chọn giới tính',
      allowClear: false,
    },
    {
      fieldType: 'datePicker1',
      key: 'fieldEditBirthDate',
      label: 'Ngày sinh',
      width: 'lg',
      placeholder: 'Chọn ngày sinh',
      name: 'dob',
      requiredField: 'true',
      ruleMessage: 'Nhập ngày',
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
    //   placeholder: 'Please select status',
    //   requiredField: 'true',
    //   ruleMessage: 'Please select user status',
    //   allowClear: false,
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
      ruleMessage: 'Upload image before submit',
    },
    // {
    //   fieldType: 'checkEdit',
    //   name: 'edit',
    //   value: 'edit',
    // },
  ];
  const DefaultLocation = { lat: 10.8, lng: 106.8 };
  const DefaultZoom = 10;

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
  const { initialState, setInitialState } = useModel('@@initialState');

  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(10);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  const [modalPicker, setModalPicker] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

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

  React.useEffect(() => {
    formUserRef?.current?.setFieldsValue({
      ['latitude']: location.lat,
      ['longitude']: location.lng,
    });
  }, [location]);

  const handleOpenModalPicker = () => {
    setModalPicker(true);
  };

  const handleCancelModalPicker = () => {
    setModalPicker(false);
  };

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
    message.success('Đã chọn vị trí');
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

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
    const tempDOB = dayjs(values.dob).format('YYYY-MM-DDTHH:mm:ss');
    setButtonEditLoading(true);
    await editCustomer({
      ...values,
      id: userRecord.id,
      dob: tempDOB,
      latitude: values.latitude.toString(),
      longitude: values.longitude.toString(),
    });
    setButtonEditLoading(false);
    setShowModel(false);

    actionRef?.current?.reload();
    message.success('Cập nhật thành công !');
  };

  const handleEditUserForm = async (record) => {
    const userId = record?.id;
    setButtonEditLoading(true);
    const user = await getAnCustomer(userId);
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
      const user = await banUnbanCustomer(userId);
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
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender,
          }}
          request={async (params, sort, filter) => {
            const data = [];
            const arr = await getCustomers(params.fullname ?? '');
            setTotal(arr.length);
            return {
              data: arr.map((item, index) => ({ ...item, number: index + 1 })),
              success: true,
            };
          }}
          onReset={true}
          actionRef={actionRef}
          pagination={{
            //mặc định là 10
            pageSize: 10,
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Tìm kiếm',
            submittext: 'Submit',
            resetText: 'Quay lại',
          }}
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Chỉnh sửa ${userRecord.fullname}`}
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleSubmitFormUser}
          formField={formFieldEditUser}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleResetForm={handleResetForm}
          handleOpenModalPicker={handleOpenModalPicker}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New User"
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleSubmitFormUser}
          formField={formFieldAddUser}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleResetForm={handleResetForm}
          handleOpenModalPicker={handleOpenModalPicker}
        />
      )}

      <Modal
        visible={modalPicker}
        onCancel={() => handleCancelModalPicker()}
        closable={false}
        title={false}
        width="1300px"
        footer={[
          <Button key="cancelModelView" type="default" onClick={() => handleCancelModalPicker()}>
            Close
          </Button>,
        ]}
      >
        <MapPicker
          defaultLocation={defaultLocation}
          zoom={zoom}
          mapTypeId="roadmap"
          style={{ height: '700px' }}
          onChangeLocation={handleChangeLocation}
          onChangeZoom={handleChangeZoom}
          apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
        />
      </Modal>
    </>
  );
};

export default React.memo(User);
