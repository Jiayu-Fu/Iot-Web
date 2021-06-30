import request from '@/utils/request';

export async function queryRule(params) {
  //mock使用
  // return request('/api/rule', {
  //   params,
  // });

  //no-mock使用
  
  if(!params){
    params = 'first time'
  }
  console.log("req data:", params)
  return request('/api/device/query', {
    method: 'GET',
    data: params,
  });
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
