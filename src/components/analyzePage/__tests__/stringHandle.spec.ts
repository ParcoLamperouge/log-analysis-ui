import { extractData, generateGridData } from '../stringHandle';
import { vi, it, expect, describe } from "vitest";
import type { logDataItem } from '../../../class/logFile';
// dataArr
const log1 = ['[20:53:29.134][I][XEApplication.cpp:72]: [XEApplication::InitContext][tid:39996] ---> 启动客户端程序，verison:3.1.14.0315\r', '[20:53:29.165][I][XEApp.cpp:272]: [XEApp::InitQApplication][tid:39996] ---> <<< [全局] 初始化QT环境开始\r', '[20:53:29.168][I][XEApp.cpp:313]: [XEApp::InitQApplication][tid:39996] ---> QT环境初始化完成.\r', '[20:53:29.168][I][XEApp.cpp:319]: [XEApp::InitQApplication][tid:39996] ---> <<< [全局] 初始化QT环境结束\r', '[20:53:29.168][I][XEApp.cpp:508]: [XEApp::InitFont][tid:39996] ---> <<< [全局] 初始化字体库开始\r', '[20:53:29.168][I][XEApp.cpp:519]: [XEApp::InitFont][tid:39996] ---> <<< [全局] 初始化字体库结束\r', '[20:53:29.173][I][XEApp.cpp:328]: [XEApp::InitQss][tid:39996] ---> <<< [全局] 初始化QSS样式表开始\r', '[20:53:29.181][I][XEApp.cpp:384]: [XEApp::InitQss][tid:39996] ---> <<< [全局] 初始化QSS样式表结束\r', '[20:53:29.181][I][XEApp.cpp:602]: [XEApp::InitLoca…esource][tid:39996] ---> <<< [全局] 初始化Web本地资源配置开始\r', '[20:53:29.181][I][XEApp.cpp:611]: [XEApp::InitLoca…esource][tid:39996] ---> <<< [全局] 初始化Web本地资源配置结束\r', '[20:53:29.182][I][XEApp.cpp:217]: [XEApp::InitContext][tid:39996] ---> <<< [全局] 初始化运行环境结束\r', '[20:53:29.183][I][XEApp.cpp:228]: [XEApp::RunApp][tid:39996] ---> <<< [全局] RunApp开始\r', '[20:53:29.183][I][XEBackend.cpp:68]: [XEBackend::Init][tid:39996] ---> 初始化后端服务完成.\r', '[20:53:29.186][I][XEBackend.cpp:743]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 轮询登录态启动：\r'];
const log2 = [
  '[20:53:29.134][I][XEApplication.cpp:72]: [XEApplication::InitContext][tid:39996] ---> 启动客户端程序，verison:3.1.14.0315\r', 
  '[20:53:29.165][I][XEApp.cpp:272]: [XEApp::InitQApplication][tid:39991] ---> <<< [全局] 初始化QT环境开始\r', 
  '[20:53:29.168][I][XEApp.cpp:313]: [XEApp::InitQApplication][tid:39992] ---> QT环境初始化完成.\r', 
  '[20:53:29.168][I][XEApp.cpp:319]: [XEApp::InitQApplication][tid:39993] ---> <<< [全局] 初始化QT环境结束\r', 
  '[20:53:29.168][I][XEApp.cpp:508]: [XEApp::InitFont][tid:39994] ---> <<< [全局] 初始化字体库开始\r', 
  '[20:53:29.168][I][XEApp.cpp:519]: [XEApp::InitFont][tid:39995] ---> <<< [全局] 初始化字体库结束\r', 
  '[20:53:29.173][I][XEApp.cpp:328]: [XEApp::InitQss][tid:39996] ---> <<< [全局] 初始化QSS样式表开始\r', 
  '[20:53:29.181][I][XEApp.cpp:384]: [XEApp::InitQss][tid:39997] ---> <<< [全局] 初始化QSS样式表结束\r', 
  '[20:53:29.181][I][XEApp.cpp:602]: [XEApp::InitLocalSource][tid:39996] ---> <<< [全局] 初始化Web本地资源配置开始\r', '[20:53:29.181][I][XEApp.cpp:611]: [XEApp::InitLoca…esource][tid:39996] ---> <<< [全局] 初始化Web本地资源配置结束\r', '[20:53:29.182][I][XEApp.cpp:217]: [XEApp::InitContext][tid:39996] ---> <<< [全局] 初始化运行环境结束\r', 
  '[20:53:29.183][I][XEApp.cpp:228]: [XEApp::RunApp][tid:39996] ---> <<< [全局] RunApp开始\r', 
  '[20:53:29.183][I][XEBackend.cpp:68]: [XEBackend::Init][tid:39996] ---> 初始化后端服务完成.\r', 
  '[20:53:29.186][I][XEBackend.cpp:743]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 轮询登录态启动：\r'
  ];
