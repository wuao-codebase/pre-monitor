// 通过mutation间接更新对象
import {
  RECEIVE_USER,
  SET_TOKEN,
  SET_SRP,
  SET_MONIT,
  SET_REPORT
} from './mutation-types'

export default {
  async getUserinfor({
    commit
  }, userInfo) {
    var user = userInfo;
    var token = user.token;
    window.localStorage.setItem('AUTH_TOKEN', token);
    window.localStorage.setItem('USER', JSON.stringify(user));
    commit(RECEIVE_USER, {
      user
    });
    commit(SET_TOKEN, {
      token
    });
  },

  //设置SRP
  setSrp({
    commit
  }, srp) {
    commit(SET_SRP, {
      srp
    });
  },
  //设置MONIT
  setMonit({
    commit
  }, monit) {
    commit(SET_MONIT, {
      monit
    });
  },

  setReport({
    commit
  }, report) {
    commit(SET_REPORT, {
      report
    });
  }
}
