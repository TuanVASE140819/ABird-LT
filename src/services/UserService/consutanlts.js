import request from '@/utils/requestServer';
// /api/Consultants/Getallconsultantbyadmin?search=tt
// export const getConsutanlts = async (params) => {
//   return await request
//     .get(`/api/Consultants/Getallconsultantbyadmin${params ? `?search=${params}` : ''} `)
//     .then((response) => {
//       console.log('response getConsutanlts', response);

//       return response;
//     })
//     .catch((error) => {
//       console.log('errorGetConsutanlts', error);
//     });
// };
// https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingList?accountid=3&pagesize=10&pagenumber=1
export const getBookingList = async (params) => {
  const accountId = localStorage.getItem('accountId');
  return await request
    .get(`/api/Bookings/GetBookingList?search=&accountid=${accountId}&pagesize=10&pagenumber=1`)
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
///api/Specializations/getbyconsultantid
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
