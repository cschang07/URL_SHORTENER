const express = require('express')
const router = express.Router()

const makeId = require('../../generate_url')
const Url = require('../../models/url')

// home page
router.get('/', (req, res) => {
  res.render('index')
})

//find or generate shortUrl
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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

module.exports = router