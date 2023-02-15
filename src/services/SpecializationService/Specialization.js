///api/SpecializationTypes
export const getSpecializationTypes = async (params) => {
  return await request
    .get(`/api/SpecializationTypes/getallspecype${params ? `?search=${params}` : ''}`)
    .then((res) => {
      console.log('response getSpecializationTypes', res);
      return res.data;
    });
};
