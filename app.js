const express = require('express')
const app = express()


const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect('mongodb://localhost/url_shortener_1013', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// 設定首頁路由
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})