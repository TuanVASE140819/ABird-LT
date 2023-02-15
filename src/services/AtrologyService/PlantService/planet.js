import request from '@/utils/requestServer';

export const addPlanet = async (body) => {
  return await request
    .post('/api/v1/planets', { data: body })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorAddPlanet', error);
    });
};

export const getPlanets = async (params) => {
  return await request
    .get('/api/Planets/Getallplanets', {
      params: params,
    })
    .then((response) => {
      console.log('response getPlanets', response);
      return response;
    })
    .catch((error) => {
      console.log('errorGetPlanets', error);
    });
};

export const deletePlanet = (planetId) => {
  return request.delete(`/api/v1/planets/${planetId}`);
};

export const getAnPlanet = async (id) => {
  return await request
    .get('/api/Planets/getbyid', {
      params: {
        id,
      },
    })
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log('errorGetAnPlanet', error);
    });
};

export const updatePlanet = (data) => {
  return request.put('/api/Planets/update', {
    data,
  });
};
