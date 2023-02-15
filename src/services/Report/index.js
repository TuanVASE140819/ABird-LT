import request from '@/utils/requestServer';

export const getTotalDashboard = async () => {
  return await request.get('/api/ReportDashboard/gettotaldashboard').then((response) => {
    return response.data[0];
  });
};

export const getReportWithdrawalByYear = async () => {
  return await request.get('/api/ReportDashboard/ReportWithdrawalByYear').then((response) => {
    return response.data;
  });
};

export const getReportDepositByYear = async () => {
  return await request.get('/api/ReportDashboard/ReportDepositByYear').then((response) => {
    return response.data;
  });
};

export const getTopConsultantsByRate = async () => {
  return await request.get('/api/ReportDashboard/Gettopconsultantbyrate').then((response) => {
    return response.data;
  });
};
