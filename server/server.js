const _ =require("lodash");
const path=require("path");
var {mongoose}=require("./db/mongoose");
var {Todo}=require("./models/todo");
var {User} =require("./models/user");

var {ObjectId}=require("mongodb");

var express=require("express");
var bodyParser=require("body-parser");

var app=express();

app.use(bodyParser.urlencoded({extended : true}));

var port=process.env.PORT || 3000;

app.use(bodyParser.json());

var id;

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + '/index/index.html'));
});

// db.collection('User').insertOne({
//       name: 'Andrew',
//       userName: 25,
//       location: 'Philadelphia'
//     }, (err, result) => {
//       if (err) {
//         return console.log('Unable to insert user', err);
//       }
//       console.log(result.ops[0]._id.getTimestamp());
//     });

app.get("/signUp",(req,res)=>{
    res.sendFile(path.join(__dirname + '/index/signUp.html'));
});

app.post('/signUpReq', function(request, response) {
    console.log(request.body);
    //console.log(request.body.name+" "+request.body.username+" "+request.body.password);
    var user=new User({
        name: request.body.name,
        username :request.body.username,
        password :request.body.password
    });
    user.save().then((doc)=>{
        console.log(doc);
        // response.send("User Registered Successfully !! Login");
        response.redirect("/");
        response.send("User Registered Successfully !! Login");
    },(err)=>{
        response.status(400).send(err);
    });
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    console.log(username+" "+password);
    // db.collection('User').find({username}).toArray().then((docs)=>{
    //     console.log('Users :');
    //     console.log(JSON.stringify(docs,undefined,2));
    //     },(err)=>{
    //       console.log("Unable to fetch todos",err);
    //   });
	if (username && password) {
        try {
        User.collection.find({username}).toArray().then((user)=>{
            if(!user){
                return  response.status(404).send("No such user");
                response.end();
             }
             if(user[0].password==password){
                console.log("SucessFull Validation");
                //response.send(user);
                response.redirect("/home/"+user[0]._id);
            }
            else{
                console.log(user.password);
                response.send("Incorrect Password!! Enter Again");
                //response.redirect("/");
            }
            response.end();
            console.log('User :');
            console.log(JSON.stringify(user,undefined,2));
            },(err)=>{
            response.send("Unable to find User Login Again",err);
            response.redirect("/");
            response.end();
        });
        }
        catch(e){
            response.status(400).send();
            response.end();
        }
    }
});

app.get('/home/:id', function(request, response) {
    id=request.params.id;
    response.sendFile(path.join(__dirname + '/index/home.html'));   
});

app.post('/home/list', function(request, response) {
try{
    var userid=id;
    if(!ObjectId.isValid(userid)){
       return response.status(404).send();
    }
    Todo.collection.find({userid}).toArray().then((todo)=>{
        if(!todo){
            return  response.send("No Event");
            response.end();
        }
        console.log(todo);
        response.send(todo);
    });
}
catch(e){
    res.send("Try Again");
}
});

app.post('/home/createEvent', function(request, response) {
    var todo=new Todo({
        name: request.body.name,
        about:request.body.about,
        date :request.body.date,
        time:request.body.time,
        duration:request.body.duration,
        userid:id
    });
    todo.save().then((doc)=>{
        console.log(doc);
        //response.send("User Registered Successfully !! Login");
        response.redirect("/home/"+id);
    },(err)=>{
        response.status(400).send(err);
    });
});













// app.post("/todos",(req,res)=>{
//     var todo=new Todo({
//         text: req.body.text
//     });
    
//     todo.save().then((doc)=>{
//         res.send(doc);
//     },(err)=>{
//         res.status(400).send(err);
//     });
// });

// app.get("/todos",(req,res)=>{
//     Todo.find().then((todos)=>{
//         res.send({todos});
//     },(e)=>{
//         res.status(400).send(e);
//     });
// });

// app.get("/todos/:id",(req,res)=>{
//     var id=req.params.id;
//     if(!ObjectId.isValid(id)){
//        return res.status(404).send();
//     }
//     Todo.findById(id).then((todo)=>{
//         if(!todo){
//            return  res.status(404).send();
//         }
//         res.send(todo);
//     }).catch((e)=>{
//         res.status(400).send();
//     });
// });

// app.delete("/todos/:id",(req,res)=>{
//     var id=req.params.id;
//     if(!ObjectId.isValid(id)){
//         return res.status(404).send();
//     }
//     Todo.findByIdAndRemove(id).then((todo)=>{
//         if(!todo){
//            return res.status(404).send();
//         }
//         res.send(todo);
//     }).catch((e)=>{
//         res.status(400).send();
//     });
// });

// app.patch("/todos/:id",(req,res)=>{
//     var id=req.params.id;
//     var body=_.pick(req.body,['text','completed']);

//     if(!ObjectId.isValid(id)){
//         return res.status(404).send();
//     }
//     if(_.isBoolean(body.completed)&& body.completed){
//         body.completedAt= new Date().getTime();
//     }
//     else{
//         body.completed=false;
//         body.completedAt=null;
//     }

//     Todo.findByIdAndUpdate(id,{$set :body},{new:true}).then((todo)=>{
//         if(!todo){
//             return res.status(404).send()
//         }
//         res.send({todo});
//     }).catch((e)=>{
//         res.status(400).send();
//     })
// });


app.listen(port,()=>{
    console.log("Started on port :",port);
});
