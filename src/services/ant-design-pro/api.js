import { request } from 'umi';
import token from '@/utils/token';

export async function getNotices(options) {
  return request('https://psycteamv2.azurewebsites.net/api/Notifications/getnotificationbyadmin', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function seenNoti(id, options) {
  return await request(`https://psycteamv2.azurewebsites.net/api/Notifications/seennoti?id=${id}`, {
    method: 'PUT',
    ...(options || {}),
  });
}
export async function seenAllNoti(options) {
  return request('https://psycteamv2.azurewebsites.net/api/Notifications/seenallnotibyadmin', {
    method: 'PUT',
    ...(options || {}),
  });
}

export async function rule(params, options) {
  return request('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function updateRule(options) {
  return request('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addRule(options) {
  return request('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeRule(options) {
  return request('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
