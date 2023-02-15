import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from '@/components/ModalForm';
// import { getAnCustomer, getCustomers, editCustomer } from '@/services/UserService/customers';
import {
  getQuestionBySurveyId,
  getQuestion,
  updateQuestion,
  addQuestion,
  deleteQuestion,
} from '@/services/SurveyService/survey';
import { useModel } from 'umi';
import { uploadFile } from '@/utils/uploadFile';
import Profile from './component/Profile';
import dayjs from 'dayjs';
import MapPicker from 'react-google-map-picker';

const User = (props) => {
  const {
    match: {
      params: { zodiacId, surveyId },
    },
  } = props;
  // modal xác nhân xóa
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
  //config column
  const column = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'description',
      copyable: true,
      valueType: 'description',
      sorter: (a, b) => a.description.length - b.description.length,
      filters: true,
      onFilter: true,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter username to search',
          },
        ],
      },
    },
    {
      title: '',
      dataIndex: 'action',
      search: false,
      render: (_, record) => {
        return (
          <div>
            <div>
              <Button
                key="editUser"
                type="primary"
                size="middle"
                icon={<EditOutlined />}
                block={true}
                onClick={() => handleEditUserForm(record)}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'actionDelete',
      search: false,
      render: (_, record) => {
        return (
          <div>
            <div>
              <Button
                danger
                key="editUser"
                size="middle"
                icon={<DeleteOutlined />}
                block={true}
                onClick={() => {
                  Modal.confirm({
                    title: 'Xác nhận xóa',
                    content: 'Bạn có chắc chắn muốn xóa?',
                    okText: 'Xóa',
                    cancelText: 'Hủy',
                    onOk: () => handelDeleteQuestion(record),
                  });
                }}
              >
                Xóa
              </Button>
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
      name: 'Xác nhận',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddUsername',
      label: 'Mô tả',
      width: 'lg',
      name: 'description',
      value: 'description',
      requiredField: 'true',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddUsername',
      label: 'Mô tả',
      width: 'lg',
      name: 'description',
      value: 'description',
      requiredField: 'true',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
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

  const handleEditQuestion = async (values) => {
    setButtonLoading(true);
    await updateQuestion({ ...values, id: userRecord.id });
    setShowModel(false);
    actionRef?.current?.reload();
    setButtonLoading(false);
  };

  const handleAddQuestion = async (values) => {
    try {
      setButtonLoading(true);
      await addQuestion({ ...values, surveyId: surveyId });
      setShowModel(false);
      actionRef?.current?.reload();
      setButtonLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleEditUserForm = async (record) => {
    setUserRecord(record);
    setFlagEditForm('edit');
    setShowModel(!showModal);
    // setImgLinkFirebase(user.imageUrl);
    setTimeout(() => {
      formUserRef?.current?.setFieldsValue(record);
    }, 0);
  };

  const handelDeleteQuestion = async (record) => {
    try {
      message.loading('Đang xử lí ...', 9999);
      await deleteQuestion(record.id);
      actionRef?.current?.reload();
      message.destroy();
    } catch (error) {
      message.fail('Xóa thất bại');
    } finally {
      message.destroy();
      message.success('Xóa thành công');
    }
  };

  const onClickAddQuestion = () => {
    setFlagEditForm('add');
    setShowModel(!showModal);
  };

  const expandedRowRender = (record) => {
    return <Profile user={record} />;
  };
  return (
    <>
      <PageContainer>
        <Button type="primary" style={{ marginBottom: 20 }} onClick={onClickAddQuestion}>
          Thêm câu hỏi
        </Button>
        <ProTable
          columns={column}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender,
          }}
          request={async (params, sort, filter) => {
            const data = [];
            await getQuestionBySurveyId(surveyId).then((res) => {
              res?.data?.map((item, index) => {
                item.number = index + 1;
                data[index] = item;
              });
              setTotal(res?.total);
            });

            return {
              data: data,
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} câu hỏi`,
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
          titleModal={`Chỉnh sửa câu hỏi`}
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleEditQuestion}
          formField={formFieldEditUser}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleResetForm={handleResetForm}
          handleOpenModalPicker={handleOpenModalPicker}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Thêm câu hỏi"
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleAddQuestion}
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
