const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    password:String
})

mongoose.model("user", UserSchema)