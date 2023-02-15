import React, { useEffect, useState } from 'react';
import { Button, message, Space, Image } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import { uploadFile } from '@/utils/uploadFile';
import {
  addZodiac,
  getZodiacs,
  deleteZodiac,
  updateZodiac,
  getAnZodiac,
} from '@/services/ant-design-pro/zodiac';
import {
  getSurveyTypeList,
  getASurveyType,
  createSurveyType,
  updateSurveyType,
} from '@/services/SurveyService/survey';
import showConfirm from '@/components/ModalConfirm';
import ProSkeleton from '@ant-design/pro-skeleton';
import SurveyTypeList from './component/SurveyTypeList';
import { Content } from 'antd/lib/layout/layout';
import { create } from 'lodash';
import { history } from 'umi';

const Zodiac = () => {
  const buttonSubmitter = [
    {
      key: 'clearFieldFormZodiac',
      type: 'default',
      click: 'reset',
      name: 'Quay lại',
      loading: false,
    },
    {
      key: 'submitAddZodiac',
      type: 'primary',
      click: 'submit',
      name: 'Lưu',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'name',
      label: 'Tên loại khảo sát',
      width: 'lg',
      placeholder: 'Nhập tên loại khảo sát',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Vui lòng nhập tên loại khảo sát',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'name',
      label: 'Tên loại khảo sát',
      width: 'lg',
      placeholder: 'Nhập tên loại khảo sát',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Vui lòng nhập tên loại khảo sát',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'zodiacMainContent',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  const tableZodiacRef = React.useRef();
  const formZodiacRef = React.useRef();
  const editorRef = React.useRef();
  //state của uploadimg lên firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua text editor
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [zodiacRecord, setZodiacRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterZodiac, setButtonSubmitterZodiac] = React.useState(buttonSubmitter);
  const [formFieldAddZodiac, setFormFieldAddZodiac] = React.useState(formFieldAdd);
  const [formFieldEditZodiac, setFormFieldEditZodiac] = React.useState(formFieldEdit);
  //loading zodiac
  const [loadingZodiac, setLoadingZodiac] = useState(false);
  //trigger load list zodiac when add new
  const [triggerAddNewZodiac, setTriggerAddNewZodiac] = useState(false);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  //list data zodiac
  const [dataList, setDataList] = useState([]);
  const [mode, setMode] = useState('add');

  useEffect(() => {
    getList();
  }, []);

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

  //xuli loading button submit form add or edit zodiac
  React.useEffect(() => {
    const newButtonSubmitZodiac = buttonSubmitterZodiac.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterZodiac(newButtonSubmitZodiac);
  }, [buttonLoading]);

  const getList = async () => {
    try {
      setLoadingZodiac(true);
      const listSurveyType = await getSurveyTypeList();
      if (listSurveyType?.data) {
        const listSurveyTypeDataSrc = [];
        listSurveyType.data?.map((item) => {
          const surveyType = {};
          surveyType.id = item.id;
          surveyType.name = item.name;
          listSurveyTypeDataSrc.push(surveyType);
        });
        setDataList(listSurveyTypeDataSrc);
      }
    } catch (error) {
    } finally {
      setLoadingZodiac(false);
    }
  };

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
      const imgLink = await uploadFile(file, 'zodiac');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        if (flagEditForm) {
          formZodiacRef?.current?.setFieldsValue({
            ['icon']: imgLink,
          });
        } else {
          formZodiacRef?.current?.setFieldsValue({
            ['zodiacIcon']: imgLink,
          });
        }
        setLoadingUploadingImgFirebase(false);
        message.success('Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      setLoadingUploadingImgFirebase(false);
      onError(error);
    }
  };

  const onClickAdd = () => {
    setMode('add');
    setShowModal(true);
    setZodiacRecord(null);
    formZodiacRef.current?.resetFields();
  };

  const onClickEdit = (item) => {
    setMode('edit');
    setShowModal(true);
    setZodiacRecord(item);
    setTimeout(() => {
      formZodiacRef.current?.setFieldsValue(item);
    }, 0);
  };

  const onClickDelele = async (item) => {
    try {
      const res = await deleteSurveyType(item.id);
      if (res?.data) {
        message.success('Thay đổi trạng thái thành công!');
        getList();
      }
    } catch (error) {
      message.error('Chưa thể ẩn danh mục này!');
    }
  };

  const onClickDetail = (item) => {
    history.push(`/survey/${item.id}`);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setZodiacRecord(null);
    setImgLinkFirebase(null);
    setStateEditor(null);
    if (formZodiacRef) {
      formZodiacRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formZodiacRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormZodiac = async (values) => {
    try {
      setButtonLoading(true);
      if (mode === 'add') {
        await createSurveyType(values);
      } else {
        await updateSurveyType({ ...values, id: zodiacRecord.id });
      }
      await getList();
      setShowModal(false);
    } catch (error) {
    } finally {
      setButtonLoading(false);
    }
  };

  //xuli mo form edit zodiac
  const handleEditZodiacForm = async (record) => {
    const idZodiac = record.id;
    setButtonEditLoading(true);
    const zodiac = await getASurveyType(idZodiac);
    setButtonEditLoading(false);
    if (zodiac?.name) {
      const newObjRecord = { ...zodiac };
      newObjRecord.zodiacMainContent = newObjRecord.mainContent;
      delete newObjRecord.mainContent;
      setZodiacRecord(newObjRecord);
      setStateEditor(newObjRecord.zodiacMainContent);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formZodiacRef?.current?.setFieldsValue(newObjRecord);
    }
  };

  //xuli delete zodiac
  const handleOkDeleteZodiac = async (record) => {
    const result = await deleteZodiac(record.id);
    // console.log('record delete', record);
    if (result) {
      tableZodiacRef?.current?.reload();
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (content) => {
    if (content) {
      formZodiacRef?.current?.setFieldsValue({
        ['zodiacMainContent']: content,
      });
    }
  };

  return (
    <>
      <PageContainer
        style={{
          margin: '50px',
          background: '#fff',
        }}
      >
        <Content>
          <Button
            size="middle"
            key="buttonAddPlanet"
            type="primary"
            icon={<PlusOutlined />}
            onClick={onClickAdd}
          >
            Thêm loại khảo sát
          </Button>
          {loadingZodiac ? (
            <ProSkeleton type="list" statistic={false} />
          ) : (
            <SurveyTypeList
              dataList={dataList}
              onDelete={onClickDelele}
              onEdit={onClickEdit}
              onClick={onClickDetail}
            />
          )}
        </Content>
      </PageContainer>
      <ModalForm
        showModal={showModal}
        titleModal={mode === 'add' ? 'Thêm loại khảo sát' : 'Chỉnh sửa loại khảo sát'}
        widthModal="900"
        handleCancelModel={handleCancelModal}
        formRef={formZodiacRef}
        buttonSubmitter={buttonSubmitterZodiac}
        handleSubmitForm={handleSubmitFormZodiac}
        formField={formFieldAddZodiac}
        customUpload={customUpload}
        imgLinkFirebase={imgLinkFirebase}
        stateEditor={stateEditor}
        handleChangeStateEditor={handleChangeStateEditor}
        editorRef={editorRef}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default Zodiac;
