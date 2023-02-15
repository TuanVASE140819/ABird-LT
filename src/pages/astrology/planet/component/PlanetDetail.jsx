import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image, message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import style from './planetdetail.less';
import { Content } from 'antd/lib/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { uploadFile } from '@/utils/uploadFile';
import { updatePlanet } from '@/services/AtrologyService/PlantService/planet';
import ModalForm from '@/components/ModalForm';

const PlanetDetail = (props) => {
  const buttonSubmitter = [
    {
      key: 'clearFieldFormPlanet',
      type: 'default',
      click: 'reset',
      name: 'Quay lại',
      loading: false,
    },
    {
      key: 'submitAddPlanet',
      type: 'primary',
      click: 'submit',
      name: 'Lưu',
      loading: false,
    },
  ];
  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetName',
      label: 'Tên hành tinh',
      width: 'lg',
      placeholder: 'Nhập tên hành tinh',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Nhập Tên hành tinh trước khi gửi',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetTag',
      label: 'Biểu Tượng',
      width: 'lg',
      placeholder: 'Nhập biểu tượng',
      name: 'tag',
      requiredField: 'true',
      ruleMessage: 'Nhập Thẻ hành tinh trước khi gửi',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Ảnh',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'imageUrl',
      nameUpload: 'iconPlanet',
      nameInputFile: 'planetFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Tải lên hình ảnh trước khi gửi',
    },
    {
      fieldType: 'ShortDescription',
      title: 'Mô tả ngắn :',
      nameTextArea: 'description',
    },
    {
      fieldType: 'EditorMainContent',
      title: 'Nội dung :',
      nameTextArea: 'maincontent',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];
  const { planet, handleTriggerLoadPlanet } = props;
  const formPlanetRef = useRef();
  const editorRef = useRef();
  const editorShortDescriptionRef = useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(planet.imageUrl);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua editor
  const [stateShortDescriptionEditor, setStateShortDescriptionEditor] = useState(null);
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [buttonSubmitterPlanet, setButtonSubmitterPlanet] = React.useState(buttonSubmitter);
  const [formFieldEditPlanet, setFormFieldEditPlanet] = React.useState(formFieldEdit);
  const [flag, setFlag] = React.useState(false);
  const safeMainContent = DOMPurify.sanitize(planet.maincontent);
  const safeDescription = DOMPurify.sanitize(planet.description);

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
    const updateDescriptionPlanet = { ...planet };
    formPlanetRef?.current?.setFieldsValue(updateDescriptionPlanet);
  }, [flag]);

  //xuli loading button submit form add or edit planet
  useEffect(() => {
    const newButtonSubmitPlanet = buttonSubmitterPlanet.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterPlanet(newButtonSubmitPlanet);
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
      const imgLink = await uploadFile(file, 'planet');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formPlanetRef?.current?.setFieldsValue({
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
    if (formPlanetRef) {
      formPlanetRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formPlanetRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormPlanet = async (values) => {
    try {
      setButtonLoading(true);
      setStateEditor(values.maincontent);
      setStateShortDescriptionEditor(values.description);
      // if (values.edit) {
      //   const newValues = Object.assign({}, values);
      //   const attr = 'edit';
      //   const dataEdit = Object.keys(newValues).reduce((item, key) => {
      //     if (key !== attr) {
      //       item[key] = newValues[key];
      //     }
      //     return item;
      //   }, {});
      await updatePlanet({ ...values, id: planet.id });
      // }
      setShowModal(false);
      handleTriggerLoadPlanet();
    } catch (error) {
    } finally {
      setButtonLoading(false);
    }
  };

  //xuli mo form edit zodiac
  const handleEditPlanetForm = () => {
    if (planet?.name) {
      const newObjRecord = { ...planet };
      setStateEditor(newObjRecord.maincontent);
      setStateShortDescriptionEditor(newObjRecord.description);
      setShowModal(!showModal);
      setFlag(!flag);
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (state) => {
    if (state) {
      formPlanetRef?.current?.setFieldsValue({
        ['maincontent']: state,
      });
    }
  };

  const handleChangeStateShortDescriptionEditor = (content) => {
    formPlanetRef?.current?.setFieldsValue({
      ['description']: content,
    });
  };

  //xuli up anh trong text editor
  const handleUploadImgInEditor = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      try {
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
      <Content
        className={style.site_layout_background}
        style={{
          padding: '40px 50px',
        }}
      >
        <Button
          className={style.button_floading}
          type="primary"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => handleEditPlanetForm()}
        />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Title className={style.title}>{planet?.name}</Title>
          <Image
            width={50}
            src={planet?.icon}
            preview={false}
            style={{
              marginLeft: '12px',
              marginBottom: '12px',
            }}
          />
        </div>
        <Title
          level={4}
          style={{
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          {planet?.title}
        </Title>
        {planet?.tag?.split('-').map((item, index) => {
          if (index % 2 === 0 && index <= 5) {
            return <Tag color="blue">{item}</Tag>;
          }
          if (index % 2 !== 0 && index <= 5) {
            return <Tag color="green">{item}</Tag>;
          }
          return <Tag color="pink">{item}</Tag>;
        })}
        <Paragraph
          style={{
            margin: '12px 0px',
            width: '70%',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: safeDescription }} />
        </Paragraph>
        <Paragraph>
          <div dangerouslySetInnerHTML={{ __html: safeMainContent }} />
        </Paragraph>
      </Content>

      <ModalForm
        showModal={showModal}
        titleModal={`Chỉnh sửa  ${planet.name}`}
        widthModal="900"
        handleCancelModel={handleCancelModal}
        formRef={formPlanetRef}
        buttonSubmitter={buttonSubmitterPlanet}
        handleSubmitForm={handleSubmitFormPlanet}
        formField={formFieldEditPlanet}
        customUpload={customUpload}
        imgLinkFirebase={imgLinkFirebase}
        stateEditor={stateEditor}
        stateShortDescriptionEditor={stateShortDescriptionEditor}
        handleChangeStateShortDescriptionEditor={handleChangeStateShortDescriptionEditor}
        handleChangeStateEditor={handleChangeStateEditor}
        editorRef={editorRef}
        editorShortDescriptionRef={editorShortDescriptionRef}
        handleUploadImgInEditor={handleUploadImgInEditor}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default PlanetDetail;
