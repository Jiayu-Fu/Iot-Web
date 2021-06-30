import {fetchDisdata, ChangeAndFetch, AddAndFetch, fetchSearchdata} from '@/services/welcome';
import moment from 'moment'

const deviceModel = {
  namespace: 'deviceList',

  state: { // 真正会用到的信息(在页面上展示的信息)
    list: []
  },

  effects: {
    *deviceList({ payload }, { call, put }) {
        // 向后端发送请求
        console.log("in devicelist!!")
        const response = yield call(fetchDisdata, payload);
        // console.log("table resp:",response)
        // 收到请求， 调用reducer该数据
        yield put({
            type: 'changeDeviceInfo',
            payload: response,
        });
    },
    *submit({ payload }, { call, put }) {
        // 向后端发送请求
        const action = payload.act
        console.log("in submit act", action)

        if (action){
            const response = yield call(ChangeAndFetch, payload.value);
        // console.log("table resp:",response)
        // 收到请求， 调用reducer该数据
            yield put({
                type: 'changeDeviceInfo',
                payload: response,
            });
        }else{
            console.log("catch add!")
            const response = yield call(AddAndFetch, payload.value);
        // console.log("table resp:",response)
        // 收到请求， 调用reducer该数据
            yield put({
                type: 'changeDeviceInfo',
                payload: response,
            });
      }   
    },
    *searchAndUpdate({ payload }, { call, put }) {
      // 向后端发送请求
      console.log("search", payload)
      const response = yield call(fetchSearchdata, payload);
      console.log("SEARCH resp:",response)
      // 收到请求， 调用reducer该数据
      yield put({
          type: 'changeDeviceInfo',
          payload: response,
      });
  },

  },
  reducers: {
    changeDeviceInfo(state, { payload }) {
      return { ...state, list:payload};
    },
  },
};
export default deviceModel;
