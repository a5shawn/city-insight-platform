import mysql from 'mysql2/promise'

// 数据库连接配置
// 优先读取环境变量，兜底默认值
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'city_insight',
  charset: 'utf8mb4',
  // DECIMAL 类型以数字返回（mysql2 默认返回字符串，前端图表需要数字）
  decimalNumbers: true,
  // DATE/DATETIME 类型以 "YYYY-MM-DD" 字符串返回（默认是 Date 对象，序列化带时区偏移）
  dateStrings: true,
  // 连接池配置
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

/**
 * 获取数据库连接（从连接池中获取）
 * 调用方用完无需手动释放，pool.query 会自动管理
 */
export async function getConnection() {
  return pool.getConnection()
}

/**
 * 执行 SQL 查询（推荐用法）
 * @param sql   SQL 语句（含 ? 占位符）
 * @param params 参数数组
 * @returns 查询结果
 *
 * @example
 * const rows = await query('SELECT * FROM users WHERE id = ?', [1])
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await pool.execute(sql, params)
  return rows as T
}

/**
 * 批量插入（用于 seed 数据场景）
 * @param table   表名
 * @param columns 列名数组
 * @param rows    数据行数组
 *
 * @example
 * await batchInsert('regions', ['name', 'level'], [['安徽省', 1], ['合肥市', 2]])
 */
export async function batchInsert(table: string, columns: string[], rows: any[][]): Promise<void> {
  if (rows.length === 0) return

  const placeholders = rows.map(() => `(${columns.map(() => '?').join(',')})`).join(',')

  const flatValues = rows.flat()

  await pool.execute(
    `INSERT INTO \`${table}\` (${columns.map((c) => `\`${c}\``).join(',')}) VALUES ${placeholders}`,
    flatValues
  )
}

/**
 * 清空表数据（用于重新 seed）
 * @param table 表名
 */
export async function truncate(table: string): Promise<void> {
  await pool.execute(`SET FOREIGN_KEY_CHECKS = 0`)
  await pool.execute(`TRUNCATE TABLE \`${table}\``)
  await pool.execute(`SET FOREIGN_KEY_CHECKS = 1`)
}

/**
 * 关闭连接池（应用退出时调用）
 */
export async function closePool(): Promise<void> {
  await pool.end()
}

export default pool
