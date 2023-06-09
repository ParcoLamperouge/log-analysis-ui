import { logServer } from './apiChannels.js';

const hello = async () => {
  const result = await logServer.get("logServer/hello", {});
  console.log("http interface, hello")
  return result;
}

const logFileUpload = async () => {
  const result = await logServer.post("logServer/logFileUpload", {});
  return result;
}
export {
  hello,
  logFileUpload
}