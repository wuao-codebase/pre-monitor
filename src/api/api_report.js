/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from './'

export default {

  //条件查询获取监控报告总列表，输入：pageNo页码  role角色 userId用户id totalReport查询条件 返回：总监控报告列表
  findTOList: params => {
    return API.POST(`/filter/toatalList/${params.pageNo}//${params.role}/${params.userId}`, params.totalReport)
  },

  //SRP名称下拉菜单数据  输入：userid 返回：用户所属SRP信息
  findSrpList: params => {
    return API.POST('/filter/srpList', params)
  },

  //获取详细监控报告信息  输入：总监控报告uuid 返回：详细监控报告信息list
  findDetailList: uuid => {
    return API.GET(`/filter/detailList/${uuid}`)
  },

  //获取监控项配置信息  输入：监控项monitorId 返回 ：监控项信息
  findmonit: monitorId => {
    return API.GET(`/filter/getMonitorById/${monitorId}`)
  },




}
