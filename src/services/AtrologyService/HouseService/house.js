import request from '@/utils/requestServer';

export const addHouse = (body) => {
  return request.post('/api/v1/houses', {
    data: body,
  });
};

export const getHouses = async (params) => {
  return await request
    .get(`/api/Houses/GetallHouses${params ? `?search=${params}` : ''}`)
    .then((response) => {
      console.log('response houses', response);

      return response;
    })
    .catch((error) => {
      console.log('errGetHouses', error);
    });
};

export const deleteHouse = (houseId) => {
  return request.delete(`/api/v1/houses/${houseId}`);
};

export const getAnHouse = async (houseId) => {
  return await request
    .get(`/api/Houses/getbyid?id=${houseId}`)
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log('errorGetAnHouse', error);
    });
};

export const updateHouse = (body) => {
  return request.put(`/api/Houses/update`, {
    data: body,
  });
};
