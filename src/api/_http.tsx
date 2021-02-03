
import Taro from '@tarojs/taro'

type TMethod = | 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
export interface IResult<T> {
  code: number;
  msg: string;
  data?: T;
  result?: T;
  error?: number;
  status?: number;
  header?: object;
  meta?: any;
  actived?: any;
  activity?: any;
  token?: string | null
}
interface ITaroRequest {
  url: string;
  data?: object | string;
  header?: { [key: string]: string | number };
  method: TMethod;
  dataType: string;
  responseType: 'text' | 'arraybuffer';
  mode?: 'no-cors' | 'cors' | 'same-origin';
}
// 兼容后端不规范接口
function handleData(response, status: number): IResult<{ code: number, data: any }> {
  const dfCode = status === 200 ? 0 : status
  let newRes
  if (typeof response === 'string') {
    newRes = { code: dfCode, data: '' }
  } else if (typeof response === 'object') {
    newRes = { ...response }
    // 兼容后端不规范接口
    if ('msg' in response || 'message' in response) {
      newRes.msg = response.msg || response.message || ''
    } else {
      newRes.msg = 'success'
    }
    if ('data' in response || 'result' in response) {
      if (response.data !== undefined) {
        newRes.data = response.data
      } else {
        newRes.data = response.result
      }
    } else {
      newRes.data = response
    }
  } else {
    newRes = { code: dfCode, data: '' }
  }
  newRes.code = typeof newRes.code === 'undefined' ? dfCode : newRes.code
  if (typeof newRes.msg === 'undefined') {
    if (newRes.code >= 400) {
      if (newRes.code < 500) {
        newRes.msg = '请求出错'
      } else if (newRes.code < 600) {
        newRes.msg = '服务出小差啦'
      } else if (newRes.code === 600) {
        newRes.msg = '网络开小差了'
      }
    }
  }
  return newRes
}

function handleTips(tips: boolean | string, result: IResult<any>) {
  let title = ''
  if (tips === true) {
    if (result.msg === 'string') {
      title = result.msg || (result.code === 0 ? '操作成功' : '')
    }
  }
  if (typeof tips === 'string') {
    if (result.msg === 'string') {
      title = result.msg || tips
    } else if (result.code === 0) {
      title = tips
    }
  }
  if (title) {
    Taro.showToast({
      title: title,
      icon: result.code === 0 ? 'success' : 'none',
      duration: 2000
    })
  }
}

const AjaxFn = async function (method: TMethod, url: string, data: object | string, tips: boolean | string = false, conf: any): Promise<IResult<any>> {
  // const hosts = 'https://www.mandaotec.cn/api'
  const hosts = 'https://www.m3brand.top/api/'
  const newUrl = hosts + url
  const dfOpt: ITaroRequest = {
    header: {
      token: 'asdfasdfdasf1312312adfa'
    },
    url: '',
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }

  const opt: ITaroRequest = { ...dfOpt, ...conf, method, url: newUrl, data }
  if (!opt.header) {
    opt.header = {}
  }
  // 如果是非白接口，设置token
  // if (!isOpenApi(url)) {
  //   const { token } = user.tokenObj || {}
  //   if (token) {
  //     opt.header.Authorization = 'Bearer ' + token
  //   } else {
  //     const tokenObj = await getToken(true)
  //     const { token: newToken = '' } = tokenObj || {}
  //     if (newToken) {
  //       opt.header.Authorization = 'Bearer ' + newToken
  //       tokenObj && user.setToken(tokenObj)
  //     } else if (GRAY_API_LIST.some(api => url.indexOf(api) === -1)) {
  //       return tokenObj ? { code: tokenObj.code || -1, msg: tokenObj.msg || '', token: tokenObj.token || null } : { code: -1, msg: '登录失败', token: null }
  //     }
  //   }
  // }


  // opt.header.Client = '2'
  // 1大陆 2非大陆

  // opt.header.mode = 'cors'
  if (method === 'POST' && !opt.header['content-type']) {
    opt.header['content-type'] = 'application/json'
  }

  console.log('header ========', opt.header)
  let formatResult: IResult<any> = { code: 0, msg: '', data: '' }
  return new Promise((resolve) => {
    const complete = async (result) => {
      const networkErrorCode = 600
      formatResult = {
        ...handleData(result.data || {}, result.statusCode || networkErrorCode),
        header: result.header || {},
        status: result.statusCode || networkErrorCode
      }
      handleTips(tips, formatResult)
      if (formatResult.code !== 0) {
        // errorReport.api({
        //   code: formatResult.code,
        //   msg: formatResult.msg,
        //   url: newUrl,
        //   params: data,
        //   traceId: formatResult.header && formatResult.header['X-trace-id'] || '',
        //   header: opt.header || ''
        // })
        Taro.showToast({ title: '网络错误' })
      }
      // jwt过期 逻辑
      if (formatResult.code === 1002 || formatResult.code === 401) {
        // const tokenObj = await getToken(true)
        // const { token: newToken = '' } = tokenObj || {}
        // if (newToken) {
        if (!opt.header) {
          opt.header = {}
        }
        // opt.header.Authorization = 'Bearer ' + newToken
        // tokenObj && user.setToken(tokenObj)
        // @ts-ignore
        Taro.request({
          ...opt,
          complete: (newResult: any) => {
            formatResult = {
              ...handleData(newResult.data || {}, newResult.statusCode || 600),
              header: newResult.header || {},
              status: newResult.statusCode || 600
            }
            handleTips(tips, formatResult)
            if (formatResult.code !== 0) {
              // errorReport.api({
              //   code: formatResult.code,
              //   msg: formatResult.msg,
              //   url: newUrl,
              //   params: data,
              //   traceId: formatResult.header && formatResult.header['X-trace-id'] || '',
              //   header: opt.header || ''
              // })
              Taro.showToast({ title: '网络错误' })
            }
            resolve(formatResult)
          }
        })
        // }
      } else {
        resolve(formatResult)
      }
    }
    // @ts-ignore
    Taro.request({ ...opt, complete })
  })
}
export function httpGet<T>(
  url: string,
  data: object | string = {},
  tips: boolean | string = false,
  conf: object = {}
): Promise<IResult<T | undefined>> {
  return AjaxFn('GET', url, data, tips, conf)
}

export function httpPost<T>(
  url: string,
  data: object | string = {},
  tips: boolean | string = false,
  conf: object = {}
): Promise<IResult<T | undefined>> {
  return AjaxFn('POST', url, data, tips, conf)
}

export function httpDel<T>(
  url: string,
  data: object | string = {},
  tips: boolean | string = false,
  conf: object = {}
): Promise<IResult<T | undefined>> {
  return AjaxFn('DELETE', url, data, tips, conf)
}
export default AjaxFn
