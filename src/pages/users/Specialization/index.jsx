import { EditOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from '@/components/ModalForm';
import {
  getAnCustomer,
  getCustomers,
  editCustomer,
  getSpecializationTypes,
  editSpecializationTypes,
  getASpecializationTypes,
  createSpecializationTypes,
} from '@/services/UserService/customers';
// import {getSpecializationTypes} from '@/services/SpecializationService
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
      title: 'Loại chuyên môn',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      search: false,
    },
    {
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
                key="getASpecializationTypes"
                type="primary"
                size="middle"
                icon={<EditOutlined />}
                block={true}
                onClick={() => handleEditUserForm(record)}
              ></Button>
            </div>
            {/* <div
              style={{
                width: '50%',
                marginRight: '8px',
              }}
            >
              <Button
                key="editUser"
                size="middle"
                icon={<EditOutlined />}
                block={true}
                onClick={() => handleEditUserForm(record)}
              >
                Chi tiết
              </Button>
            </div> */}
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
      name: 'Xác nhận',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldEditUsername',
      label: 'Loại chuyên môn',
      width: 'lg',
      placeholder: 'Nhập tên người dùng',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'hãy nhập tên chuyên môn',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldEditUsername',
      label: 'Loại chuyên môn',
      width: 'lg',
      placeholder: 'Nhập tên người dùng',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'hãy nhập tên chuyên môn',
    },
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
    if (flagEditForm === 'edit') {
      await editSpecializationTypes({
        id: userRecord.id,
        name: values.name,
      });
      setShowModel(false);
    } else {
      await createSpecializationTypes({
        name: values.name,
      });
      setShowModel(false);
    }

    actionRef?.current?.reload();
  };

  const handleEditUserForm = async (record) => {
    const userId = record?.id;
    setButtonEditLoading(true);
    const user = await getASpecializationTypes(userId);
    if (user) {
      setUserRecord(user);
      setFlagEditForm('edit');
      setShowModel(!showModal);
      setImgLinkFirebase(user.imageUrl);
      formUserRef?.current?.setFieldsValue(user);
    }
    setButtonEditLoading(false);
  };

  // const expandedRowRender = (record) => {
  //   return <Profile user={record} />;
  // };
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          rowKey={(record) => record.id}
          // expandable={{
          //   expandedRowRender,
          // }}
          request={async (params, sort, filter) => {
            const data = [];
            const arr = await getSpecializationTypes(params.fullname ?? '');
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chuyên môn`,
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Tìm kiếm',
            submittext: 'Submit',
            resetText: 'Quay lại',
          }}
          toolBarRender={(action) => [
            <Button
              size="middle"
              key="buttonAddNews"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModal()}
            >
              Thêm chuyên môn
            </Button>,
          ]}
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Chỉnh sửa ${userRecord?.name}`}
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
          titleModal="Thêm chuyên môn"
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
