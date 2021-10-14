const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const makeId = require('./generate_url')
const Url = require('./models/url')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

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



app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars) }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

//find or generate shortUrl
app.post('/', (req, res) => {
  const originalUrl = req.body.originalUrl
  //check if the url already exists
  Url.findOne({ originalUrl })
    .lean()
    .then((url) => {
      //if it doesn't, create one and render index
      if (!url) {
        // const allowProtoPropertiesByDefault = true //這裡出現問題
        const newShortUrl = makeId()
        Url.create({ originalUrl, shortUrl: newShortUrl },)
          .then((url) => res.render('index', { url }))
        //if it does, simply render index
      } else {
        res.render('index', { url })
      }
    })
    .catch(error => console.log(error))
})

//allow users via copying the url to redirect to the page while server is on
app.get('/:id', (req, res) => {
  const id = req.params.id
  //check if the url does exist
  return Url.findOne({ shortUrl: { $regex: id } })
    .lean()
    .then((url) => {
      //if it doesn't
      if (!url) {
        res.render('deadEnd')
        //if it does
      } else {
        res.redirect(url.originalUrl)
      }
    })
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})