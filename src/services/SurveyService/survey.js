import request from '@/utils/requestServer';

// /api/SurveyTypes/getallsurveytype

export const getSurveyTypeList = (body) => {
  return request.get('api/SurveyTypes/getallsurveytype');
};

///api/SurveyTypes/{id}

export const getASurveyType = async (zodiacId) => {
  return await request.get(`api/SurveyTypes/${zodiacId}`).then((res) => {
    console.log('A');
    return res;
  });
};

///https://psycteamv2.azurewebsites.net/api/Surveys/getsurveybysurveytypeidbyadmin?surveytypeid=1

export const getSurveyBySurveyTypeId = async (surveyTypeId) => {
  return await request
    .get(`api/Surveys/getSurveyBySurveyTypeIdByAdmin?surveyTypeId=${surveyTypeId}`)
    .then((res) => {
      console.log('B');
      return res;
    });
};

///api/Questions/getquestionbysurveyid
export const getQuestionBySurveyId = async (surveyId) => {
  return await request
    .get(`api/Questions/getquestionbysurveyid?surveyid=${surveyId}`)
    .then((res) => {
      console.log('C');
      return res;
    });
};

export const addQuestion = async (data) => {
  return await request.post('/api/Questions/create', { data }).then((res) => {
    console.log('C');
    return res;
  });
};

export const deleteQuestion = async (id) => {
  return await request.delete('/api/Questions/removefromsurvey', { params: { id } }).then((res) => {
    console.log('C');
    return res;
  });
};

export const updateQuestion = async (data) => {
  return await request.put('/api/Questions/update', { data }).then((res) => {
    console.log('C');
    return res;
  });
};

//https://psycteamv2.azurewebsites.net/api/OptionQuestions/getoptionbyquestionid?questionid=1
export const getOptionByQuestionId = async (questionId) => {
  return await request
    .get(`api/OptionQuestions/getoptionbyquestionid?questionid=${questionId}`)
    .then((res) => {
      console.log('D');
      return res;
    });
};

export const updateQuestionOption = async (data) => {
  return await request.put('/api/OptionQuestions/update', { data }).then((res) => {
    return res;
  });
};

export const addQuestionOption = async (data) => {
  return await request.post('/api/OptionQuestions/create', { data }).then((res) => {
    return res;
  });
};

// https://psycteamv2.azurewebsites.net/api/OptionQuestions/65
// xóa theo api này
export const deleteQuestionOption = async (id) => {
  const res = await request(`/api/OptionQuestions/${id}`, {
    method: 'DELETE',
  });
};
// /api/SurveyTypes/create
export const createSurveyType = async (body) => {
  return await request.post('api/SurveyTypes/create', { data: body }).then((res) => {
    console.log('E');
    return res;
  });
};
// api​/SurveyTypes​/update
export const updateSurveyType = async (body) => {
  return await request.put('api/SurveyTypes/update', { data: body }).then((res) => {
    console.log('F');
    return res;
  });
};

///api/Surveys/getallsurvey
export const getSurveyList = async (body) => {
  return await request.get('/api/Surveys/getallsurveybyadmin');
};

// /api/Surveys/create

export const createSurvey = async (body) => {
  return await request.post('api/Surveys/create', {
    data: body,
  });
};

export const updateSurvey = async (body) => {
  return await request.put('/api/Surveys/update', { data: body }).then((res) => {
    console.log('F');
    return res;
  });
};

export const deleteSurvey = async (id) => {
  return await request.put('/api/Surveys/inactive', { params: { id } }).then((res) => {
    console.log('F');
    return res;
  });
};
