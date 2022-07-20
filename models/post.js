const mongoose = require('mongoose')
const PostSchema = mongoose.Schema({   //how post looks

    itemNumber:{
        type:Number,
        required:true
     },

    topic:{
     type : String,
     required :true,
     trim :true
    },

    stock:{
        type:Number,
        required:true
    },

    price:{
     type:Number,
     required:true
    },

    title:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('Posts',PostSchema) 