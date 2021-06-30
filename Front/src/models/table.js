import { stringify } from 'querystring';
import { history } from 'umi';
import { queryRule} from '@/pages/TableList/service';
import { message } from 'antd';
const tableModel = {
  namespace: 'table',
  state: { // 真正会用到的信息
    tableInfo: undefined,
  },
  effects: {
    *table({ payload }, { call, put }) {
    //   payload 发给后端的参数
        console.log("后端:",payload)
        const response = yield call(queryRule, payload);
        console.log("table resp:",response)
        yield put({
            type: 'changeTableInfo',
            payload: response,
        });
      
    },
  },
  reducers: {
    changeTableInfo(state, { payload }) {
      return { ...state, tableInfo:payload};
    },
  },
};
export default tableModel;
