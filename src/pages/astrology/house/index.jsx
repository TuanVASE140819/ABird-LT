import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, message, Space } from 'antd';
import React from 'react';
import {
  addHouse,
  getHouses,
  deleteHouse,
  updateHouse,
  getAnHouse,
} from '@/services/AtrologyService/HouseService/house';
import { uploadFile } from '@/utils/uploadFile';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
const House = () => {
  //config column table
  const column = [
    {
      title: 'STT',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
      width: '15%',
    },
    {
      title: 'Tên nhà',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: true,
      onFilter: true,
      search: false,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Tên nhà không được để trống',
          },
        ],
      },
      width: '25%',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'icon',
      copyable: true,
      search: false,
      render: (_, record) => {
        return (
          <Space>
            <Image width={50} src={record.imageUrl} />
          </Space>
        );
      },
      width: '25%',
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
                onClick={() => handleEditHouseForm(record)}
              >
                Chỉnh sửa
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
      key: 'clearFieldFormHouse',
      type: 'default',
      click: 'reset',
      name: 'Quay lại',
      loading: false,
    },
    {
      key: 'submitAddHouse',
      type: 'primary',
      click: 'submit',
      name: 'Lưu',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddHouseName',
      label: 'Tên nhà',
      width: 'lg',
      placeholder: 'Nhập tên nhà',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Tên nhà không được để trống',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddHouseTitle',
      label: 'House Title',
      width: 'lg',
      placeholder: 'Nhập tiêu đề nhà',
      name: 'title',
      requiredField: 'true',
      ruleMessage: 'Input House Title before submit',
    },
    // {
    //   fieldType: 'formText',
    //   key: 'fieldAddHouseTag',
    //   label: 'House Tag',
    //   width: 'lg',
    //   placeholder: 'Enter House Tag',
    //   name: 'tag',
    //   requiredField: 'true',
    //   ruleMessage: 'Input House Tag before submit',
    // },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'House Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'imageUrl',
      nameUpload: 'iconHouse',
      nameInputFile: 'houseFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddHouseDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Nhập mô tả',
      name: 'description',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'maincontent',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddHouseName',
      label: 'Tên nhà',
      width: 'lg',
      placeholder: 'Nhập tên nhà',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Tên nhà không được để trống',
    },
    // {
    //   fieldType: 'formText',
    //   key: 'fieldAddHouseTag',
    //   label: 'House Tag',
    //   width: 'lg',
    //   placeholder: 'Enter House Tag',
    //   name: 'tag',
    //   requiredField: 'true',
    //   ruleMessage: 'Input House Tag before submit',
    // },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Biểu tượng nhà',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'imageUrl',
      nameUpload: 'iconHouse',
      nameInputFile: 'houseFileToFirebase',
      readOnly: 'true',
      // requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddHouseDescription',
      label: 'Mô tả',
      width: 'lg',
      placeholder: 'Nhập mô tả',
      name: 'description',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'maincontent',
    },
  ];

  //ref cua table, editor, form
  const tableHouseRef = React.useRef();
  const formHouseRef = React.useRef();
  const editorRef = React.useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua editor
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [houseRecord, setHouseRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterHouse, setButtonSubmitterHouse] = React.useState(buttonSubmitter);
  const [formFieldAddHouse, setFormFieldAddHouse] = React.useState(formFieldAdd);
  const [formFieldEditHouse, setFormFieldEditHouse] = React.useState(formFieldEdit);
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(12);
  const [total, setTotal] = React.useState(20);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  //xuli loading upload img firebase
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
      message.loading('Đang tải ...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [buttonEditLoading]);
  //xuli loading button submit form add or edit house
  React.useEffect(() => {
    const newButtonSubmitHouse = buttonSubmitterHouse.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterHouse(newButtonSubmitHouse);
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
      const imgLink = await uploadFile(file, 'house');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formHouseRef?.current?.setFieldsValue({
          imageUrl: imgLink,
        });
        message.success('Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoadingUploadingImgFirebase(false);
    }
  };

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setHouseRecord(null);
    setImgLinkFirebase(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setHouseRecord(null);
    setImgLinkFirebase(null);
    // setStateEditor(null);
    if (formHouseRef) {
      formHouseRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formHouseRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormHouse = async (values) => {
    console.log(values);
    // setButtonLoading(true);
    // setStateEditor(values.mainContent);
    // if (values.edit) {
    // const newValues = Object.assign({}, { ...values, maincontent: values.mainContent });
    // const attr = 'edit';
    // const dataEdit = Object.keys(newValues).reduce((item, key) => {
    //   if (key !== attr) {
    //     item[key] = newValues[key];
    //   }
    //   return item;
    // }, {});
    await updateHouse({ ...values, id: houseRecord.id });
    setShowModal(false);
    // } else {
    //   await addHouse(values);
    // handleResetForm();
    // setStateEditor(null);
    // }
    tableHouseRef?.current?.reload();
    // setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditHouseForm = async (record) => {
    const houseId = record.id;
    setButtonEditLoading(true);
    const house = await getAnHouse(houseId);
    setButtonEditLoading(false);
    if (house) {
      const newObjRecord = { ...house };
      newObjRecord.description = newObjRecord.description;
      delete newObjRecord.decription;
      setHouseRecord(newObjRecord);
      setStateEditor(newObjRecord.maincontent);
      setFlagEditForm('edit');
      setImgLinkFirebase(newObjRecord.imageUrl);
      setShowModal(!showModal);
      formHouseRef?.current?.setFieldsValue(newObjRecord);
    }
  };

  //xuli delete house
  const handleOkDeleteHouse = async (record) => {
    const result = await deleteHouse(record.id);
    if (result) {
      tableHouseRef?.current?.reload();
    }
  };
  //xuli change text in editor
  const handleChangeStateEditor = (state) => {
    if (state) {
      formHouseRef?.current?.setFieldsValue({
        ['maincontent']: state,
      });
    }
  };

  //xuli up anh trong text editor
  const handleUploadImgInEditor = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    console.log('A');
    input.onchange = async () => {
      console.log('b');

      try {
        console.log('c');

        let file = input.files[0];
        message.loading('Upload...', 9999);
        const imgLinkEditor = await uploadFile(file, 'editor');
        message.destroy();
        if (imgLinkEditor) {
          message.success('Add Image Success!');
          const range = editorRef?.current?.getEditorSelection();
          editorRef?.current?.getEditor().insertEmbed(range.index, 'image', imgLinkEditor);
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          actionRef={tableHouseRef}
          rowKey={(record) => record.id}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} Nhà`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Tìm kiếm',
            submittext: 'Xác nhận',
            resetText: 'Quay lại',
            placeholderTitle: 'Tìm kiếm',
          }}
          request={async (params, sort, filter) => {
            const data = [];
            await getHouses(params.name ?? '').then((res) => {
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
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Chỉnh sửa  ${houseRecord.name}`}
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formHouseRef}
          buttonSubmitter={buttonSubmitterHouse}
          handleSubmitForm={handleSubmitFormHouse}
          formField={formFieldEditHouse}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New House"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formHouseRef}
          buttonSubmitter={buttonSubmitterHouse}
          handleSubmitForm={handleSubmitFormHouse}
          formField={formFieldAddHouse}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      )}
    </>
  );
};

export default House;
