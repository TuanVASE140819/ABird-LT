import request from '@/utils/requestServer';
// /api/Consultants/Getallconsultantbyadmin?search=tt
export const getConsutanlts = async (params) => {
  return await request
    .get(`/api/Consultants/Getallconsultantbyadmin${params ? `?search=${params}` : ''} `)
    .then((response) => {
      console.log('response getConsutanlts', response);

      return response;
    })
    .catch((error) => {
      console.log('errorGetConsutanlts', error);
    });
};
export const editConsutanlt = async (body) => {
  return await request.put('/api/Consultants/update', { data: body });
};
export const editConsutanltStatus = async (userId) => {
  // https://psycteamv2.azurewebsites.net/api/Consultants/1
  return await request.delete(`/api/Consultants/${userId}`);
};

export const editConsutanltSpecialization = async (data) => {
  return await request.post('/api/Specializations/updatebylist', {
    data,
  });
};

export const getAConsutanlt = async (userId) => {
  return await request
    .get(`api/Consultants/getbyid?id=${userId}`)
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log('errorGetAConsutanlt', error);
    });
};
///api/Specializations/getbyconsultantid
export const getSpecializationsByUserId = async (userId) => {
  return await request
    .get(`api/Specializations/getbyconsultantid?id=${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log('errorGetSpecializations', error);
    });
};

export const getSpecializations = async () => {
  return await request
    .get('/api/SpecializationTypes/getallspecype')
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log('errorGetSpecializations', error);
    });
};

///api/Specializations/createbylist
export const createSpecializations = (body) => {
  return request.post('/api/Specializations/createbylist', { data: body });
};
