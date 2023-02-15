//api/Withdrawals/Getallwithdraw
export const Getallwithdraw = async (params) => {
  return await request
    .get('/api/Withdrawals/Getallwithdraw', {
      params,
    })
    .then((response) => {
      return response.data;
    });
};
