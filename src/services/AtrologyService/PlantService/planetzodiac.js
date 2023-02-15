import request from '@/utils/requestServer';

export const getPlanetZodiacs = async (id) => {
  return await request
    .get('/api/ZodiacPlanets/getbyid', {
      params: {
        id,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetPlanetZodiacs', error);
    });
};

export const addPlanetZodiac = (planetName, planetId, body) => {
  return request.post(`/api/v1/planets/${planetName}-${planetId}/zodiacs`, {
    data: body,
  });
};

export const updatePlanetZodiac = async (data) => {
  return await request.put(`/api/ZodiacPlanets/update`, {
    data,
  });
};

/**
 *
 * @param {{
 *    zodiacid: number;
 *    planetid: number;
 * }} data
 * @returns
 */
export const getAnPlanetZodiac = async (data) => {
  return await request
    .get('/api/ZodiacPlanets/getbyidzopla', {
      params: data,
    })
    .then((res) => {
      if (res?.data?.length) {
        return res.data[0];
      }
      return null;
    })
    .catch((error) => {
      console.log('errorGetAnPlanetZodiac', error);
    });
};
