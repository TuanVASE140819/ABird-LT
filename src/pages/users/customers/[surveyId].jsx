import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Modal, Space, Tag, Image } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from '@/components/ModalForm';
import axios from 'axios';
// import { getAnCustomer, getCustomers, editCustomer } from '@/services/UserService/customers';
import { updateQuestion, addQuestion, deleteQuestion } from '@/services/SurveyService/survey';
import { useModel } from 'umi';
import { uploadFile } from '@/utils/uploadFile';
import Profile from '../../survey/component/Profile';
import dayjs from 'dayjs';
import MapPicker from 'react-google-map-picker';
import { ProCard, ProFormText } from '@ant-design/pro-components';

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
  const [booking, setBooking] = React.useState({});
  const [dateBooking, setDateBooking] = React.useState('');
  React.useEffect(() => {
    const bookingId = localStorage.getItem('bookingId');
    axios
      .get(
        `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingDetail?id=${bookingId}`,
      )
      .then((response) => {
        // const data1 = response.data.data[0].dateBooking;
        setBooking(response.data.data[0]);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log('booking', booking.dataBooking);

  return (
    <>
      <PageContainer>
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard gutter={16} ghost style={{ height: 500 }}>
            <ProCard
              colSpan={16}
              style={{
                // paddingBottom
                height: 610,
              }}
            >
              <h1 style={{ textDecoration: 'underline' }}>CHI TIẾT LƯU TRÚ</h1>
              <h3>Thời điểm nhận:</h3>
              <ProFormText
                width="md"
                disabled={true}
                placeholder={booking?.dateBooking}
                style={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}
              />
              <h3>Thời điểm trả:</h3>
              <ProFormText width="md" disabled={true} placeholder={booking?.dateEnd}></ProFormText>

              <h3>Chế độ ăn:</h3>
              <ProFormText width="md" disabled={true} placeholder={'cám chim'} />
              <h3>Vệ sinh:</h3>
              <ProFormText width="md" disabled={true} placeholder={'tắm thuốc'} />
              <h3>Dịch vụ khác:</h3>
              <ProFormText width="md" disabled={true} placeholder={'tỉa lông , luyện hót'} />

              {/* button nằm bên phải procard */}

              <Button type="primary" onClick={onClickAddQuestion} style={{ float: 'right' }}>
                Thông tin chim qua từng ngày
              </Button>
            </ProCard>
            <ProCard colSpan={8} style={{ height: 600 }} ghost direction="column">
              <ProCard>
                <h1 style={{ textDecoration: 'underline' }}>CHIM</h1>
                {/* <h3>Hình ảnh chim :</h3>
                <img
                  src={'https://dogily.vn/wp-content/uploads/2019/09/Phan-loai-chim-sao.jpg'}
                  alt="Ảnh chim"
                  style={{ width: '10%', height: '10%' }}
                />  */}
                <h3>Loại chim:</h3>
                <ProFormText width="md" disabled={true} placeholder={booking?.typeOfBird} />
                <h3>Sức khỏe - Bệnh lý:</h3>
                <ProFormText height={100} disabled={true} placeholder={'Bình thường'} />
              </ProCard>
              <ProCard
                //cách trên 18px
                style={{ marginTop: 18 }}
              >
                <h1 style={{ textDecoration: 'underline' }}>KHÁCH HÀNG</h1>
                <h3>Họ và tên:</h3>
                <ProFormText width="md" disabled={true} placeholder={booking?.customerName} />
                <h3>SĐT:</h3>
                <ProFormText width="md" disabled={true} placeholder={'038965973933'} />
                <h3>Email:</h3>
                <ProFormText height={100} disabled={true} placeholder={'caucavuighe@gmail.com'} />
              </ProCard>
            </ProCard>
          </ProCard>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default React.memo(User);