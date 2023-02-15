import { uploadFile } from '@/utils/uploadFile';
import { Avatar, Button, message, Modal, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getProfiles,
  deleteProfile,
  getAnProfile,
  updateProfile,
  addProfile,
  getSpecializationbyTypes,
} from '@/services/UserService/profile';

import ModalForm from '@/components/ModalForm';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import MapPicker from 'react-google-map-picker';

import dayjs from 'dayjs';

const Profile = (props) => {
  //mapRef

  const { user } = props;

  const DefaultLocation = { lat: 10.8, lng: 106.8 };
  const DefaultZoom = 10;

  const column = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Nhập tên người dùng',
          },
        ],
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'profilePhoto',
      render: (_, record) => {
        return (
          <Space>
            <Avatar size="default" src={record.imageUrl} />
          </Space>
        );
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      render: (_, record) => {
        const dob = dayjs(record.dob).format('DD/MM/YYYY HH:mm:ss');
        return (
          <Space>
            <Tag color="geekblue">{dob}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Nơi sinh',
      dataIndex: 'birthPlace',
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Birth Place to search',
          },
        ],
      },
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
                key="editHouse"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditProfileForm(record)}
              >
                Chi tiết
              </Button>
            </div>
            <div
              style={{
                width: '50%',
              }}
            >
              <Button
                key="deleteHouse"
                type="danger"
                size="middle"
                block="true"
                icon={<DeleteOutlined />}
                // onClick={() => handleDeleteProfile(record)}
                //khi ấn vào nút xóa thì hiện lên modal xác nhận xóa
                onClick={() => {
                  Modal.confirm({
                    title: 'Xác nhận xóa',
                    content: 'Bạn có chắc chắn muốn xóa ' + record.name + ' không?',
                    okText: 'Xóa',
                    okType: 'danger',
                    cancelText: 'Hủy',
                    onOk: () => handleDeleteProfile(record),
                  });
                }}
              ></Button>
            </div>
          </div>
        );
      },
      width: '25%',
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFormProfile',
      type: 'default',
      click: 'reset',
      name: 'Làm mới',
      loading: false,
    },
    {
      key: 'submitAddProfile',
      type: 'primary',
      click: 'submit',
      name: 'Thêm/Chỉnh sửa',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddProfileName',
      label: 'Tên người dùng',
      width: 'lg',
      placeholder: 'Nhập tên profile',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Nhập tên profile trước khi submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGenderUser',
      name: 'gender',
      label: 'Giới tính',
      defaultValue: 'Male',
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
      fieldType: 'datePicker',
      key: 'fieldEditBirthDate',
      label: 'Ngày và giờ sinh',
      width: 'lg',
      placeholder: 'Chọn ngày và giờ sinh',
      name: 'dob',
      requiredField: 'true',
      ruleMessage: 'Nhập ngày và giờ sinh',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddBirthPlace',
      label: 'Nơi sinh',
      width: 'lg',
      placeholder: 'Nhập nơi sinh',
      name: 'birthPlace',
      requiredField: 'true',
      ruleMessage: 'Nhập nơi sinh trước khi submit',
    },
    {
      fieldType: 'position',
      labelLatitude: 'Vĩ độ',
      widthLatitude: 'small',
      nameLatitude: 'latitude',
      labelLongtitude: 'Kinh độ',
      widthLongtitude: 'small',
      nameLongtitude: 'longitude',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Ảnh đại diện',
      width: 'lg',
      placeholder: 'Avatar',
      name: 'imageUrl',
      nameUpload: 'profilePhotoFirebase',
      nameInputFile: 'profileFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddProfileName',
      label: 'Tên người dùng',
      width: 'lg',
      placeholder: 'Nhập tên profile',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Nhập tên profile trước khi submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGenderUser',
      name: 'gender',
      label: 'Giới tính',
      defaultValue: 'Male',
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
      fieldType: 'datePicker',
      key: 'fieldEditBirthDate',
      label: 'Ngày và giờ sinh',
      width: 'lg',
      placeholder: 'Chọn ngày và giờ sinh',
      name: 'dob',
      requiredField: 'true',
      ruleMessage: 'Nhập ngày và giờ sinh',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddBirthPlace',
      label: 'Nơi sinh',
      width: 'lg',
      placeholder: 'Nhập nơi sinh',
      name: 'birthPlace',
      requiredField: 'true',
      ruleMessage: 'Nhập nơi sinh trước khi submit',
    },
    {
      fieldType: 'position',
      labelLatitude: 'Vĩ độ',
      widthLatitude: 'small',
      nameLatitude: 'latitude',
      labelLongtitude: 'Kinh độ',
      widthLongtitude: 'small',
      nameLongtitude: 'longitude',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Ảnh đại diện',
      width: 'lg',
      placeholder: 'Avatar',
      name: 'imageUrl',
      nameUpload: 'profilePhotoFirebase',
      nameInputFile: 'profileFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  //ref cua table, editor, form
  const tableProfileRef = React.useRef();
  const formProfileRef = React.useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //data table
  const [dataTable, setDataTable] = useState([]);
  //trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [profileRecord, setProfileRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterProfile, setButtonSubmitterProfile] = React.useState(buttonSubmitter);
  const [formFieldAddProfile, setFormFieldAddProfile] = React.useState(formFieldAdd);
  const [formFieldEditProfile, setFormFieldEditProfile] = React.useState(formFieldEdit);
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [total, setTotal] = React.useState(20);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  //state cua gg picker
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  const [modalPicker, setModalPicker] = useState(false);
  //get list profile of user
  React.useEffect(() => {
    (async () => {
      const listProfile = [];
      const params = {
        userId: user?.id,
        page: page,
        pageSize: pageSize,
      };
      const data = await getSpecializationbyTypes(user.id);
      setDataTable(data);
      setTotal(data.length);
    })();
  }, [triggerDataTable]);

  //xuli loading upload img firebase
  React.useEffect(() => {
    if (loadingUploadImgFirebase) {
      message.loading('Đang tải...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [loadingUploadImgFirebase]);

  React.useEffect(() => {
    if (buttonEditLoading) {
      message.loading('Đang tải ...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [buttonEditLoading]);

  React.useEffect(() => {
    formProfileRef?.current?.setFieldsValue({
      ['latitude']: location.lat,
      ['longitude']: location.lng,
    });
  }, [location]);

  //xuli loading button submit form add or edit house
  React.useEffect(() => {
    const newButtonSubmitProfile = buttonSubmitterProfile.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterProfile(newButtonSubmitProfile);
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
      const imgLink = await uploadFile(file, 'profile');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formProfileRef?.current?.setFieldsValue({
          ['imageUrl']: imgLink,
        });
        setLoadingUploadingImgFirebase(false);
        message.success(' Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      setLoadingUploadingImgFirebase(false);
      onError(error);
    }
  };

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setProfileRecord(null);
    setImgLinkFirebase(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setProfileRecord(null);
    setImgLinkFirebase(null);
    setLocation(DefaultLocation);
    if (formProfileRef) {
      formProfileRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formProfileRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormProfile = async (values) => {
    setButtonLoading(true);
    const tempDOB = dayjs(values.dob).format('YYYY-MM-DDTHH:mm:ss');
    const latitude = `${values.latitude}`;
    const longitude = `${values.longitude}`;
    const data = { ...values, dob: tempDOB, latitude, longitude };
    try {
      message.loading('Đang tải...', 9999);
      if (values.edit) {
        await updateProfile({ ...data, id: profileRecord.id });
      } else {
        await addProfile({ ...data, customerId: user.id });
        handleResetForm();
      }
      setShowModal(false);
      setTriggerDataTable(!triggerDataTable);
      message.destroy();
    } catch (error) {
    } finally {
      setButtonLoading(false);
      message.success('Thực hiện thành công!');
    }
  };

  //xuli mo form edit zodiac
  const handleEditProfileForm = async (record) => {
    try {
      message.loading('Đang tải...', 9999);
      console.log('open edit form');
      const profileId = record.id;
      setButtonEditLoading(true);
      const profile = await getAnProfile(profileId);
      setProfileRecord(profile);
      setFlagEditForm('edit');
      setShowModal(true);
      setImgLinkFirebase(profile.imageUrl);
      formProfileRef?.current?.setFieldsValue(profile);
      message.destroy();
    } catch (error) {
    } finally {
      setButtonEditLoading(false);
      // message.success('Thực hiện thành công!');
    }
  };

  const handleDeleteProfile = async (record) => {
    try {
      message.loading('Đang tải...', 9999);
      const profileId = record.id;
      setButtonEditLoading(true);
      const profile = await deleteProfile(profileId);
      formProfileRef?.current?.setFieldsValue(profile);
      message.destroy();
    } catch (error) {
    } finally {
      setTriggerDataTable(!triggerDataTable);
      message.success('Thực hiện thành công!');
    }
  };
  //xu li lien quan den map picker
  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
    message.success('Đã chọn vị trí');
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  const handleOpenModalPicker = () => {
    setModalPicker(true);
  };

  const handleCancelModalPicker = () => {
    setModalPicker(false);
  };

  const onChangePaging = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    setTriggerDataTable(!triggerDataTable);
  };

  // state viewport map picker
  const [viewport, setViewport] = React.useState({
    width: '100%',
    height: '100%',
    latitude: DefaultLocation.lat,
    longitude: DefaultLocation.lng,
    zoom: DefaultZoom,
  });

  return (
    <>
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
            width: '90%',
          }}
        >
          <ProTable
            columns={column}
            actionRef={tableProfileRef}
            onReset={true}
            size="small"
            cardBordered={{
              table: true,
            }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: (page, pageSize) => onChangePaging(page, pageSize),
            }}
            search={false}
            toolBarRender={(action) => [
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button
                  size="middle"
                  key="buttonAddAspect"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleModal()}
                >
                  Thêm hồ sơ
                </Button>
              </div>,
            ]}
            dataSource={dataTable}
          />
        </div>
      </div>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Chỉnh sửa ${profileRecord?.name}`}
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formProfileRef}
          buttonSubmitter={buttonSubmitterProfile}
          handleSubmitForm={handleSubmitFormProfile}
          formField={formFieldEditProfile}
          handleResetForm={handleResetForm}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleOpenModalPicker={handleOpenModalPicker}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Thêm hồ sơ"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formProfileRef}
          buttonSubmitter={buttonSubmitterProfile}
          handleSubmitForm={handleSubmitFormProfile}
          formField={formFieldAddProfile}
          handleResetForm={handleResetForm}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
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

export default Profile;
