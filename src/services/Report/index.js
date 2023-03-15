import request from '@/utils/requestServer';

export const getTotalDashboard = async () => {
  const accountId = localStorage.getItem('accountId');
  //swpbirdboardingv1.azurewebsites.net/api/Home/Gettotaldashboard?accountid=3
  https: return await request
    .get(`/api/Home/Gettotaldashboard?accountid=${accountId}`)
    .then((response) => {
      return response.data;
    });
};

// export const getReportWithdrawalByYear = async () => {
//   return await request.get('/api/ReportDashboard/ReportWithdrawalByYear').then((response) => {
//     return response.data;
//   });
// };

export const getReportDepositByYear = async () => {
  const accountId = localStorage.getItem('accountId');
  //swpbirdboardingv1.azurewebsites.net/api/Home/Gettotaldashboard?accountid=3
  https: return await request
    .get(`api/Home/ReportByYear?accountid=3&year=2023`)
    .then((response) => {
      return response.data;
    });
};

export const getTopConsultantsByRate = async () => {
  const accountId = localStorage.getItem('accountId');
  return await request.get(`/api/Home/Gettopservice?accountid=${accountId}`).then((response) => {
    return response.data;
  });
};
