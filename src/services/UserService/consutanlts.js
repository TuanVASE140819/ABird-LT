import request from '@/utils/requestServer';
// https://swpbirdboardingv1.azurewebsites.net/api/Home/AddService
export const createService = async (body) => {
  return await request.post('/api/Home/AddService', {
    data: {
      ...body,
    },
  });
};

export const getBookingList = async (params) => {
  const accountId = localStorage.getItem('accountId');
  return await request
    .get(
      `/api/Bookings/GetBookingList?search=${params}&accountid=${accountId}&pagesize=10&pagenumber=1`,
    )
    .then((res) => {
      console.log('response getBookingList', res.data);
      return {
        data: res.data,
        success: true,
      };
    })

    .catch((error) => {
      console.log('errorGetUsers', error);
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
  const accountId = localStorage.getItem('accountId');
  // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/UpdateServiceBooking
  return await request.post('/api/Bookings/UpdateServiceBooking', {
    data: {
      ...data,
    },
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
// ///api/Specializations/getbyconsultantid
export const getSpecializationsByUserId = async (userId) => {
  const accountId = localStorage.getItem('accountId');
  return await request
    // .get(`api/Services/GetServiceList?id=${accountId}&pagesize=10&pagenumber=1`)
    // .then((res) => {
    //   return res.data;
    // })
    // .catch((error) => {
    //   console.log('errorGetSpecializations', error);
    // });
    // https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingDetail?id=2
    .get(`api/Bookings/GetBookingDetail?id=${userId}`)
    .then((res) => {
      return res.data[0].service;
    })
    .catch((error) => {
      console.log('errorGetSpecializations', error);
    });
};

export const getSpecializations = async () => {
  // https://swpbirdboardingv1.azurewebsites.net/api/Services/GetServiceList?id=3&pagesize=10&pagenumber=1
  const accountId = localStorage.getItem('accountId');
  return await request
    .get(`api/Services/GetServiceList?id=${accountId}&pagesize=10&pagenumber=1`)
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
