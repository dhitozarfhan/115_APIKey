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