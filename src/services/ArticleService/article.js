import request from '@/utils/requestServer';

export const addArticle = (body) => {
  return request.post('/api/Articles/create', { data: body });
};

export const getArticleList = async (params) => {
  return await request
    .get('/api/Articles/GetallArticles', {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetNews', error);
    });
};

export const deleteArticle = (newsId) => {
  return request.delete(`/api/Articles/${newsId}`);
};

export const getAnArticle = async (newsId) => {
  return await request
    .get(`/api/Articles/getbyid?id=${newsId}`)
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log('errorGetAnNews', error);
    });
};

export const updateArticle = (body) => {
  return request.put('api/Articles/update', {
    data: body,
  });
};

export const getDeposits = async (params) => {
  return await request
    .get('/api/Deposits/Getalldeposit', {
      params,
    })
    .then((response) => {
      return response.data;
      console.log('api deposit', response);
    })
    .catch((error) => {
      console.log('errorGetDeposits', error);
    });
};
