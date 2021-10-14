const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const makeId = require('./generate_url')
const Url = require('./models/url')

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



app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})


//試著把input/output做在同一個html頁面
//find or generate shortUrl
app.post('/', (req, res) => {
  const originalUrl = req.body.originalUrl
  Url.findOne({ originalUrl })
    .lean()
    .then((url) => {
      if (!url) {
        // const allowProtoPropertiesByDefault = true //這裡出現問題
        const newShortUrl = makeId()
        Url.create({ originalUrl, shortUrl: newShortUrl },)
          .then((url) => res.render('index', { url }))
      } else {
        res.render('index', { url })
      }
    })
    .catch(error => console.log(error))
})

//identify if the url already exists

//if it does, return shortUrl




app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})