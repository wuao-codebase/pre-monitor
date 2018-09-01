/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from './'

export default {

  //查询获取监控项列表  输入：监控项id SrpID 返回：监控项列表list
  findList: params => {
    return API.GET('/filter/getMonitorsBySrpId', params)
  },
  //增加监控项   输入：新增监控项信息  返回：code码
  insertMonit: params => {
    return API.POST('/filter/monitorItemInsert', params)
  },
  //修改监控项 输入：新增监控项信息  返回：code码
  changeMonit: params => {
    return API.PUT('/filter/monitorItemUpdate', params)
  },
  //删除一个监控项 输入：监控项ID  返回：code码
  remove: params => {
    return API.DELETE('/filter/deletemonitorItemById', params)
  },

  //获取vcm信息 vsm名称下拉框信息  输入：无  返回vcm端口信息
  getVCMInfoList: params => {
    return API.GET('/filter/VCMInfoList', params)
  },

}
