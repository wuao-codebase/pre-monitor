/**
 * Created by jerry on 2017/6/9.
 */
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authentication-Token'] = localStorage.getItem('AUTH_TOKEN');
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头

// 添加一个请求拦截器
axios.interceptors.request.use(config => {
  if (localStorage.getItem('AUTH_TOKEN')) {
    config.headers.common['Authentication-Token'] = localStorage.getItem('AUTH_TOKEN');
  }
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

// // http response 拦截器
// Axios.interceptors.response.use(
//   response => {

//   return response;
//   },
//   error => {

//   if (error.response) {
//   switch (error.response.status) {
//   case 401:
//   this.$store.commit('del_token');
//   router.replace({
//   path: '/login',
//   query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
//   })
//   }
//   }
//   return Promise.reject(error.response.data)
//   });

//基地址
let base = '/SRPM'; //接口代理地址参见：config/index.js中的proxyTable配置

//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, params).then(res => res.data)
}

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {
    params: params
  }).then(res => res.data)
}

export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(`${base}${url}`, {
    params: params
  }).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data)
}
