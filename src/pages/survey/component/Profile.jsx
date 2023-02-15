import { uploadFile } from '@/utils/uploadFile';
import { Avatar, Button, message, Modal, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getProfiles,
  deleteProfile,
  getAnProfile,
  updateProfile,
  addProfile,
} from '@/services/UserService/profile';
import {
  addQuestionOption,
  deleteQuestionOption,
  getOptionByQuestionId,
  updateQuestionOption,
} from '@/services/SurveyService/survey';
import ModalForm from '@/components/ModalForm';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import MapPicker from 'react-google-map-picker';
import dayjs from 'dayjs';

const Profile = (props) => {
  const { user } = props;

  const DefaultLocation = { lat: 10.8, lng: 106.8 };
  const DefaultZoom = 10;

  const column = [
    {
      title: 'Câu trả lời ',
      dataIndex: 'optionText',
      copyable: true,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'type',
      copyable: true,
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
              ></Button>
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
                //khi ấn vào nút xóa thì hiện lên modal xác nhận xóa
                onClick={() => {
                  Modal.confirm({
                    title: 'Xác nhận xóa',
                    content: 'Bạn có chắc chắn muốn xóa?',
                    okText: 'Xóa',
                    okType: 'danger',
                    cancelText: 'Hủy',
                    onOk() {
                      handleDeleteProfile(record);
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                  });
                }}
              >
                Xóa
              </Button>
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
      label: 'Câu trả lời',
      width: 'lg',
      name: 'optionText',
      requiredField: 'true',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGenderUser',
      name: 'type',
      label: 'Chủ đề',
      defaultValue: 'D',
      valueEnum: [
        {
          valueName: 'D',
          valueDisplay: 'Sự thống trị',
        },
        {
          valueName: 'C',
          valueDisplay: 'Sự tuân thủ',
        },
        {
          valueName: 'S',
          valueDisplay: 'Sự kiên định',
        },
        {
          valueName: 'I',
          valueDisplay: 'Ảnh hưởng',
        },
      ],
      requiredField: 'true',
      allowClear: false,
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddProfileName',
      label: 'Câu trả lời',
      width: 'lg',
      name: 'optionText',
      requiredField: 'true',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGenderUser',
      name: 'type',
      label: 'Chủ đề',
      defaultValue: 'D',
      valueEnum: [
        {
          valueName: 'D',
          valueDisplay: 'Sự thống trị',
        },
        {
          valueName: 'C',
          valueDisplay: 'Sự tuân thủ',
        },
        {
          valueName: 'S',
          valueDisplay: 'Sự kiên định',
        },
        {
          valueName: 'I',
          valueDisplay: 'Ảnh hưởng',
        },
      ],
      requiredField: 'true',
      allowClear: false,
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
  //get list option of question
  React.useEffect(() => {
    (async () => {
      const data = await getOptionByQuestionId(user?.id);
      setDataTable(data?.data);
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
    setTimeout(() => {
      formProfileRef?.current?.resetFields();
    }, 0);
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
    message.loading('Đang tải');
    setButtonLoading(true);
    try {
      if (values.edit) {
        await updateQuestionOption({
          ...values,
          questionId: user.id,
          id: profileRecord.id,
        });
      } else {
        await addQuestionOption({ ...values, questionId: user.id });
        handleResetForm();
      }
      setShowModal(false);
      setTriggerDataTable(!triggerDataTable);
      message.destroy();
    } catch (error) {
      console.log('error', error);
    } finally {
      setButtonLoading(false);
      message.success('Thêm thành công');
    }
  };

  //xuli mo form edit zodiac
  const handleEditProfileForm = async (record) => {
    try {
      console.log('open edit form');
      const profileId = record.id;
      setButtonEditLoading(true);
      setProfileRecord(record);
      setFlagEditForm('edit');
      setShowModal(true);
      // setImgLinkFirebase(profile.imageUrl);
      setTimeout(() => {
        formProfileRef?.current?.setFieldsValue(record);
      }, 0);
    } catch (error) {
    } finally {
      setButtonEditLoading(false);
    }
  };

  const handleDeleteProfile = async (record) => {
    try {
      setButtonLoading(true);
      message.loading('Đang tải');
      await deleteQuestionOption(record.id);
      setTriggerDataTable(!triggerDataTable);
      message.destroy();
    } catch (error) {
    } finally {
      setButtonLoading(false);
      message.success('Xóa thành công');
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

  // modal xác nhận xóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModalDelete = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lựa chọn`,
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
                  Thêm câu trả lời
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
          titleModal={`Chỉnh sửa câu trả lời`}
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
          titleModal="Thêm câu trả lời"
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
