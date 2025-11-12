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
