import Http from './http';
// 支持多后端服务信道
export const logServer = new Http('current', 'logServer');