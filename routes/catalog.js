const express = require('express')
const router = express.Router()
const post = require('../models/post')
const db=require('../db/db')
const { query } = require('express')



router.get('/',(req,res)=>{
     res.send('WELCOM TO BAZAR.com')
    })

  router.get('/search/:topic', function (req, res, next) {
    const topic = req.params.topic;
    db.all(`SELECT * FROM catalog WHERE topic = ?`, [topic], (err, rows) => {
      if (err) {
        return res.send(err)
      }
      return rows ? res.send(rows) : res.status(400).send({ message: 'no match' })
    })
  })

router.get('/info/:id', (req, res) =>{
  db.get("SELECT * FROM 'catalog' where id=?",req.params.id, (err, rows) => {
      if(err){
        return res.json({status :404,success :false,error:err});
      }
      if(rows.length < 1){
           return res.json({status :404,success :false,error:"no match"});
       }
     return res.json({status :200,success :true,data:rows});
  });
});

router.put('/book/:id', function (req, res, next) {
  const query = req.query
  const id = req.params.id
  const params = []
  let sql =
    'UPDATE catalog SET ' +
    (query.price ? 'price = ? ' : '') +(query.price && query.stock ? ',' : '') +
    (query.stock ? 'stock = ? ' : '') +'WHERE id = ?'
     console.log(sql)
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
      return res.status(400).send({ message: 'resource not found' })
    }
    params.push(id)
    row
      ? db.run(sql, params, (err, rows) => {
          if (err) {
            return res.status(400).send(err.message)
          }
          return res.send({ message: 'updated successfully' })
        })
      : res.send({ message: 'no rows found' })
  })
})
module.exports=router