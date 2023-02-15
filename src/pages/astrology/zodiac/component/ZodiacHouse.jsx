import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getHouses } from '@/services/AtrologyService/HouseService/house';
import {
  getZodiacHouses,
  getAnZodiacHouse,
  updateZodiacHouse,
  addZodiacHouse,
} from '@/services/AtrologyService/ZodiacService/zodiachouse';
import { uploadFile } from '@/utils/uploadFile';
import ModalForm from '@/components/ModalForm';
import { Content } from 'antd/lib/layout/layout';
import ListHouse from '@/components/ListHouse/ListHouse';
import ProSkeleton from '@ant-design/pro-skeleton';

const ZodiacHouse = (props) => {
  const { zodiac, handleTriggerLoadZodiac } = props;

  const buttonSubmitter = [
    {
      key: 'clearFieldFormZodiacHouse',
      type: 'default',
      click: 'reset',
      name: 'Quay lại',
      loading: false,
    },
    {
      key: 'submitAddZodiacHouse',
      type: 'primary',
      click: 'submit',
      name: 'Lưu',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formSelect',
      key: 'selectHouseId',
      name: 'houseId',
      label: 'House',
      placeholder: 'Select House',
      requiredField: 'true',
      ruleMessage: 'Please select House',
      valueEnum: [],
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'content',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'description',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  const formZodiacHouseRef = useRef();
  const editorRef = useRef();

  //state cua editor
  const [stateEditor, setStateEditor] = useState(null);
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [zodiacHouseRecord, setZodiacHouseRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = useState('');
  //data table
  const [dataTable, setDataTable] = useState([]);
  //state trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //button submit
  const [buttonSubmitterZodiacHouse, setButtonSubmitterZodiacHouse] = useState(buttonSubmitter);
  //form field
  const [formFieldAddZodiacHouse, setFormFieldAddZodiacHouse] = useState(formFieldAdd);
  const [formFieldEditZodiacHouse, setFormFieldEditZodiacHouse] = useState(formFieldEdit);
  //paging table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(20);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);
  //dataListHouse
  const [dataList, setDataList] = useState([]);
  //loading list house
  const [loadingListHouse, setLoadingListHouse] = useState(false);
  //button view loading
  const [viewLoading, setViewLoading] = useState(false);
  //modalViewDetail
  const [modalViewDetail, setModalViewDetail] = useState(false);
  //load list house
  useEffect(() => {
    (async () => {
      setLoadingListHouse(true);
      const result = await getHouses();

      if (result?.data?.length > 0) {
        const listDataSrc = [];
        result?.data?.map((item) => {
          const house = {};
          house.id = item.id;
          house.imageUrl = item.imageUrl;
          house.name = item.name;
          house.title = item.name;
          house.selected = false;
          house.description = item.description;
          listDataSrc.push(house);
        });
        setDataList(listDataSrc);
        //set field
        const valueEnum = [];
        result?.data?.map((item) => {
          const el = {
            valueName: item.id,
            valueDisplay: item.name,
          };
          valueEnum.push(el);
        });
        const newFieldAdd = [];
        formFieldAddZodiacHouse?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectHouseId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        setFormFieldAddZodiacHouse(newFieldAdd);
        const newFieldEdit = [];
        formFieldEditZodiacHouse?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectHouseId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        setFormFieldEditZodiacHouse(newFieldEdit);
      }
      setLoadingListHouse(false);
    })();
  }, []);

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

  //xuli loading button submit form add or edit
  useEffect(() => {
    const newButtonSubmitZodiacHouse = buttonSubmitterZodiacHouse.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterZodiacHouse(newButtonSubmitZodiacHouse);
  }, [buttonLoading]);

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setZodiacHouseRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setZodiacHouseRecord(null);
    setStateEditor(null);
    if (formZodiacHouseRef) {
      formZodiacHouseRef?.current?.resetFields();
    }
  };
  const handleResetForm = () => {
    formZodiacHouseRef?.current?.resetFields();
    setStateEditor(null);
    editorRef?.current?.getEditor().setContents([{ insert: '\n' }]);
  };

  //xuli mo form edit zodiac House
  const handleEditZodiacHouseForm = async (record) => {
    if (modalViewDetail) {
      handleCancelModalViewDetail();
    }
    try {
      const idZodiacHouse = record.id;
      setButtonEditLoading(true);
      const zodiacHouse = await getAnZodiacHouse(zodiac.id, idZodiacHouse);

      if (zodiacHouse?.id) {
        setZodiacHouseRecord(zodiacHouse);
        setStateEditor(zodiacHouse.description);
        setFlagEditForm('edit');
        setShowModal(!showModal);
        formZodiacHouseRef?.current?.setFieldsValue(zodiacHouse);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setButtonEditLoading(false);
    }
  };

  //handle submit form
  const handleSubmitFormZodiacHouse = async (values) => {
    try {
      console.log(zodiacHouseRecord);
      setButtonLoading(true);
      await updateZodiacHouse({
        // ...values,
        id: zodiacHouseRecord.id,
        zodiacid: zodiac.id,
        houseid: zodiacHouseRecord.houseId,
        description: values.description,
      });
      setShowModal(false);
      handleTriggerLoadZodiac();
    } catch (error) {
    } finally {
      setButtonLoading(false);
    }
  };

  const handleChangeStateEditor = (content) => {
    formZodiacHouseRef?.current?.setFieldsValue({
      ['description']: content,
    });
  };

  const handleUploadImgInEditor = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      try {
        let file = input.files[0];
        const imgLinkEditor = await uploadFile(file, 'editor');
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

  const handleButtonView = async (item) => {
    const params = {};
    params.HouseId = item?.id;
    setViewLoading(true);
    const zodiacHouse = await getZodiacHouses(zodiac?.name, zodiac?.id, params);
    if (zodiacHouse?.payload) {
      setZodiacHouseRecord(zodiacHouse.payload[0]);
      setModalViewDetail(true);
    }
    setViewLoading(false);
  };

  const handleCancelModalViewDetail = () => {
    setModalViewDetail(false);
  };

  return (
    <>
      <Content
        style={{
          padding: '16px',
          background: '#fff',
        }}
      >
        {loadingListHouse ? (
          <ProSkeleton type="list" list="12" />
        ) : (
          <ListHouse
            houseList={dataList}
            span={6}
            handleClickCard={handleEditZodiacHouseForm}
            button={true}
            handleButtonView={handleButtonView}
          />
        )}
      </Content>
      <ModalForm
        showModal={showModal}
        titleModal="Chỉnh sửa thông tin"
        widthModal="900"
        handleCancelModel={handleCancelModal}
        formRef={formZodiacHouseRef}
        buttonSubmitter={buttonSubmitterZodiacHouse}
        handleSubmitForm={handleSubmitFormZodiacHouse}
        formField={formFieldEditZodiacHouse}
        stateEditor={stateEditor}
        handleChangeStateEditor={handleChangeStateEditor}
        editorRef={editorRef}
        handleUploadImgInEditor={handleUploadImgInEditor}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default ZodiacHouse;
