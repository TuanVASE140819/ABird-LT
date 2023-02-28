import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  RightOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  message,
  Modal,
  Space,
  Tag,
  Image,
  Avatar,
  Input,
  List,
  Comment,
} from 'antd';

import moment from 'moment';

import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from '@/components/ModalForm';
import axios from 'axios';
// import { getAnCustomer, getCustomers, editCustomer } from '@/services/UserService/customers';
import {
  updateQuestion,
  addQuestion,
  deleteQuestion,
  createReport,
  getReportList,
} from '@/services/SurveyService/survey';
import { useModel } from 'umi';
import { uploadFile } from '@/utils/uploadFile';
import Profile from '../../survey/component/Profile';
import dayjs from 'dayjs';
import MapPicker from 'react-google-map-picker';
import {
  ProCard,
  ProFormText,
  DrawerForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProForm,
  CheckCard,
} from '@ant-design/pro-components';
import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';

const User = (props) => {
  const [open, setOpen] = useState(false);
  const showModal1 = () => {
    setOpen(true);
  };
  const showModalBill = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
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

  const [drawerVisit, setDrawerVisit] = useState(false);

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
  const [bookingReport, setBookingReport] = React.useState([]);
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
  React.useEffect(() => {
    const bookingId = localStorage.getItem('bookingId');
    axios
      .get(
        `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingReportList?bookingId=${bookingId}`,
      )
      .then((response) => {
        const data = response.data.data;
        data.forEach((item) => {
          item.datetime = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss');
        });
        setBookingReport(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log(bookingReport.description);
  const initialMessages = [
    {
      id: 1,
      author: 'You',
      content: 'Hello',
      datetime: '2021-10-23 14:20:00',
    },
    {
      id: 2,
      author: 'Customer',
      content: 'Hi there',
      datetime: '2021-10-23 14:22:00',
    },
    {
      id: 3,
      author: 'Customer',
      content: 'How can I help you?',
      datetime: '2021-10-23 14:23:00',
    },
    {
      id: 4,
      author: 'You',
      content: 'I have a question about my order',
      datetime: '2021-10-23 14:24:00',
    },
    {
      id: 5,
      author: 'Customer',
      content: 'Sure, what is your order number?',
      datetime: '2021-10-23 14:25:00',
    },
    {
      id: 6,
      author: 'You',
      content: 'My order number is 123456',
      datetime: '2021-10-23 14:26:00',
    },
    {
      id: 7,
      author: 'Customer',
      content: 'Let me check on that for you',
      datetime: '2021-10-23 14:27:00',
    },
    {
      id: 8,
      author: 'Customer',
      content: 'It looks like your order has shipped and should arrive in 2-3 business days',
      datetime: '2021-10-23 14:28:00',
    },
    {
      id: 9,
      author: 'You',
      content: 'Great, thanks for your help',
      datetime: '2021-10-23 14:29:00',
    },
  ];

  const ChatBubble = styled.div`
    background-color: ${(props) => (props.isRight ? '#1890ff' : '#f2f2f2')};
    color: ${(props) => (props.isRight ? '#fff' : '#000')};
    border-radius: 4px;
    padding: 8px 16px;
    margin-bottom: 8px;
    max-width: 60%;
    align-self: ${(props) => (props.isRight ? 'flex-end' : 'flex-start')};
  `;
  const [messages, setMessages] = useState(initialMessages);
  const [collapsed, setCollapsed] = useState(true);
  const handleSendMessage = (value) => {
    if (value) {
      const newMessage = {
        id: messages.length + 1,
        author: 'You',
        content: value,
        datetime: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
    }
  };

  const [visible, setVisible] = useState(false);

  const handleCreateReportClick = () => {
    try {
      const bookingId = localStorage.getItem('bookingId');
      createReport(bookingId);
      message.loading('Đang xử lí ...', 9999);
      actionRef?.current?.reload();
      message.destroy();
    } catch (error) {
      message.fail('Lưu thất bại');
    }
  };
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
              <ProFormText width="md" disabled={true} placeholder={booking?.dateEnd} />
              {/* <h3>Chế độ ăn:</h3>
              <ProFormText width="md" disabled={true} placeholder={'cám chim'} />
              <h3>Vệ sinh:</h3>
              <ProFormText width="md" disabled={true} placeholder={'tắm thuốc'} /> */}
              <h3>Dịch vụ khác</h3>
              <TextArea
                rows={4}
                maxLength={6}
                // hiện thị tên sevices trong dó
                value={booking?.dateEnd}
              />

              <div style={{ marginTop: 20 }}>
                <Button type="primary" onClick={showModal1} style={{ float: 'right' }}>
                  Thông tin chim qua từng ngày
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setDrawerVisit(true);
                  }}
                >
                  Hoá đơn
                </Button>
              </div>
              <DrawerForm
                onOpenChange={setDrawerVisit}
                title="Hoá đơn"
                open={drawerVisit}
                okText="Xuất hoá đơn"
                onFinish={async () => {
                  message.success('Xuất hoá đơn thành công');
                  return true;
                }}
              >
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="name"
                    disabled
                    label="Tên khách hàng :"
                    value={{
                      label: 'customerName',
                    }}
                  />

                  <ProFormText
                    width="md"
                    disabled
                    name="company"
                    label="Chim của khách hàng :"
                    value={{
                      label: 'customerName',
                    }}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText width="md" name="contract" disabled label="Loại chim :" />
                  <ProFormText width="md" name="contract" disabled label="Ngày nhận :" />
                </ProForm.Group>
                <ProFormText name="contract" disabled label="Ngày bắt đầu :" />
                <ProFormText name="contract" disabled label="Ngày kết thúc  :" />

                <ProFormText name="project" disabled label="Dịch vụ :" />
                <CheckCard
                  title="Tổng tiền"
                  description={booking?.dateBooking}
                  //description color red, italic, bold
                  descriptionStyle={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}
                  avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
                />
              </DrawerForm>
              <Modal
                title="Thông tin chim qua từng ngày"
                open={open}
                onOk={hideModal}
                onCancel={hideModal}
                footer={null}
                width={1000}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateReportClick}>
                  Tạo báo cáo
                </Button>
                {bookingReport?.map((item) => (
                  <div key={item.id}>
                    <ProCard
                      //flex
                      title={item.date}
                      extra={
                        <RightOutlined
                          rotate={!collapsed[item.id] ? 90 : undefined}
                          onClick={() => {
                            setCollapsed({ ...collapsed, [item.id]: !collapsed[item.id] });
                          }}
                        />
                      }
                      style={{ marginBlockStart: 16, backgroundColor: '#f2f2f2' }}
                      headerBordered
                      collapsed={!collapsed[item.id]}
                    >
                      {collapsed[item.id] && (
                        <ProCard
                          title="Video"
                          style={{ height: 500 }}
                          headerBordered
                          bodyStyle={{ padding: 0 }}
                        >
                          <div>
                            {/* description */}
                            <div style={{ padding: 16 }}>
                              <h3>Thông tin</h3>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </ProCard>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                        <List
                          itemLayout="horizontal"
                          dataSource={messages}
                          renderItem={(item) => (
                            <Comment
                              avatar={<Avatar>{item.author[0]}</Avatar>}
                              content={
                                <ChatBubble isRight={item.author === 'You'}>
                                  {item.content}
                                </ChatBubble>
                              }
                              datetime={item.datetime}
                            />
                          )}
                          style={{ overflowY: 'scroll', flex: 1 }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Input.Search
                            placeholder="Type your message here..."
                            enterButton={<SendOutlined />}
                            onSearch={handleSendMessage}
                            style={{ flex: 1 }}
                          />
                        </div>
                      </div>
                    </ProCard>
                  </div>
                ))}
              </Modal>
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