const result1 = {
  sorted: '["39996","other"]',
  timeStampArray: ["20:53:29.134","20:53:29.165","20:53:29.168","20:53:29.173","20:53:29.181","20:53:29.182","20:53:29.183","20:53:29.186"],
  arr: JSON.parse('["[20:53:29.134][I][XEApplication.cpp:72]: [XEApplication::InitContext][tid:39996] ---> 启动客户端程序，verison:3.1.14.0315\\r","[20:53:29.165][I][XEApp.cpp:272]: [XEApp::InitQApplication][tid:39996] ---> <<< [全局] 初始化QT环境开始\\r","[20:53:29.168][I][XEApp.cpp:313]: [XEApp::InitQApplication][tid:39996] ---> QT环境初始化完成.\\r","[20:53:29.168][I][XEApp.cpp:319]: [XEApp::InitQApplication][tid:39996] ---> <<< [全局] 初始化QT环境结束\\r","[20:53:29.168][I][XEApp.cpp:508]: [XEApp::InitFont][tid:39996] ---> <<< [全局] 初始化字体库开始\\r","[20:53:29.168][I][XEApp.cpp:519]: [XEApp::InitFont][tid:39996] ---> <<< [全局] 初始化字体库结束\\r","[20:53:29.173][I][XEApp.cpp:328]: [XEApp::InitQss][tid:39996] ---> <<< [全局] 初始化QSS样式表开始\\r","[20:53:29.181][I][XEApp.cpp:384]: [XEApp::InitQss][tid:39996] ---> <<< [全局] 初始化QSS样式表结束\\r","[20:53:29.181][I][XEApp.cpp:602]: [XEApp::InitLocalResource][tid:39996] ---> <<< [全局] 初始化Web本地资源配置开始\\r","[20:53:29.181][I][XEApp.cpp:611]: [XEApp::InitLocalResource][tid:39996] ---> <<< [全局] 初始化Web本地资源配置结束\\r","[20:53:29.182][I][XEApp.cpp:217]: [XEApp::InitContext][tid:39996] ---> <<< [全局] 初始化运行环境结束\\r","[20:53:29.183][I][XEApp.cpp:228]: [XEApp::RunApp][tid:39996] ---> <<< [全局] RunApp开始\\r","[20:53:29.183][I][XEBackend.cpp:68]: [XEBackend::Init][tid:39996] ---> 初始化后端服务完成.\\r","[20:53:29.186][I][XEBackend.cpp:743]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 轮询登录态启动：\\r","[20:53:29.186][I][XEBackend.cpp:744]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 请求链接：https://live-desktop-server.xiaoeknow.com/_qt_client/xe.base.open.training_login/1.0.0.\\r","[20:53:29.187][I][XEBackend.cpp:745]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 请求参数：{\\"token\\": \\"42619e9faab5b5523db18e7dd96119c6\\"}.\\r","[20:53:29.191][E]Failed to get ntoskrnl.exe version info size\\r","[20:53:29.191][I][obs-windows.c:91]: CPU Name: AMD Ryzen 5 PRO 4650U with Radeon Graphics\\r","[20:53:29.192][I][obs-windows.c:99]: CPU Speed: 2096MHz\\r","[20:53:29.192][I][obs-windows.c:107]: Physical Cores: 6, Logical Cores: 12\\r","[20:53:29.192][I][obs-windows.c:125]: Physical Memory: 15591MB Total, 3306MB Free (NOTE: 32bit programs cannot use more than 3gb)\\r","[20:53:29.192][I][obs-windows.c:143]: Windows Version: 10.0 Build 19044 (release: 2009; revision: 2604; 64-bit)\\r","[20:53:29.192][I][obs-windows.c:163]: Running as administrator: true\\r","[20:53:29.196][I][obs-windows.c:193]: Aero is Enabled (Aero is always on for windows 8 and above)\\r","[20:53:29.197][I][obs-windows.c:235]: Windows 10 Gaming Features:\\r","[20:53:29.197][I][obs-windows.c:248]: \\tGame DVR: On\\r","[20:53:29.219][I][obs-windows.c:360]: Sec. Software Status:\\r","[20:53:29.222][I]\\r","[20:53:29.222][I]\\r","[20:53:29.226][I]\\r","[20:53:29.228][I][XEObsLogic.cpp:144]: obs startup：1.\\r","[20:53:29.228][I][obs.c:1221]: ---------------------------------\\r","[20:53:29.228][I][obs.c:1226]: audio settings reset:\\r","[20:53:29.228][I]\\tsamples per sec: 48000\\r","[20:53:29.228][I]\\tspeakers:        2\\r","[20:53:29.246][I]---------------------------------\\r","[20:53:29.246][I]Initializing D3D11...\\r","[20:53:29.247][I]Available Video Adapters: \\r","[20:53:29.261][I]\\tAdapter 0: AMD Radeon(TM) Graphics\\r","[20:53:29.261][I]\\t  Dedicated VRAM: 520060928\\r","[20:53:29.261][I]\\t  Shared VRAM:    3774840832\\r","[20:53:29.261][I]\\t  PCI ID:         1002:1636\\r","[20:53:29.263][I]\\t  Driver Version: 30.0.13040.9001\\r","[20:53:29.264][I]\\t  output 0:\\r","[20:53:29.264][I]\\t    name=S24E390\\r","[20:53:29.264][I]\\t    pos={0, 0}\\r","[20:53:29.264][I]\\t    size={1920, 1080}\\r","[20:53:29.264][I]\\t    attached=true\\r","[20:53:29.264][I]\\t    refresh=59\\r","[20:53:29.264][I]\\t    space=RGB_FULL_G22_NONE_P709\\r","[20:53:29.264][I]\\t    sdr_white_nits=80\\r","[20:53:29.264][I]\\t    nit_range=[min=0.500000, max=270.000000, max_full_frame=270.000000]\\r","[20:53:29.265][I]\\t  output 1:\\r","[20:53:29.265][I]\\t    name=\\r","[20:53:29.265][I]\\t    pos={-1920, 0}\\r","[20:53:29.265][I]\\t    size={1920, 1080}\\r","[20:53:29.265][I]\\t    attached=true\\r","[20:53:29.265][I]\\t    refresh=60\\r","[20:53:29.265][I]\\t    space=RGB_FULL_G22_NONE_P709\\r","[20:53:29.265][I]\\t    sdr_white_nits=80\\r","[20:53:29.265][I]\\t    nit_range=[min=0.500000, max=270.000000, max_full_frame=270.000000]\\r","[20:53:29.281][I]Loading up D3D11 on adapter AMD Radeon(TM) Graphics (0)\\r","[20:53:29.389][I]D3D11 loaded successfully, feature level used: b000\\r","[20:53:29.389][I]DXGI increase maximum frame latency success\\r","[20:53:29.432][I][XEBackend.cpp:751]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 返回结果：{\\"code\\":0,\\"msg\\":\\"\\",\\"data\\":{\\"openid\\":\\"o3LLujrLWHkcEgevY-R0qgjQFUoo\\",\\"is_bind_wx\\":1,\\"nickname\\":\\"\\\\u8bf4\\\\u7684\\\\u6765\\",\\"sex\\":\\"\\",\\"language\\":\\"\\",\\"city\\":\\"\\",\\"province\\":\\"\\",\\"country\\":\\"\\",\\"headimgurl\\":\\"https:\\\\/\\\\/thirdwx.qlogo.cn\\\\/mmopen\\\\/vi_32\\\\/53O0aX5fZdicGtQGCJNSckGrkdF8g6B8PUWOzInVODnFQu899cSrRehE51bHxClrt58cXV9kcH8ibcrictIia5MJpg\\\\/132\\",\\"privilege\\":\\"\\",\\"unionid\\":\\"oTHW5v4apmABcV_EJRhkQryB_XdA\\",\\"is_bind_phone\\":1,\\"is_teacher\\":\\"\\",\\"b_user_id\\":\\"b_u_62ce79c21a40f_lKWP4lyp\\",\\"is_set_password\\":1,\\"phone_number\\":\\"13590402061\\",\\"self_app_id\\":\\"appnjfbw48k4791\\",\\"session_key\\":\\"\\",\\"emini_user_id\\":240194778,\\"real_name\\":\\"\\",\\"is_verified\\":0,\\"experience_count\\":100,\\"login_type\\":0},\\"bizCode\\":0,\\"requestId\\":\\"20230315125330-16914-6411bfca6eb70\\"}.\\r","[20:53:29.433][I][XEBackend.cpp:752]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 请求耗时：246ms.\\r","[20:53:29.435][I][XEBackend.cpp:868]: [XEBackend::TrainingLogin][tid:39996] ---> >>> 轮询登录态结束（状态：Success）.\\r","[20:53:29.436][I][XEApp.cpp:737]: [XEApp::CheckUpdate][tid:39996] ---> <<< [全局] 检查更新开始\\r","[20:53:29.461][I][XEBackend.cpp:148]: app_id: \\r","[20:53:29.461][I][XEBackend.cpp:175]: [XEBackend::CheckUpdateInfo][tid:39996] ---> >>> 检查更新启动：\\r","[20:53:29.461][I][XEBackend.cpp:176]: [XEBackend::CheckUpdateInfo][tid:39996] ---> >>> 请求链接：https://live-desktop-server.xiaoeknow.com/_qt_client/xe.base.open.check_version/1.0.0.\\r","[20:53:29.462][I][XEBackend.cpp:177]: [XEBackend::CheckUpdateInfo][tid:39996] ---> >>> 请求参数：{\\"app_id\\": null, \\"dn\\": \\"00:50:56:C0:00:01\\", \\"role\\": 1, \\"sv\\": \\"Windows\\", \\"sw\\": \\"3.1.14.0315\\", \\"token\\": \\"42619e9faab5b5523db18e7dd96119c6\\"}.\\r"]'),
}
const result2 = {
  sorted: '["39991","39992","39993","39994","39995","39996","39997","other"]',
  timeStampArray: ["20:53:29.134","20:53:29.165","20:53:29.168","20:53:29.173","20:53:29.181","20:53:29.182","20:53:29.183","20:53:29.186"],
  timeStampArrayShow: ["20:53:29.165","20:53:29.168"]
}
let insArr1:logDataItem[] = [];
let insArr2:logDataItem[] = [];
let selectedThreads1:any[] = [];
let selectedThreads2:any[] = [];
describe('extractData', () => {
  it('log1', () => {
    const {
      arr, sorted, timestampSet
    } = extractData(log1);
    insArr1 = arr;
    selectedThreads1 = Array.from(sorted.slice(0, 5))
    expect(arr[5].timestamp).toBe('20:53:29.168');
    expect(arr[5].threadID).toBe('39996');
    expect(arr.length).toBe(14);
    expect(JSON.stringify(sorted)).toBe(result1.sorted);
    expect(JSON.stringify(Array.from(timestampSet))).toBe(JSON.stringify(result1.timeStampArray))
  });
  it('log2', () => {
    const {
      arr, sorted, timestampSet
    } = extractData(log2);
    insArr2 = arr;
    selectedThreads2 = Array.from(sorted.slice(0, 5))
    expect(arr[5].timestamp).toBe('20:53:29.168');
    expect(arr[5].threadID).toBe('39995');
    expect(arr.length).toBe(14);
    expect(JSON.stringify(sorted)).toBe(result2.sorted);
    expect(JSON.stringify(Array.from(timestampSet))).toBe(JSON.stringify(result2.timeStampArray))
  })
});
describe('generateGridData', () => {
  it('log1', () => {
    const {
      output, timeStampArray
    } = generateGridData(
      insArr1,
      result1.timeStampArray,
      selectedThreads1
    );
    expect(Object.keys(output)[0]).toBe('20:53:29.134');
    expect(Object.keys(output)[7]).toBe('20:53:29.186');
    
    const testObj = output['20:53:29.134']['39996'][0];console.log(testObj)
    expect(testObj.fileName).toBe('XEApplication.cpp');
    expect(testObj.level).toBe('I');
    expect(testObj.lineNumber).toBe('72');
    expect(testObj.methodName).toBe('XEApplication::InitContext');
    expect(testObj.text).toBe('启动客户端程序，verison:3.1.14.0315');
    expect(testObj.threadID).toBe("39996");
    expect(testObj.timestamp).toBe("20:53:29.134");
    expect(JSON.stringify(timeStampArray)).toBe(JSON.stringify(result1.timeStampArray));
  });
  it('log2', () => {
    const {
      output, timeStampArray
    } = generateGridData(
      insArr2,
      result2.timeStampArray,
      selectedThreads2
    );
    expect(Object.keys(output)[0]).toBe('20:53:29.165');
    expect(Object.keys(output)[1]).toBe('20:53:29.168');
    const testObj = output['20:53:29.165']['39991'][0];
    expect(testObj.fileName).toBe('XEApp.cpp');
    expect(testObj.level).toBe('I');
    expect(testObj.lineNumber).toBe('272');
    expect(testObj.methodName).toBe('XEApp::InitQApplication');
    expect(testObj.text).toBe('<<< [全局] 初始化QT环境开始');
    expect(testObj.threadID).toBe("39991");
    expect(testObj.timestamp).toBe("20:53:29.165");
    expect(JSON.stringify(timeStampArray)).toBe(JSON.stringify(result2.timeStampArrayShow));
  })
})

// TODO 
// 数据处理：同时正确识别 *.cpp / *.c文件
// 数据处理：输入输出长度相同