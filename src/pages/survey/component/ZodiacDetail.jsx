import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image, message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import style from './zodiacdetail.less';
import { Content } from 'antd/lib/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { uploadFile } from '@/utils/uploadFile';
import { updateZodiac } from '@/services/ant-design-pro/zodiac';
import ModalForm from '@/components/ModalForm';

import ProSkeleton from '@ant-design/pro-skeleton';
import QuestionList from './QuestionList';

const ZodiacDetail = (props) => {
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

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldEditZodiacName',
      label: 'Tên cung',
      width: 'lg',
      placeholder: 'nhập tên cung hoàng đạo',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Vui lòng nhập tên cung hoàng đạo',
    },
    {
      fieldType: 'formCalendar',
      labelTimeDay: 'Ngày bắt đầu',
      nameTimeDay: 'dayStart',
      minTimeDay: '1',
      maxTimeDay: '31',
      placeholderTimeDay: 'Zodiac Day Start',
      controlsTimeDay: 'false',

      labelTimeMonth: 'Tháng bắt đầu',
      nameTimeMonth: 'monthStart',
      minTimeMonth: '1',
      maxTimeMonth: '12',
      placeholderTimeMonth: 'Zodiac Month Start',
      controlsTimeMonth: 'false',
      hidden: true,
    },
    {
      fieldType: 'formCalendar',
      labelTimeDay: 'Ngày kết thúc',
      nameTimeDay: 'dayEnd',
      minTimeDay: '1',
      maxTimeDay: '31',
      placeholderTimeDay: 'Zodiac Day End',
      controlsTimeDay: 'false',

      fieldType: 'formCalendar',
      labelTimeMonth: 'Tháng kết thúc',
      nameTimeMonth: 'monthEnd',
      minTimeMonth: '1',
      maxTimeMonth: '12',
      placeholderTimeMonth: 'Zodiac Month End',
      controlsTimeMonth: 'false',
      hidden: true,
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Hình ảnh',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'imageUrl',
      nameUpload: 'iconZodiac',
      nameInputFile: 'zodiacFileToFirebase',
      readOnly: true,
      requiredField: true,
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'ShortDescription',
      title: 'Mô tả ngắn',
      nameTextArea: 'descriptionShort',
    },
    {
      fieldType: 'EditorMainContent',
      title: 'Nội dung chính',
      nameTextArea: 'descriptionDetail',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];
  const { zodiac, handleTriggerLoadZodiac } = props;
  const formZodiacRef = useRef();
  const editorRef = useRef();
  const editorShortDescriptionRef = useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(zodiac.imageUrl);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua editor
  const [stateEditor, setStateEditor] = React.useState(null);
  const [stateShortDescriptionEditor, setStateShortDescriptionEditor] = useState(null);

  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [buttonSubmitterZodiac, setButtonSubmitterZodiac] = React.useState(buttonSubmitter);
  const [formFieldEditZodiac, setFormFieldEditZodiac] = React.useState(formFieldEdit);
  const [flag, setFlag] = React.useState(false);
  const safeMainContent = DOMPurify.sanitize(zodiac?.descriptionDetail);
  const safeDescription = DOMPurify.sanitize(zodiac?.descriptionShort);

  //xuli loading upload img firebase
  useEffect(() => {
    if (loadingUploadImgFirebase) {
      message.loading('Đang tải ...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [loadingUploadImgFirebase]);

  useEffect(() => {
    const updateDescriptionZodiac = { ...zodiac };
    formZodiacRef?.current?.setFieldsValue(updateDescriptionZodiac);
  }, [flag]);

  //xuli loading button submit form add or edit zodiac
  useEffect(() => {
    const newButtonSubmitZodiac = buttonSubmitterZodiac.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterZodiac(newButtonSubmitZodiac);
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
      const imgLink = await uploadFile(file, 'zodiac');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formZodiacRef?.current?.setFieldsValue({
          ['imageUrl']: imgLink,
        });
        setLoadingUploadingImgFirebase(false);
        message.success('Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      setLoadingUploadingImgFirebase(false);
      onError(error);
    }
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setImgLinkFirebase(null);
    setStateEditor(null);
    setStateShortDescriptionEditor(null);
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
      await updateZodiac({ ...values, id: zodiac.id });
      handleTriggerLoadZodiac();
      setShowModal(false);
    } catch (error) {
    } finally {
      setButtonLoading(false);
    }
  };

  //xuli mo form edit zodiac
  const handleEditZodiacForm = () => {
    if (zodiac?.name) {
      const newObjRecord = { ...zodiac };
      newObjRecord.zodiacDescription = newObjRecord.descriptionShort;
      delete newObjRecord.descreiption;
      setImgLinkFirebase(newObjRecord.imageUrl);
      setStateEditor(newObjRecord.descriptionDetail);
      setStateShortDescriptionEditor(newObjRecord.descriptionShort);
      setShowModal(!showModal);
      setFlag(!flag);
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
        <QuestionList />
      </PageContainer>

      <ModalForm
        showModal={showModal}
        titleModal={`Chỉnh sửa cung: ${zodiac.name}`}
        widthModal="900"
        handleCancelModel={handleCancelModal}
        formRef={formZodiacRef}
        buttonSubmitter={buttonSubmitterZodiac}
        handleSubmitForm={handleSubmitFormZodiac}
        formField={formFieldEditZodiac}
        customUpload={customUpload}
        imgLinkFirebase={imgLinkFirebase}
        stateEditor={stateEditor}
        stateShortDescriptionEditor={stateShortDescriptionEditor}
        editorRef={editorRef}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default ZodiacDetail;
