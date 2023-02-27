import request from '@/utils/requestServer';

// export const getCustomers = async (params) => {
//   return await request
//     .get(`/api/Customers/Getallcustomer${params ? `?search=${params}` : ''}`)
//     .then((response) => {
//       console.log('response getUsers', response);

//       return response.data;
//     })
//     .catch((error) => {
//       console.log('errorGetUsers', error);
//     });
// };

// https://swpbirdboardingv1.azurewebsites.net/api/Bookings/GetBookingList?search=1&accountid=3&pagesize=10&pagenumber=1

export const GetBookingList = async (params, response) => {
  const accountId = localStorage.getItem('accountId');

  return await request
    .get(
      `/api/Bookings/GetBookingList?search=${params}&accountid=${accountId}&pagesize=10&pagenumber=1`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('errorGetUsers', error);
    });
};

export const editCustomer = (body) => {
  return request.put('api/Customers/update', { data: body });
};
export const login = async (body) => {
  return await request.post('/api/v1/Accounts/LoginByHost', {
    data: body,
    accountid: 1,
  });
};
export const getCurrentUser = async () => {
  return await request.get('/api/v1/users/current');
};

export const getAnCustomer = async (userId) => {
  return await request
    .get(`/api/Customers/getbyid?id=${userId}`)
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log('errorGetAnUser', error);
    });
};
// https://psycteamv2.azurewebsites.net/api/SpecializationTypes/getallspecype?search=gg
export const getSpecializationTypes = async (params) => {
  return await request.get('/api/SpecializationTypes/getallspecype').then((res) => {
    console.log('response getSpecializationTypes', res);
    return res.data[0];
  });
};
export const getSevices = async (params) => {
  const accountId = localStorage.getItem('accountId');

  return await request
    // https://swpbirdboardingv1.azurewebsites.net/api/Services/GetServiceList?id=3&search=1&pagesize=10&pagenumber=1
    .get(`/api/Services/GetServiceList?id=${accountId}&pagesize=10&pagenumber=1`)
    .then((response) => {
      console.log('response getUsers', response);
      return response.data;
    })
    .catch((error) => {
      console.log('errorGetUsers', error);
    });
};

// https://psycteamv2.azurewebsites.net/api/SpecializationTypes/update/5
export const editSpecializationTypes = (body) => {
  return request.put('api/SpecializationTypes/update', { data: body });
};

export const createService = (body) => {
  return request.post('api/Services/CreateService', {
    data: body,
  });
};

//https://psycteamv2.azurewebsites.net/api/SpecializationTypes/create
export const createSpecializationTypes = (body) => {
  return request.post('api/SpecializationTypes/create', { data: body });
};

//https://psycteamv2.azurewebsites.net/api/Customers/BanUnban?id=2
export const banUnbanCustomer = (id) => {
  return request.delete(`/api/Customers/${id}`);
};

// export const GetBookingDetail = async (params) => {
//   return await request
//     .get(`/api/Bookings/GetBookingDetail?id=${params.id}`)
//     .then((response) => {
//       return response;
//     })
//     .catch((error) => {
//       return error;
//     });
// };
