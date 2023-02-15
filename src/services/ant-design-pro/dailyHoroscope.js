import request from '@/utils/requestServer';

/**
 *
 * @param {{id: number; date: string}} params
 * @returns
 */
export const getDailyHoroscopes = async (params) => {
  return await request
    .get('/api/DailyHoroscopes/Getalldailyhoroscopes', {
      params,
    })
    .then((response) => {
      return response.data;
    });
};

export const getDailyHoroscope = async (id) => {
  return await request
    .get('/api/DailyHoroscopes/getbyid', {
      params: {
        id,
      },
    })
    .then((response) => {
      return response.data[0];
    });
};

export const updateDailyHoroscope = async (data) => {
  return await request
    .put('/api/DailyHoroscopes/update', {
      data,
    })
    .then((response) => {
      return response.data;
    });
};

// api upload file excel
export const uploadFileExcel = async (data) => {
  return await request
    .post('api/DailyHoroscopes/CreateExcel', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data;
    });
};
