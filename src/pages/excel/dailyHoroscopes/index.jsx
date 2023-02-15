import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import {
  getDailyHoroscope,
  getDailyHoroscopes as getDailyHoroscopesApi,
  updateDailyHoroscope,
  uploadFileExcel,
} from '@/services/ant-design-pro/dailyHoroscope';
import React, { useEffect, useRef, useState } from 'react';
import { getZodiacs } from '@/services/ant-design-pro/zodiac';
import { Button, DatePicker, message, Select } from 'antd';
import moment from 'moment';

export default () => {
  const [editableKeys, setEditableRowKeys] = useState(() => []);
  const formRef = useRef();
  const actionRef = useRef();
  const editableFormRef = useRef();
  const columns = [
    {
      title: 'Cung hoàng đạo',
      dataIndex: 'imageUrl',
      valueType: 'image',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      valueType: 'date',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Tổng quan',
      width: 200,
      dataIndex: 'context',
      valueType: 'textarea',
    },
    {
      title: 'Công việc',
      width: 200,
      dataIndex: 'job',
      valueType: 'textarea',
    },
    {
      title: 'Tình cảm',
      width: 200,
      dataIndex: 'affection',
      valueType: 'textarea',
    },
    {
      title: 'Số may mắn',
      ProFormDigit: true,
      dataIndex: 'luckyNumber',
      valueType: 'digit',
    },
    {
      title: 'Thời gian tốt',
      dataIndex: 'goodTime',
      valueType: 'time',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      valueType: 'textarea',
    },
    {
      title: 'Cần làm',
      dataIndex: 'shouldThing',
      valueType: 'textarea',
    },
    {
      title: 'Không nên làm',
      dataIndex: 'shouldNotThing',
      valueType: 'textarea',
    },

    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="edit"
          onClick={() => {
            var _a;
            (_a = actionRef.current) === null || _a === void 0 ? void 0 : _a.startEditable(row.id);
          }}
        >
          Sửa
        </a>,
      ],
    },
  ];

  const [zodiacs, setZodiacs] = useState([]);
  const [selectedZodiacId, setSelectedZodiacId] = useState(null);
  const [dailyHoroscopes, setDailyHoroscopes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment());

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await Promise.all([getZodiacs()]);
        setZodiacs(res[0].data);
        setSelectedZodiacId(res[0].data[0].id);
      } catch (error) {}
    };

    getData();
  }, []);

  useEffect(() => {
    const getDailyHoroscopes = async () => {
      if (selectedZodiacId !== null) {
        try {
          message.loading('Đang tải ...', 9999);
          const res = await getDailyHoroscopesApi({
            id: selectedZodiacId,
            date: selectedMonth.format('YYYY-MM'),
          });
          formRef.current.setFieldsValue({
            table: res.map((item) => {
              const [hour, minute] = item.goodTime.split(':');
              return {
                ...item,
                goodTime: new Date(0, 0, 0, hour, minute),
                date: new Date(item.date),
              };
            }),
          });
          setDailyHoroscopes(res);
        } catch (error) {
        } finally {
          message.destroy();
        }
      }
    };

    getDailyHoroscopes();
  }, [selectedZodiacId, selectedMonth]);

  return (
    <ProCard>
      <div
        style={{
          maxWidth: '100%',
          margin: 'auto',
        }}
      >
        <ProForm
          formRef={formRef}
          initialValues={{
            table: [],
          }}
        >
          <ProFormDependency name={['table']}>
            {({ table }) => {
              // const info = table.reduce(
              //   (pre, item) => {
              //     return {
              //       totalScore:
              //         pre.totalScore +
              //         parseInt(
              //           (
              //             (item === null || item === void 0 ? void 0 : item.fraction) || 0
              //           ).toString(),
              //           10,
              //         ),
              //       questions:
              //         pre.questions +
              //         parseInt(
              //           (
              //             (item === null || item === void 0 ? void 0 : item.questionsNum) || 0
              //           ).toString(),
              //           10,
              //         ),
              //     };
              //   },
              //   { totalScore: 0, questions: 0 },
              // );
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    paddingBlockEnd: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>Tổng lá phiếu: {dailyHoroscopes.length}</div>
                  {/* <div style={{ flex: 1 }}>题数：{info.questions}</div> */}
                  <div style={{ flex: 2 }}>
                    <DatePicker
                      // change laguage month from english to vietnamese
                      picker="month"
                      value={selectedMonth}
                      onChange={setSelectedMonth} // change month
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <Select
                      name="type"
                      label="Tìm kiếm theo loại"
                      value={selectedZodiacId}
                      onChange={setSelectedZodiacId}
                    >
                      {zodiacs.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              );
            }}
          </ProFormDependency>
          <EditableProTable
            rowKey="id"
            scroll={{
              x: true,
            }}
            editableFormRef={editableFormRef}
            controlled
            actionRef={actionRef}
            formItemProps={{
              label: 'Lá phiếu tử vi',
              rules: [
                {
                  validator: async (_, value) => {
                    if (value.length < 1) {
                      throw new Error('至少需要一行');
                    }
                    if (value.length > 5) {
                      throw new Error('最多可以设置五个题库');
                    }
                  },
                },
              ],
            }}
            maxLength={10}
            name="table"
            columns={columns}
            recordCreatorProps={{
              record: (index) => {
                return { id: index + 1 };
              },
            }}
            value={dailyHoroscopes}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              title: 'Sửa',
              onSave: async (rowKey, data, row) => {
                console.log('data', data);
              },
            }}
          />
          <ProFormUploadButton
            label="Tải lên file excel"
            title="Tải lên file excel"
            name="file"
            action="https://psycteamv2.azurewebsites.net/api/DailyHoroscopes/CreateExcel"
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
        </ProForm>
      </div>
    </ProCard>
  );
};
