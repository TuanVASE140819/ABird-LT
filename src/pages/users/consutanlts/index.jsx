import { EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, message, Space, Tag, Rate } from 'antd';
import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import {
  getConsutanlts,
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

const User = () => {
  //config column
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      width: '3%',
      sorter: (a, b) => a.number - b.number,
      search: false,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      copyable: true,
      valueType: 'fullname',
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      filters: true,
      onFilter: true,
      with: '15%',
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'nhập tên để tìm kiếm',
          },
        ],
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: false,
      copyable: true,
      valueType: 'phoneNumber',
      sorter: (a, b) => a.email.length - b.email.length,
      filters: true,
      onFilter: true,
      width: '15%',
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
      title: 'Xếp hạng',
      search: false,
      dataIndex: 'rating',
      valueType: 'select',
      width: '15%',
      render: (_, record) => {
        return (
          <Rate
            // chỉ đọc
            disabled
            allowHalf
            defaultValue={record.rating}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      search: false,
      dataIndex: 'status',
      valueType: 'select',
      width: '10%',
      valueEnum: {
        null: { text: 'Đang chờ', status: 'Default' },
        active: { text: 'Hoạt động', status: 'Success' },
        inactive: { text: 'Ngừng hoạt động', status: 'Error' },
      },
    },
    {
      title: 'Điểm quá hạn',
      search: false,
      dataIndex: 'flag',
      valueType: 'select',
      width: '10%',
      align: 'center',
      valueEnum: {
        0: { text: '0', status: 'Success' },
        1: { text: '1', status: 'Warning' },
        2: { text: '2', status: 'Warning' },
        3: { text: '3', status: 'Error' },
        4: { text: '4', status: 'Error' },
        6: { text: '5', status: 'Error' },
        7: { text: '6', status: 'Error' },
        8: { text: '7', status: 'Error' },
        9: { text: '8', status: 'Error' },
        10: { text: '9', status: 'Error' },
        11: { text: '10', status: 'Error' },
        12: { text: '11', status: 'Error' },
        16: { text: '16', status: 'Error' },
        17: { text: '16', status: 'Error' },
        18: { text: '16', status: 'Error' },
        19: { text: '16', status: 'Error' },
        20: { text: '16', status: 'Error' },
        21: { text: '16', status: 'Error' },
        22: { text: '16', status: 'Error' },
        23: { text: '16', status: 'Error' },
        23: { text: '16', status: 'Error' },
      },
      width: '13%',
    },
    {
      title: 'Thao tác',
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
                Chuyên môn
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

  // React.useEffect(() => {
  //   if (userRecord) {
  //     const newFormFieldEditUser = formFieldEditUser.map((item, index) => {
  //       if (item.name === 'userName') {
  //         item.value = userRecord.userName;
  //       } else if (item?.name === 'phoneNumber') {
  //         item.value = userRecord.phoneNumber;
  //       }
  //       return item;
  //     });
  //     setFormFieldEditUser(newFormFieldEditUser);
  //     //Vì modal form khi hủy modal giá trị initial value vẫn ko đổi nên ta
  //     //phải dùng setFieldvalue để set value cho các field
  //     formUserRef?.current?.setFieldsValue(userRecord);
  //   }
  // }, [userRecord]);

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
        consultantId: userRecord.id,
        specId: values.specialist,
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

  const handleEditSpecialist = async (record) => {
    const userId = record?.id;
    setButtonEditLoading(true);
    const user = await getSpecializationsByUserId(userId);
    if (user) {
      setUserRecord({ id: userId });
      setShowModel(!showModal);
      formUserRef?.current?.setFieldsValue({
        specialist: user.map((item) => item.specializationTypeId),
      });
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
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          rowKey={(record) => record.id}
          request={async (params, sort, filter) => {
            const data = [];
            await getConsutanlts(params.fullName ?? '').then((res) => {
              console.log('res at table query', res);
              res?.data?.map((item, index) => {
                item.number = index + 1;
                data[index] = item;
              });
              setTotal(res?.total);
            });
            // }

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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tư vấn viên`,
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Tìm kiếm',
            submittext: 'Lưu',
            resetText: 'Quay lại',
          }}
          toolBarRender={(action) => [
            <Button
              size="middle"
              key="buttonAddNews"
              type="primary"
              onClick={() => {
                //chuyển qua trang chuyên môn
                history.push('/users/consutanlts/specialization');
              }}
            >
              Chuyên môn
            </Button>,
          ]}
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
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Chỉnh sửa chuyên môn"
          handleCancelModel={handleCancelModel}
          formRef={formUserRef}
          buttonSubmitter={buttonSubmitterUser}
          handleSubmitForm={handleSubmitFormUser1}
          formField={formFieldEditSpecialist1}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleResetForm={handleResetForm}
        />
      )}
    </>
  );
};

export default React.memo(User);
