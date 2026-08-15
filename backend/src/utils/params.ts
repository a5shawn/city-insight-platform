/**
 * controller 层参数校验工具
 * 所有业务接口共用，返回 ParseResult 统一"成功取值 / 失败带提示"两种结果
 */
export type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string }

/** 解析必填正整数参数（如 region_id、id） */
export const parsePositiveInt = (raw: unknown, name: string): ParseResult<number> => {
  if (raw === undefined || raw === '') {
    return { ok: false, message: `${name} 参数必填` }
  }
  const value = Number(raw)
  if (!Number.isInteger(value) || value <= 0) {
    return { ok: false, message: `${name} 参数必须为正整数` }
  }
  return { ok: true, value }
}

/** 解析可选正整数参数（缺省返回 undefined，带取值范围限制） */
export const parseOptionalPositiveInt = (
  raw: unknown,
  name: string,
  min: number,
  max: number
): ParseResult<number | undefined> => {
  if (raw === undefined || raw === '') {
    return { ok: true, value: undefined }
  }
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) {
    return { ok: false, message: `${name} 参数必须为 ${min}-${max} 之间的整数` }
  }
  return { ok: true, value }
}

/** 解析可选枚举参数（不在白名单内报错，缺省返回默认值） */
export const parseOptionalEnum = <T extends string>(
  raw: unknown,
  name: string,
  allowed: readonly T[],
  defaultValue: T
): ParseResult<T> => {
  if (raw === undefined || raw === '') {
    return { ok: true, value: defaultValue }
  }
  if (!allowed.includes(raw as T)) {
    return { ok: false, message: `${name} 参数仅支持：${allowed.join('/')}` }
  }
  return { ok: true, value: raw as T }
}
