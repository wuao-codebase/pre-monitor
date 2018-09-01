/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from './'

export default {
  //查询获取srp列表 ，输入：用户信息（userid，role），返回：所属SRP列表
  findList: params => {
    return API.POST('/filter/srpList', params)
  },
  //增加SRP   输入：新SRP信息，返回：code码
  insertSrp: params => {
    return API.POST(`/filter/srpInsert/${params.ids}`, params.srp)
  },

  //修改SRP信息   输入：修改SRP信息，返回：code码
  changeSrp: params => {
    return API.PUT('/filter/srpUpdate', params)
  },

  //查找SRP所属用户   输入：SRPID ，返回：SRP所属用户list
  findSrpuser: id => {
    return API.GET(`/filter/getUserBySrpId/${id}`)
  },

  //查询获取系统所有用户信息  输入：无 ，返回：所有用户list
  findadduse: params => {
    return API.GET('/filter/userList', params)
  },

  //批量添加SRP所属用户，输入：SRPID，用户id数组，返回：code码
  addsrpuserList: params => {
    return API.POST(`/filter/userAdd/${params.srpid}/${params.ids}`)
  },

  //删除一个SRP所属用户 ，输入：SRPID，用户id，返回：code码
  removesrpuser: params => {
    return API.DELETE(`/filter/userSub/${params.srpid}/${params.userid}`)
  },
  //删除一个SRP ，输入：SRPID，返回：code码
  remove: params => {
    return API.DELETE('/filter/delSrpById', params)
  },

}
