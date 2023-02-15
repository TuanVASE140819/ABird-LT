import {
  getDailyHoroscope,
  getDailyHoroscopes,
  updateDailyHoroscope,
  uploadFileExcel,
} from '@/services/ant-design-pro/dailyHoroscope';
import { Avatar, Button, Card, Col, Divider, message, Row, Skeleton, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import ModalForm from '@/components/ModalForm';
import { uploadFile } from '@/utils/uploadFile';
import {
  ProFormUploadButton,
  ProFormUploadDragger,
  ProFormSegmented,
  ProFormDigitRange,
} from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import 'moment/locale/vi';
import vi from 'date-fns/locale/vi';

const formEditFields = [
  {
    fieldType: 'formText',
    key: 'affection',
    label: 'Tình cảm',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'affection',
    requiredField: 'true',
  },
  {
    fieldType: 'formText',
    key: 'color',
    label: 'Màu sắc',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'color',
    requiredField: 'true',
  },
  {
    fieldType: 'formTextArea',
    key: 'context',
    label: 'Định nghĩa',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'context',
    requiredField: 'true',
  },
  {
    fieldType: 'timePicker',
    key: 'goodTime',
    label: 'Thời gian tốt',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'goodTime',
  },
  {
    fieldType: 'formText',
    key: 'luckyNumber',
    label: 'Số may mắn',
    min: 0,
    max: 99,
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'luckyNumber',
    requiredField: 'true',
  },

  {
    fieldType: 'formText',
    key: 'shouldNotThing',
    label: 'Không nên làm',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'shouldNotThing',
    requiredField: 'true',
  },
  {
    fieldType: 'formText',
    key: 'shouldThing',
    label: 'Nên làm',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'shouldThing',
    requiredField: 'true',
  },
  {
    fieldType: 'formText',
    key: 'job',
    label: 'Công việc',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'job',
    requiredField: 'true',
  },
  {
    fieldType: 'formDatePicker',
    key: 'date',
    label: 'Ngày',
    width: 'lg',
    placeholder: 'Vui lòng nhập trường này',
    name: 'date',
    requiredField: 'true',
  },
  {
    fieldType: 'formInputFileImg',
    key: 'imageUrl',
    label: 'Hình ảnh',
    width: 'lg',
    placeholder: 'Icon Link',
    name: 'imageUrl',
    nameUpload: 'iconHouse',
    nameInputFile: 'houseFileToFirebase',
    readOnly: 'true',
    requiredField: 'true',
    ruleMessage: 'Upload image before submit',
  },
];

const buttonSubmitterData = [
  {
    key: 'clearFieldFormHouse',
    type: 'default',
    click: 'reset',
    name: 'Reset',
    loading: false,
  },
  {
    key: 'submitAddHouse',
    type: 'primary',
    click: 'submit',
    name: 'Submit',
    loading: false,
  },
];

export default function DailyHoroscope({ zodiac }) {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(moment().locale('vi'));
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const formEditRef = useRef();
  const [image, setImage] = useState();
  const [buttonSubmitter, setButtonSubmitter] = useState(buttonSubmitterData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await getDailyHoroscopes({
          id: zodiac.id,
          date: month.format('YYYY-MM'),
          locale: 'vi',
        });
        setData(res);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [month, zodiac]);

  useEffect(() => {
    setButtonSubmitter((b) =>
      b.map((item) => ({ ...item, loading: item.name === 'Submit' ? submitting : item.loading })),
    );
  }, [submitting]);

  useEffect(() => {
    if (selectedDate && modal) {
      formEditRef.current?.setFieldsValue(selectedDate);
    }
  }, [selectedDate, modal]);

  const showModal = () => setModal(true);
  const hideModal = () => setModal(false);

  const onPressDate = async (item) => {
    try {
      message.loading({ content: 'Đang tải ...', key: 'loading' });
      const res = await getDailyHoroscope(item.id);
      setImage(res.imageUrl);
      setSelectedDate(res);
      showModal();
    } catch (error) {
    } finally {
      message.destroy('loading');
    }
  };

  const customUpload = async ({ onError, onSuccess, file }) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
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
      message.loading({ content: 'Đang tải lên ...', key: 'loading' });
      const imgLink = await uploadFile(file, 'house');

      if (imgLink) {
        setImage(imgLink);
        formEditRef?.current?.setFieldsValue({
          imageUrl: imgLink,
        });
        message.success('Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      onError(error);
    } finally {
      message.destroy('loading');
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      setSubmitting(true);
      const goodTime = values.goodTime.split(':').slice(0, 2).join(':');
      await updateDailyHoroscope({
        ...values,
        id: selectedDate.id,
        goodTime,
      });
      setModal(false);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DatePicker
        // change laguage month from english to vietnamese
        locale={vi}
        picker="month"
        value={month}
        onChange={(date) => setMonth(date)} // change month
      />
      <Divider />
      Upload exel filel (Hãy chắc chắn dữ liệu trong file excel đã được duyệt qua)
      <ProFormUploadButton
        label="Tải lên file excel"
        title="Tải lên file excel"
        name="file"
        action="https://psycteam.azurewebsites.net/api/DailyHoroscopes/CreateExcel"
        maxCount={1}
        fieldProps={{
          accept: '.xlsx, .xls',
        }}
        beforeUpload={async (file) => {
          const isExcel =
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          if (!isExcel) {
            message.error('Bạn chỉ có thể tải lên tệp EXCEL!');
          }
          const isLt4M = file.size / 1024 / 1024 < 4;
          if (!isLt4M) {
            message.error('File phải nhỏ hơn 4MB!');
          }
          message.loading({ content: 'Đang tải lên ...', key: 'loading' });
          return isExcel && isLt4M;
        }}
        onSuccess={(res) => {
          if (res) {
            message.success('Tải lên file excel thành công!');
          }
          console.log(res);
        }}
      />
      {loading ? (
        <Skeleton />
      ) : (
        <Row
          gutter={[16, 16]}
          style={{
            marginBottom: '12px',
          }}
        >
          {data.map((item) => {
            const date = moment(item.date).date();

            return (
              <Col key={item.id}>
                <Card hoverable style={{ width: 210 }} onClick={() => onPressDate(item)}>
                  <Card.Meta avatar={<Avatar src={item.imageUrl} />} title={`Ngày ${date}`} />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      <ModalForm
        showModal={modal}
        titleModal={`Chỉnh sửa ngày ${moment(selectedDate?.date).date()}`}
        widthModal="800px"
        handleCancelModel={hideModal}
        formRef={formEditRef}
        buttonSubmitter={buttonSubmitter}
        handleSubmitForm={handleSubmitForm}
        formField={formEditFields}
        customUpload={customUpload}
        imgLinkFirebase={image}
        // stateEditor={stateEditor}
        // handleChangeStateEditor={handleChangeStateEditor}
        // editorRef={editorRef}
        // handleUploadImgInEditor={handleUploadImgInEditor}
        // handleResetForm={handleResetForm}
      />
    </>
  );
}
