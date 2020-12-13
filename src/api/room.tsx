import { httpGet, httpPost, IResult } from './_http'
export function getRoomList(parmas): Promise<IResult<any>> {
  return httpGet('/roomInfo/list', parmas);
}
export function getRoomDetail(parmas): Promise<IResult<any>> {
  return httpGet('/roomInfo/get', parmas);
}

export function likeList(parmas): Promise<IResult<any>> {
  return httpGet('/roomCollect/get', parmas);
}
export function like(parmas): Promise<IResult<any>> {
  return httpGet('/roomCollect/save', parmas);
}
export function cancelLike(parmas): Promise<IResult<any>> {
  return httpGet('/roomCollect/cancel', parmas);
}
export function getBanner(): Promise<IResult<any>> {
  return httpGet('/images/room/getImages');
}