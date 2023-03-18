import reg from './regExp';
import { logDataItem } from '../../class/logFile';
import { getValFromProxy, deepClone } from "../../utils/tools";
const MAIN_TEXT_SPLIT_KEY = '--->';
// 匹配正则表达式，添加默认返回
export const matchRegExp = (str:string, reg:RegExp, defaultVal:any = "") => {
  const matchResult:any = str.match(reg);
  if (!matchResult || matchResult.length <= 0) {
    return defaultVal;
  } else {
    return matchResult[0];
  }
}

// 将已经识别的tag从字符串中移除
export const removeRecognizedTag = (str:string) => {
  let newStr = str;
  const removeArr = [
    matchRegExp(str, reg.regTimeWithSquareBrackets), 
    matchRegExp(str, reg.regLevelWithSquareBrackets), 
    matchRegExp(str, reg.regFileWithSquareBracket), 
    matchRegExp(str, reg.regThreadWithSquareBracket), 
    matchRegExp(str, reg.regMethodWithSquareBracket)
  ];
  removeArr.forEach(square => {
    newStr = newStr.replace(square, '');
  }) 
  return newStr;
}

export const extractData:any = (dataArr:any[]) => {
  // 初始化线程名集合
  const threadSet = new Set();
  const timestampSet = new Set();
  const arr = [];
  for (let i = 0; i < dataArr.length; i++) {
    let str = dataArr[i];
    // 初始化正文
    let mainText = '';
    // 按分割符，切分tag区域和正文区域, 
    if (str.indexOf(MAIN_TEXT_SPLIT_KEY) > -1) {
      const strSplitArr = str.split(MAIN_TEXT_SPLIT_KEY);
      str = strSplitArr[0];
      mainText = strSplitArr[1].trim();
    } 
    // 如果没有，则认为是非业务日志，去掉方括号的部分视为正文
    else {
      mainText = removeRecognizedTag(str).trim();
      // TODO 呈现第三方tag
      // let unrecognizedTags = matchRegExp(str, reg.regSplitTag);
      // console.log("unrecognizedTags", unrecognizedTags);
    }
    const timestamp = matchRegExp(str, reg.regTimeTag);
    const level = matchRegExp(str, reg.regLevelTag);
    const methodName = matchRegExp(str, reg.regMethodTag);
    const fileTag = str.match(reg.regFileTag) ? str.match(reg.regFileTag) : "";
    let fileName = "";
    let lineNum = 0;
    if (timestamp) {
      timestampSet.add(timestamp);
    }
    if (fileTag.length >= 4) {
      // 有效的文件：行号tag
      fileName = fileTag[2];
      lineNum = fileTag[3];
    }
    const threadID = matchRegExp(str, reg.regThreadTag);
    if (threadID) {
      threadSet.add(threadID);
    }
    
    const args =[timestamp, level, threadID, fileName, lineNum, methodName, mainText];
    const item = new logDataItem(i, str, ...args);
    if (item.timestamp.length < 1) {
      break;
    }
    arr.push(item);
  }
  // 排序
  const sortFn:any = (a:number, b: number) => a - b;
  const sorted:any[] = Array.from(threadSet).sort(sortFn);
  sorted.push('other');  
  return { arr, sorted, timestampSet };
};
export const generateGridData:any = (
    instanceArr:logDataItem[],
    timeStampArray:any[],
    selectedThreads:any[]
  ) => {
  // console.log("generateGridData", instanceArr, timeStampArray, selectedThreads)
  // 时间轴（纵轴）
  if (timeStampArray.length < 0 ) {
    return [];
  }
  // 预先生成好容器
  const rowTemplate:any = {}
  // 根据有效线程数 (横轴)，动态分配
  selectedThreads.forEach((e) => {
    rowTemplate[e] = [];
  });
  // 最终数据输出容器
  const rowMap:any = {};

  // 数据分发 - 生成时间轴
  const timestampArr = getValFromProxy(timeStampArray);
  timestampArr.forEach((t:string) => {
    const dataObj = deepClone(rowTemplate);
    rowMap[t] = dataObj;
  });
  /*
  rowMap format = {
    '12:00:00.000': {
      thread1: [],
      thread2: [],
      thread3: []
    }
  }
  */
  instanceArr.forEach((ins:logDataItem) => {
    const timestamp = ins.timestamp;
    let threadID = ins.threadID;
    const curObj = rowMap[timestamp];
    if (!threadID) {
      threadID = 'other';
    }
    if (curObj[threadID]) {
      curObj[threadID].push(ins);
    }
  })
  // 线程筛选后，如果一行数据没有任何数据，该行不展示
  const output:any = {};
  const filterTimestamp:string[] = [];
  Object.keys(rowMap).forEach((k) => {
    const values = Object.values(rowMap[k]).flat();
    if (values.length > 0) {
      output[k] = rowMap[k];
      filterTimestamp.push(k);
    }
  });
  // 保存最终输出的数据
  timeStampArray = filterTimestamp;
  return {output, timeStampArray};
}
