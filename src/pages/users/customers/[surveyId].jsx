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
  DatePicker,
  Avatar,
  Input,
  List,
  Comment,
  Form,
  Typography,
  Tag,
  Space,
  Select,
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
  updateReport,
  getReportList,
  acceptBooking,
} from '@/services/SurveyService/survey';
import {
  getSpecializations,
  getSpecializationsByUserId,
  editConsutanltSpecialization,
  createService,
} from '@/services/UserService/consutanlts';
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
  ProFormTextArea,
} from '@ant-design/pro-components';
import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable, useRefFunction } from '@ant-design/pro-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { log } from '@antv/g2plot/lib/utils';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const columns = [
  {
    title: 'Loại Dịch Vụ',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    ellipsis: true,
  },

  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    ellipsis: true,
  },

  {
    title: 'Số Lượng',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'Đơn Vị',
    dataIndex: 'unit',
    key: 'unit',
    width: 50,
    ellipsis: true,
  },
  {
    title: 'Tạm Tính',
    dataIndex: 'total',
    key: 'total',
    width: 100,
    ellipsis: true,
  },
];
const User = (props) => {
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [isModalVisibleService, setIsModalVisibleService] = useState(false);

  const showModal1 = () => {
    setOpen(true);
    setFlagEditForm('info');
  };
  const hideModal1 = () => {
    setOpen(false);
  };
  const showModalReport = () => {
    setIsModalVisibleReport(true);
  };
  const hideModalReport = () => {
    setIsModalVisibleReport(false);
  };
  const showModalService = () => {
    setIsModalVisibleService(true);
    setFlagEditForm('service');
  };
  const hideModalService = () => {
    setIsModalVisibleService(false);
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
  const handleClickAccept = () => {
    axios
      .put(`https://swpbirdboardingv1.azurewebsites.net/api/Bookings/checkinBooking?id=${surveyId}`)
      .then((res) => {
        if (res.status === 200) {
          message.success('Checkin thành công');
        }
      });
  };

  const handleClickAcceptChapnhan = () => {
    axios
      .put(`https://swpbirdboardingv1.azurewebsites.net/api/Bookings/AcceptBooking?id=${surveyId}`)
      .then((res) => {
        if (res.status === 200) {
          message.success('Chấp nhận thành công');
          //reload
        }
      });
  };
  // handleClickCancel
  const handleClickCancel = () => {
    // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/cancelBooking?id=1
    axios
      .put(`https://swpbirdboardingv1.azurewebsites.net/api/Bookings/cancelBooking?id=${surveyId}`)
      .then((res) => {
        if (res.status === 200) {
          message.success('Hủy thành công');
        }
      });
  };

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
      fieldType: 'formSelect',

      name: 'id',
      // lấy id của dịch vụ truyền vào
      label: 'Dịch vụ',
      placeholder: 'Chọn dịch vụ',
      requiredField: 'true',
      width: 200,
      ruleMessage: 'Vui lòng chọn dịch vụ',
      valueEnum: [],
    },
    {
      fieldType: 'formText',
      key: 'amount',
      label: 'Số lượng',
      width: 'lg',
      name: 'amount',
      value: 'amount',
      requiredField: 'true',
      ruleMessage: 'Please enter amount',
    },
  ];
  axios
    .get(
      'https://swpbirdboardingv1.azurewebsites.net/api/Services/GetServiceList?id=3&pagesize=10&pagenumber=1',
    )
    .then((response) => {
      const data = response.data.data;
      const dataService = [];
      data.forEach((item) => {
        dataService.push({
          valueDisplay: item.name,
          valueName: item.id,
        });
      });
      formFieldAdd[0].valueEnum = dataService;
    })
    .catch((error) => {
      console.error(error);
    });

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

  const [formFieldEditSpecialist1, setFormFieldEditSpecialist] = React.useState([]);
  const [drawerVisit, setDrawerVisit] = useState(false);

  React.useEffect(() => {
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
    setFlagEditForm('service');
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

  // Lấy giá trị serviceId từ formFieldAdd
  const selectedService = formFieldAdd[0].valueEnum.find(
    (item) => item.valueDisplay === values.name,
  );
  const serviceId = selectedService ? selectedService.value : null;

  const handleSubmitFormUser = async (values) => {
    const bookingId = localStorage.getItem('bookingId');

    await createService({
      // truyền serviceId vào
      serviceId: values.id,
      amount: values.amount,
      bookingId: bookingId,
    });
    setShowModel(false);

    formUserRef?.current?.resetFields();
    // reload lại trang để hiển thị service mới
    actionRef?.current?.reload();
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
  const [serviceNames, setServiceNames] = React.useState([]);
  const [bill, setBill] = React.useState({});

  React.useEffect(() => {
    const bookingId = localStorage.getItem('bookingId');
    axios
      .get(
        `https://swpbirdboardingv1.azurewebsites.net/api/Home/BookingDetail?bookingid=${bookingId}`,
      )
      .then((response) => {
        const booking = response.data.data[0];
        setBooking(booking);
        const names = booking.service.map((item) => item.name);
        setServiceNames(names);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    const bookingId = localStorage.getItem('bookingId');
    axios
      .get(
        `https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBillBooking?bookingid=${bookingId}`,
      )
      .then((response) => {
        setBill(response.data.data);
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
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSendMessage = async (value) => {
    try {
      const reportId = localStorage.getItem('id');
      // const id = localStorage.getItem('id');
      await updateReport({
        reportId,
        date: moment(),
        description: value,
        msgHost: value,
      });
      message.loading('Đang xử lí ...', 9999);
      actionRef?.current?.reload();
      setIsModalVisibleReport(false);
      message.destroy();
    } catch (error) {
      message.fail('Lưu thất bại');
    }
  };
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

  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { RangePicker } = DatePicker;

  const handleCancelInfo = () => {
    setOpen(false);
  };

  const [isModalVisibleReport, setIsModalVisibleReport] = useState(false);
  const handleCreateReportClick = async (values) => {
    try {
      const bookingId = localStorage.getItem('bookingId');
      await createReport({
        bookingId,
        date: values.date,
        description: values.description,
        msgHost: values.message,
      });
      const descriptionItem = localStorage.getItem('description');
      message.loading('Đang xử lí ...', 9999);
      actionRef?.current?.reload();
      setIsModalVisibleReport(false);
      message.destroy();
    } catch (error) {
      message.fail('Lưu thất bại');
    }
  };

  const [dataSource, setDataSource] = useState([]);

  React.useEffect(() => {
    const bookingId = localStorage.getItem('bookingId');
    fetch(
      `https://swpbirdboardingv1.azurewebsites.net/api/Home/ServiceDetail?bookingid=${bookingId}`,
    )
      .then((response) => response.json())
      .then((data) => {
        // Convert the received data to match the format of `dataSource`
        const dataSource = data.data.map((item) => ({
          key: item.id,
          name: item.serviceName,
          price: item.price,
          amount: item.amount,
          unit: item.unit,
          total: item.total,
        }));
        setDataSource(dataSource);

        console.log(dataSource);
      })
      .catch((error) => console.log(error));
  }, []);

  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortContainer = SortableContainer((props) => <tbody {...props} />);

  const onSortEnd = useRefFunction(({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable({
        array: [...dataSource],
        fromIndex: oldIndex,
        toIndex: newIndex,
      }).filter((el) => !!el);
      setDataSource([...newData]);
    }
  });

  const DraggableContainer = (props) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = (props) => {
    const { className, style, ...restProps } = props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.key === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
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
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard gutter={16} ghost style={{ height: 500 }}>
            <ProCard
              colSpan={16}
              style={{
                // paddingBottom
                height: 610,
              }}
            >
              <Typography>
                <Typography.Title
                  level={1}
                  style={{ display: 'inline-block', textDecoration: 'underline' }}
                >
                  CHI TIẾT LƯU TRÚ
                </Typography.Title>
                <Typography.Text
                  style={{
                    display: 'inline-block',
                    //căn lề bên phải
                    float: 'right',
                  }}
                >
                  {
                    // nếu booking?.status === accepted thì hiện thị "Đã duyệt" và có chữ màu vàng cũng như vậy cho booking?.status === pending còn lại thì hiện thị "Chưa duyệt" và có chữ màu đỏ

                    booking?.status === 'success' ? (
                      <Tag color="blue">Đã hoàn thành</Tag>
                    ) : booking?.status === 'waiting' ? (
                      <Tag color="orange">Đang chờ</Tag>
                    ) : booking?.status === 'accepted' ? (
                      <Tag color="green">Đã chấp nhận</Tag>
                    ) : booking?.status === 'cancel' ? (
                      <Tag color="red">Đã hủy</Tag>
                    ) : booking?.status === 'processing' ? (
                      <Tag color="blue">Đang lưu trú </Tag>
                    ) : (
                      <Tag color="red">Chưa duyệt</Tag>
                    )
                  }
                </Typography.Text>
              </Typography>
              <h3>Thời điểm nhận:</h3>
              <ProFormText
                width="md"
                value={moment(booking?.dateBooking).format('DD/MM/YYYY')}
                style={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}
              />
              <h3>Thời điểm trả:</h3>
              <ProFormText width="md" value={moment(booking?.dateEnd).format('DD/MM/YYYY')} />
              <Button
                key="editConsutanlt"
                type="primary"
                size="middle"
                // icon eye
                style={{ float: 'right' }}
                block={true}
                onClick={() => handleModal()}
              >
                Thêm dịch vụ
              </Button>
              <ProTable
                columns={columns}
                // bỏ nút làm lại và tìm kiếm
                search={false}
                // bỏ setting cột

                rowKey="key"
                pagination={false}
                dataSource={dataSource}
                components={{
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                  },
                }}
              />
              <div style={{ marginTop: 20 }}>
                <Button
                  type="primary"
                  style={{ float: 'right' }}
                  onClick={() => {
                    setDrawerVisit(true);
                  }}
                >
                  Hoá đơn
                </Button>

                <Button type="primary" onClick={showModal1} style={{ float: 'left' }}>
                  Thông tin chim qua từng ngày
                </Button>

                {booking?.status === 'processing' ? (
                  <>
                    {/* <Button
                      type="primary"
                      style={{
                        float: 'left',

                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: '#52c41a',
                      }}
                      onClick={() => {
                        handleClickAcceptChapnhan();
                      }}
                    >
                      Chấp nhận
                    </Button> */}
                    {/* <Button
                      type="primary"
                      style={{
                        float: 'left',
                        //cách bên trái 20px
                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: 'red',
                      }}
                      onClick={() => {
                        handleClickCancel();
                      }}
                    >
                      Từ chối
                    </Button> */}
                    <Button
                      type="primary"
                      style={{
                        float: 'right',
                        //cách bên trái 20px
                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: '#52c41a',
                      }}
                    >
                      {booking?.status === 'accepted' ? 'Check in' : ''}
                    </Button>
                  </>
                ) : booking?.status === 'accepted' ? (
                  // trang thái accepted hiện thị nút từ chối với nút check in
                  <>
                    <Button
                      type="primary"
                      style={{
                        float: 'left',
                        //cách bên trái 20px
                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: 'red',
                      }}
                      onClick={() => {
                        handleClickCancel();
                      }}
                    >
                      Từ chối
                    </Button>
                    <Button
                      type="primary"
                      style={{
                        float: 'right',
                        //cách bên trái 20px
                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: '#52c41a',
                      }}
                      onClick={() => {
                        handleClickAccept();
                        //reload
                        actionRef?.current?.reload();
                      }}
                    >
                      {booking?.status === 'accepted' ? 'Check in' : ''}
                    </Button>
                  </>
                ) : booking?.status === 'waiting' ? (
                  <>
                    <Button
                      type="primary"
                      style={{
                        float: 'left',

                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: '#52c41a',
                      }}
                      onClick={() => {
                        handleClickAcceptChapnhan();
                      }}
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      type="primary"
                      style={{
                        float: 'left',
                        //cách bên trái 20px
                        marginRight: 20,
                        // nút màu xanh
                        backgroundColor: 'red',
                      }}
                      onClick={() => {
                        handleClickCancel();
                      }}
                    >
                      Từ chối
                    </Button>
                  </>
                ) : (
                  ''
                )}
              </div>

              <DrawerForm
                onOpenChange={setDrawerVisit}
                title="Hoá đơn"
                open={drawerVisit}
                okText="Xuất hoá đơn"
                onFinish={async () => {
                  try {
                    const bookingId = localStorage.getItem('bookingId');
                    await acceptBooking(bookingId);
                    message.loading('Đang xử lí ...', 9999);
                    actionRef?.current?.reload();
                    setIsModalVisibleReport(false);
                    message.destroy();
                    message.success('Xuất hoá đơn thành công');
                  } catch (error) {
                    message.fail('Lưu thất bại');
                  }
                }}
              >
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="name"
                    disabled
                    label="Tên khách hàng :"
                    value={bill.customerName}
                  />

                  <ProFormText
                    width="md"
                    disabled
                    name="company"
                    label="Chim của khách hàng :"
                    value={bill.birdOfCustomer}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="contract"
                    disabled
                    label="Loại chim :"
                    value={bill.typeOfBird}
                  />
                  <ProFormText
                    width="md"
                    name="contract"
                    disabled
                    label="Ngày nhận :"
                    value={moment(bill?.dateBooking).format('DD/MM/YYYY')}
                  />
                </ProForm.Group>
                <ProFormText
                  name="contract"
                  disabled
                  label="Ngày bắt đầu :"
                  value={moment(bill.dateStart).format('DD/MM/YYYY')}
                />
                <ProFormText
                  name="contract"
                  disabled
                  label="Ngày kết thúc  :"
                  value={moment(bill.dateEnd).format('DD/MM/YYYY')}
                />

                <ProFormText
                  name="project"
                  disabled
                  label="Dịch vụ :"
                  value={serviceNames.join(', ')}
                />

                <ProFormText name="project" disabled label="Số ngày:" value={bill.amountDay} />
                <CheckCard
                  title="Tổng tiền"
                  description={bill.total}
                  //description color red, italic, bold
                  descriptionStyle={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}
                  avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
                />
              </DrawerForm>
              {flagEditForm === 'info' ? (
                <Modal
                  title="Thông tin chim qua từng ngày"
                  open={open}
                  onOk={hideModal}
                  onCancel={hideModal1}
                  footer={null}
                  width={1000}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisibleReport(true)}
                  >
                    Tạo báo cáo
                  </Button>
                  <Modal
                    title="Thông tin tạo báo cáo"
                    visible={isModalVisibleReport}
                    okText="Lưu"
                    onCancel={hideModalReport}
                    footer={[
                      <Button key="back" onClick={hideModalReport}>
                        Hủy bỏ
                      </Button>,
                      <Button form="createReportForm" key="submit" htmlType="submit" type="primary">
                        Lưu
                      </Button>,
                    ]}
                  >
                    <Form
                      name="createReportForm"
                      initialValues={{ remember: true }}
                      onFinish={handleCreateReportClick}
                    >
                      <Form.Item
                        name="date"
                        label="Ngày"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                      >
                        <DatePicker />
                      </Form.Item>
                      <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="message"
                        label="Thông điệp"
                        rules={[{ required: true, message: 'Vui lòng nhập thông điệp!' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Form>
                  </Modal>
                  {bookingReport?.map((item) => (
                    <div key={item.id}>
                      <ProCard
                        //flex
                        title={moment(item.date).format('DD/MM/YYYY')}
                        extra={
                          <RightOutlined
                            rotate={!collapsed[item.id] ? 90 : undefined}
                            onClick={() => {
                              setCollapsed({ ...collapsed, [item.id]: !collapsed[item.id] });
                              // lấy id của báo cáo
                              localStorage.setItem('id', item.id);
                            }}
                          />
                        }
                        style={{ marginBlockStart: 16, backgroundColor: '#f2f2f2' }}
                        headerBordered
                        collapsed={!collapsed[item.id]}
                      >
                        {collapsed[item.id] && (
                          <ProCard
                            // title="Video"
                            style={{ height: 500 }}
                            headerBordered
                            bodyStyle={{ padding: 0 }}
                          >
                            <div>
                              {/* description */}
                              <div style={{ padding: 16 }}>
                                <h3>Thông tin</h3>
                                <p>{item.description}</p>
                                <iframe
                                  width="100%"
                                  height="315"
                                  src="https://www.youtube.com/embed/KUybRJNfMXE"
                                  title="YouTube video player"
                                />
                              </div>
                            </div>
                          </ProCard>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                          <ProFormTextArea
                            // hiện thị tin nhán của messageHost trong dó
                            value={item.messageHost}
                            disabled
                            label="Bạn"
                            color="red"
                          />

                          <ProFormTextArea
                            // hiện thị tin nhán của messageHost trong dó
                            placeholder={'chưa có trả lời'}
                            value={item.messageCustomer}
                            disabled
                            label="Khách hàng"
                          />
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input.Search
                              //
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
              ) : (
                // nếu flagEditForm = 'sevice' thì hiện thị form dịch vụ
                flagEditForm === 'service' && (
                  // <ModalForm
                  //   showModal={showModalService}
                  //   titleModal="Chỉnh sửa dịch vụ"
                  //   handleCancelModel={handleCancelModel}
                  //   formRef={formUserRef}
                  //   buttonSubmitter={buttonSubmitterUser}
                  //   handleSubmitForm={handleSubmitFormUser1}
                  //   formField={formFieldEditSpecialist1}
                  //   customUpload={customUpload}
                  //   imgLinkFirebase={imgLinkFirebase}
                  //   handleResetForm={handleResetForm}
                  //   buttonLoading={buttonEditLoading}
                  // />
                  <ModalForm
                    showModal={showModal}
                    titleModal="Thêm dịch vụ"
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
                )
              )}
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
                <ProFormText width="md" value={booking?.typeOfBird} />
                <h3>Tên chim:</h3>
                <ProFormText width="md" value={booking?.birdOfCustomer} />
                {/* <h3>Sức khỏe - Bệnh lý:</h3>
                <ProFormText height={100} value={'Bình thường'} /> */}
              </ProCard>
              <ProCard
                //cách trên 18px
                style={{ marginTop: 18 }}
              >
                <h1 style={{ textDecoration: 'underline' }}>KHÁCH HÀNG</h1>
                <h3>Họ và tên:</h3>
                <ProFormText width="md" value={booking?.customerName} />
                <h3>SĐT:</h3>
                <ProFormText width="md" value={'038965973933'} />
                <h3>Email:</h3>
                <ProFormText height={100} value={'caucavuighe@gmail.com'} />
              </ProCard>
            </ProCard>
          </ProCard>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default React.memo(User);
