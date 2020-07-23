var mongoose =require("mongoose");
const { Timestamp } = require("mongodb");

var Todo =mongoose.model('Todo',{
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:2
    },
    about:{
        type:String,
        minlength:2
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        default:000
    },
    userid:{
        type:String,
        required:true
    }
});

module.exports={Todo};