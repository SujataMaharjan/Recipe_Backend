const express = require('express')
const app = express()

//pass requests
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./User')

app.use(bodyParser.json())
//var to use User model
const User = mongoose.model("user")

const uri = "mongodb+srv://Sujata:sujata123@cluster0-novxb.mongodb.net/test?retryWrites=true&w=majority";

//db connection
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongo yeahhh")
})
mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})

app.post('/send-user',(req,res)=>{
// console.log(req.body)
// res.send("posted")
    const user = new User({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        password:req.body.password
    })
    user.save()
    .then(data=>{
        console.log(data)
        res.send(data)
        // res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
})

app.get('/',(req,res)=>{
    User.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})

app.listen(3000,()=>{
    console.log("Server")
})