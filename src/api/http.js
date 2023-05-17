import axios from 'axios';
const OK = 200;
const handleResponse = function (promise) {
  return new Promise((resolve, reject) => {
    const response = {
      msg: '',
      code: 0
    };
    // 依赖网络返回的结果判定
    promise
      .then(res => {
        let resJson = null;
        resJson = typeof res === 'string' ? JSON.parse(res) : res;
        if (resJson.status === OK) {
          const responseData = resJson.data;
          response['code'] = responseData.code;
          response['data'] = responseData.data;
          if (responseData.code === 0) {
            resolve(responseData.data);
          } else {
            response['msg'] = responseData.msg;
            reject(response);
          }
        } else {
          response['msg'] = resJson.msg;
          reject(response);
        }
      })
      .catch(error => {
        response['msg'] = error;
        response['code'] = -1;
        reject(response);
      });
  });
};
class Http {
  env = 'current';
  channel = ''; // unique name
  axios = null;
  constructor(env, channel) {
    this.env = env;
    this.channel = channel;
    this.axios = axios.create();
  }
  get (url, params = {}){
    return handleResponse(this.axios.get(url, {params}));
  }
  post (url, params = {}){
    return handleResponse(this.axios.post(url, params));
  }
}
export default Http;