const express = require('express')
const router = express.Router()
const post = require('../models/post')
const db=require('../db/db')
const { query } = require('express')



router.get('/',(req,res)=>{
     res.send('WELCOM TO BAZAR.com')
    })


    //get books by topic 
router.get('/search/:topic',(req, res, next)=> {
    const topic = req.params.topic
    db.all(`SELECT * FROM catalog WHERE topic = ?`, [topic], (err, rows) => {
      if (err) {
        return res.send(err)
      }
      return rows ? res.send(rows) : res.status(400).send({ message: 'no books match' })
    })
  })

  //get a book by id
router.get('/info/:id',(req, res, next)=> {
  const id = req.params.id
  db.get("SELECT * FROM 'catalog' where id=?",req.params.id, (err, rows) => {
    if (err) {
      return res.send(err)
    }
    return row ? res.send(row) : res.send({ message: 'no books found' })
  })
})

//update stock and/or price
router.put('/book/:id',  (req, res, next)=> {
  const query = req.query
  const id = req.params.id
  const params = []
  let sql =
    'UPDATE catalog SET ' +
    (query.price ? 'price = ? ' : '') +(query.price && query.stock ? ',' : '') +
    (query.stock ? 'stock = ? ' : '') +'WHERE id = ?'
    
    console.log("Update successfully")
     db.get('SELECT * FROM catalog WHERE id  = ?', [id], (err, row) => {
    if (err) {
      return res.send(err)
    }
    row
    if (query.price) {
      params.push(query.price)
    }
    if (query.stock) {
      params.push(row.stock + parseInt(query.stock))
    }
    if (row.stock + parseInt(query.stock) < 0) {
      return res.status(400).send({ message: 'no books in stock' })
    }
    params.push(id)
    row
      ? db.run(sql, params, (err, rows) => {
          if (err) {
            return res.status(400).send(err.message)
          }
          return res.send({ message: 'updated successfully' })
        })
      : res.send({ message: 'no books found' })
  })
})

module.exports=router