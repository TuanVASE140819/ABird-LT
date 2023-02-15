import request from '@/utils/requestServer';

export const getZodiacHouses = async (zodiacName, zodiacId, params) => {
  return await request
    .get(`/api/v1/zodiacs/${zodiacName}-${zodiacId}/houses`, {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetZodiacHouses', error);
    });
};

export const addZodiacHouse = (zodiacName, zodiacId, body) => {
  return request.post(`/api/v1/zodiacs/${zodiacName}-${zodiacId}/houses`, {
    data: body,
  });
};

export const updateZodiacHouse = async (data) => {
  return await request.put(`/api/ZodiacHouses/update`, {
    data,
  });
};

export const getAnZodiacHouse = async (zodiacid, houseid) => {
  return await request
    .get(`/api/ZodiacHouses/getbyidzoho`, {
      params: {
        zodiacid,
        houseid,
      },
    })
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log('errorGetAnZodiacHouse', error);
    });
};
