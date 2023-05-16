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

/**
 *
 * @param {Function} fn 回调函数
 * @param {Number} delay 多少时间执行一次
 * @param {Boolean} backwards 是否是后执行，默认先执行
 * @returns
 */
export function _throttle(fn:any, delay:number = 500, backwards:Boolean) {
  if (!fn) {
    return () => {};
  }
  let runnable = true;
  return function (...args:any) {
    if (runnable) {
      if (!backwards) {
        fn(...args);
      }
      runnable = false;
      setTimeout(() => {
        if (backwards) {
          fn(...args);
        }
        runnable = true;
      }, delay);
    }
  };
}