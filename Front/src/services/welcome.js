import request from '@/utils/request';
export async function fetchNum(params) {
  return request('/api/device/num', {
    method: 'GET',
    data: params,
  });
}

export async function fetchChart(params) {
    return request('/api/device/value', {
      method: 'POST',
      data: params,
    });
}

export async function fetchDisdata(params){
    return request('/api/device/dispAll', {
        method: 'GET',
        data: params,
      });
}

export async function fetchSearchdata(params){
  console.log("FAD's params", params)
  return request('/api/device/search', {
      method: 'POST',
      data: params,
    });
}

export async function ChangeAndFetch(params){
  console.log("UPD's params", params)
  return request('/api/device/update', {
      method: 'POST',
      data: params,
    });
}

export async function AddAndFetch(params){
  return request('/api/device/add', {
      method: 'POST',
      data: params,
    });
}

export async function FetchMap(params){
  return request('/api/device/map', {
      method: 'POST',
      data: params,
    });
}