/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from './'

export default {
  //登录 输入：手机号，密码，返回：code码，token ，用户基本信息
  login: params => {
    return API.POST('/userlogin', params)
  },

  //修改用户信息 ，输入：修改后的用户信息，返回：code码
  changeProfile: params => {
    return API.PUT('/filter/userUpdate', params)
  },
  // 获取用户信息 ，输入：userId，返回：一个用户信息 
  getUserById: params => {
    return API.GET('/filter/getUserById', params)
  },

  //增加用户   输入：新用户信息，返回：code码
  insertProfile: params => {
    return API.POST('/filter/userInsert', params)
  },
  //查询获取user列表 输入：无，返回：所有用户信息
  findList: params => {
    return API.GET('/filter/userList', params)
  },
  //删除一个用户  输入：用户ID，返回：code码
  remove: params => {
    return API.DELETE('/filter/delUserById', params)
  },
  //批量删除用户， 输入：用户ID数组，返回：code码
  removeList: (ids) => {
    return API.DELETE(`/filter/delUserList/${ids}`)
  },
  //重置密码  输入：新密码，返回：code码
  changePwd: params => {
    return API.POST(`/filter/upsetUserpwd/${params.userId}/${params.userPwd}`)
  },
  //修改密码  输入：原密码，新密码，返回：code码
  changePwd2: params => {
    return API.PUT(`/filter/updateUserpwd/${params.userId}/${params.oldPwd}/${params.newPwd}`)
  },
  //检测手机    输入：手机号，返回：code码
  CheckPhon: phone => {
    return API.GET(`/filter/isPhoneRepet/${phone}`)
  },


}
