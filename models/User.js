const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fname: {type: String, required: true },
    lname:String,
    email:{type: String, required: true },
    password:{type: String, required: true }
})

mongoose.model("user", UserSchema)