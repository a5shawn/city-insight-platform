/** API 请求状态码 */
export enum ApiCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

/** 区域层级 */
export enum RegionLevel {
  PROVINCE = 1,
  CITY = 2,
  DISTRICT = 3
}

/** 空气质量等级 */
export enum AqiLevel {
  EXCELLENT = '优',
  GOOD = '良',
  LIGHT = '轻度污染',
  MODERATE = '中度污染',
  HEAVY = '重度污染',
  SEVERE = '严重污染'
}

/** 水质类别 */
export enum WaterQuality {
  I = 'I类',
  II = 'II类',
  III = 'III类',
  IV = 'IV类',
  V = 'V类'
}
