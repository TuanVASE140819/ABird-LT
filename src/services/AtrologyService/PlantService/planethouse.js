import request from '@/utils/requestServer';

export const getPlanetHouses = async (planetName, planetId, params) => {
  return await request
    .get(`/api/v1/planets/${planetName}-${planetId}/houses`, {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetPlanetHouse', error);
    });
};

export const addPlanetHouse = (planetName, planetId, body) => {
  return request.post(`/api/v1/planets/${planetName}-${planetId}/houses`, {
    data: body,
  });
};

export const updatePlanetHouse = async (data) => {
  return await request.put(`/api/PlanetHouses/update`, {
    data,
  });
};

/**
 *
 * @param {{
 *    houseid: number;
 *    planetid: number
 * }} params
 * @returns
 */
export const getAnPlanetHouse = async (params) => {
  return await request
    .get(`/api/PlanetHouses/getbyidplahou`, {
      params,
    })
    .then((res) => {
      if (res?.data?.length) {
        return res.data[0];
      }
      return null;
    })
    .catch((error) => {
      console.log('errorGetAnPlanetHouse', error);
    });
};
