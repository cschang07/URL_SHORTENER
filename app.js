const express = require('express')
const app = express()

// 設定首頁路由
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})