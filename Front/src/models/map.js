import { message } from 'antd';
import { FetchMap } from '@/services/welcome';

const mapModel = {
  namespace: 'map',

  state: { // 真正会用到的信息
    mapInfo: undefined,
  },
  effects: {
    *map({ payload }, { call, put }) {
    //   payload 发给后端的参数
        console.log("找地图的数据呢:",payload)
        const response = yield call(FetchMap, payload);
        console.log("table resp in Map:",response)
        yield put({
            type: 'changeMapInfo',
            payload: response,
        });
      
    },
  },
  reducers: {
    changeMapInfo(state, { payload }) {
        let dataArr = []
        let alertArr = []
        for(let i = 0; i<payload.length; i++){
            let t_arr = []
            t_arr.push(payload[i].lng)
            t_arr.push(payload[i].lat)

            alertArr.push(payload[i].alert)

            dataArr.push(t_arr)
        }

        console.log("MapData:", alertArr)
      return { ...state, mapInfo:dataArr, alert_info: alertArr};
    },
  },
};
export default mapModel;
