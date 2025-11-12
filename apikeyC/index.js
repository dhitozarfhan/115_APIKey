const express = require('express')
const path = require('path')
const crypto = require('crypto')
const mysql = require('mysql2/promise')
const app = express()
const port = process.env.PORT || 3000

// Konfigurasi koneksi MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',          // ubah sesuai user MySQL kamu
  password: 'Superhero02',           // ubah kalau ada password
  database: 'apikey'  // nama database kamu
}

// Buat pool koneksi MySQL
const db = mysql.createPool(dbConfig)

// Fungsi untuk test koneksi
async function testConnection() {
  try {
    const connection = await db.getConnection()
    console.log('✅ [DATABASE] Koneksi ke MySQL berhasil!')
    connection.release()
  } catch (err) {
    console.error('❌ [DATABASE] Gagal konek ke MySQL:')
    console.error(err.message)
    process.exit(1) // keluar dari aplikasi kalau gagal
  }
}

// Jalankan test koneksi di awal
testConnection()

// Fungsi generate API key
function generateKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length]
  return out
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Endpoint untuk buat API key
app.post('/api/create', async (req, res) => {
  try {
    const length = parseInt(req.body.length, 10) || 32
    const key = generateKey(length)
    await db.query('INSERT INTO api_keys (api_key) VALUES (?)', [key])
    console.log(`🆕 [CREATE] API key dibuat: ${key}`)
    return res.json({ ok: true, key })
  } catch (err) {
    console.error('❌ [CREATE ERROR]', err)
    return res.status(500).json({ ok: false, error: 'internal' })
  }
})

// Endpoint untuk verifikasi API key
app.post('/api/verify', async (req, res) => {
  try {
    const { key } = req.body || {}
    if (!key) return res.status(400).json({ ok: false, error: 'missing key' })

    const [rows] = await db.query('SELECT * FROM api_keys WHERE api_key = ?', [key])
    const isValid = rows.length > 0
    console.log(`🔍 [VERIFY] Key: ${key} → ${isValid ? 'VALID' : 'INVALID'}`)
    return res.json({ ok: true, valid: isValid })
  } catch (err) {
    console.error('❌ [VERIFY ERROR]', err)
    return res.status(500).json({ ok: false, error: 'internal' })
  }
})

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`)
})