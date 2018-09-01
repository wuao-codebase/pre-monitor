// 直接更新state的多个方法
import {
  RECEIVE_USER,
  SET_TOKEN,
  SET_SRP,
  SET_MONIT,
  SET_REPORT
} from './mutation-types'
export default {

  [SET_TOKEN](state, {
    token
  }) {
    state.token = token
  },

  [RECEIVE_USER](state, {
    user
  }) {
    state.user = user
  },

  [SET_SRP](state, {
    srp
  }) {
    state.srp = srp
  },

  [SET_MONIT](state, {
    monit
  }) {
    state.monit = monit
  },

  [SET_REPORT](state, {
    report
  }) {
    state.report = report
  },

}
