// 不支持function symbol
export const deepClone = (obj:any):any => {
  return JSON.parse(JSON.stringify(obj));
}

export const getValFromProxy = (proxy:any):any  => {
  return deepClone(proxy);
}

export const deDuplicate = (arr:any[]):any[] => {
  return Array.from(new Set(arr))
}