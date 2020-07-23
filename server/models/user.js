
var mongoose =require("mongoose");

var User=mongoose.model("User",{
    name:{
        required:true,
        type:String
    },
    username:{
        type:String,
        required:true,
        minlength:4
    },
    password:{
        required:true,
        type:String,
        minlength:7,
    }
    
});

module.exports={User};