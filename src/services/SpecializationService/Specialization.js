///api/SpecializationTypes
export const getSevices = async (params) => {
  return await request
    // https://swpbirdboardingv1.azurewebsites.net/api/Services/GetServiceList?id=3&search=1&pagesize=10&pagenumber=1
    .get(
      `/api/Services/GetServiceList?id=${params.id}&search=${params.search}&pagesize=${params.pagesize}&pagenumber=${params.pagenumber}`,
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};
