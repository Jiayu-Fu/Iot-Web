import { stringify } from 'querystring';
import { history } from 'umi';
import { fetchNum, fetchChart } from '@/services/welcome';
import { message } from 'antd';
import moment from 'moment'

const welcomeModel = {
  namespace: 'welcome',

  state: { // 真正会用到的信息(在页面上展示的信息)
    t_num: -1,
    o_num: -1,
    d_num: -1,
    // chart_info: {"value":0, "timestamp": 1624777999824}
    chart_info: undefined
  },

  effects: {
    *welcome({ payload }, { call, put }) {
        // 向后端发送请求
        const response = yield call(fetchNum, payload);
        // console.log("table resp:",response)
        // 收到请求， 调用reducer该数据
        yield put({
            type: 'changeNum',
            payload: response,
        });
    },
    *lineChart({ payload }, { call, put }) {
        // 向后端发送请求
        const response = yield call(fetchChart, payload);
        console.log("table resp:",response)
        // 收到请求， 调用reducer该数据
        yield put({
            type: 'changeChart',
            payload: response,
        });
    },
  },
  reducers: {
    changeNum(state, { payload }) {
      return { ...state, t_num: payload.total_num, o_num: payload.online_num, d_num:payload.data_num };
    },

    changeChart(state, { payload }){
        console.log(" LENGTH :", payload.length)
        for (let i = 0; i < payload.length; i++){
            let time = moment(payload[i].timestamp).format()
            payload[i] = { ...payload[i], timestamp:time}
        }
        console.log("reduce:", payload)
        return{ ... state, chart_info:payload}
    }
  },
};
export default welcomeModel;
