import { Pool } from 'pg'

const pool = new Pool({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    port: 5432,
    database: 'chkCompatibility'
})

export default pool