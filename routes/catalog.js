const express = require('express')
const request=require('request');
const router = express.Router()
const post = require('../models/post')
const db=require('../db/db')
const { query } = require('express')
const axios = require("axios")
const frontendServer = "http://192.168.1.176:3001"
const  catalogServers=["http://192.168.1.136:5001"]
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
    console.log("HIIIIII")
    return rows ? res.send(rows) : res.send({ message: 'no books found' })
  })
})

//update stock and/or price

router.put('/book/:id',  async (req, res, next)=> {
try{
  const query = req.query
  const id = req.params.id
  let price1=query.price
//    let flagg=query.flag;
  const params = []
       db.get('SELECT * FROM catalog WHERE id  = ?', [id], (err, row) => {
  
  row
    console.log(row.price)
  console.log(query.price)
  if (query.price === null ){
  price1= row.price;
    }})
  let sql =
    'UPDATE catalog SET ' +
    (query.price ? 'price = ? ' : '') +(price1 && query.stock ? ',' : '') +
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
      return res.status(400).send({ message: 'no books in stock' })
    }
    params.push(id)
    row
      ? db.run(sql, params, (err, rows) => {
          if (err) {
            return res.status(400).send(err.message)
          }
             request(
          catalogServers[0] + '/update/' + id+`?stock=${query.stock}` +`&price=${price1}`,
          { json: true, method: 'PUT' },
          (err=>{console.log(err)})
        )
         //async()=> { await axios.put(frontendServer + '/invalidate/' + req.params.id)}
          request(
          frontendServer + '/invalidate/' + id,
          { json: true, method: 'PUT' },
          (err=>{console.log(err)})
        )
      
          return res.send({ message: 'updated successfully' })})
        
           : res.send({ message: 'no books found' })
           })}
 
    catch(err){
    console.log(err)
  }
  
})
router.put('/update/:id',  async (req, res, next)=> {
try{
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
      return res.status(400).send({ message: 'no books in stock' })
    }
    params.push(id)
    row
      ? db.run(sql, params, (err, rows) => {
          if (err) {
            return res.status(400).send(err.message)
          }
      
	request(
		  frontendServer + '/invalidate/' + id,
		  { json: true, method: 'PUT' },
		  (err=>{console.log(err)})
		)
 res.json({success: true})
        })
      : res.send({ message: 'no books found' })
 })}
    catch(err){
    console.log(err)
  }
  })

module.exports=router