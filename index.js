const express = require('express')
const app = express()
const axios = require('axios');


//pass requests
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./models/Recipe')
require('./models/User')

app.use(bodyParser.json())
// app.use(express.json())

//var to use User model
const User = mongoose.model("user")
const Recipe = mongoose.model("recipe")

const uri = "mongodb://Sujata:sujata123@cluster0-shard-00-00-novxb.mongodb.net:27017,cluster0-shard-00-01-novxb.mongodb.net:27017,cluster0-shard-00-02-novxb.mongodb.net:27017/db_recipe?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

//db connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {

    console.log("connected to mongo")
})
mongoose.connection.on("error", (err) => {
    console.log("error", err)
})

app.get("/search-API", function (req, reply, next) {

    let URI = "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken";

    callService(URI).then(data => {
        console.log(data);
        reply.send({ status: 200, data_: data.data });
    }).catch(e => {
        reply.send({ status: 500, data_: {} });
    });
});

function callService(URI) {
    return new Promise((resolve, reject) => {
        // Make a request for a user with a given ID
        axios.get(URI)
            .then(function (response) {
                // handle success
                console.log(response);
                if (response.status != 200) {
                    resolve({ "msg": "Invalid request" });
                } else
                    resolve(response);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject(error);
            })
    });
}

app.post('/send-user', (req, res) => {
    // console.log(req.body)
    // res.send("posted")
    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password
    })
    user.save()
        .then(data => {
            console.log(data)
            res.send(data)
            // res.send(data)
        }).catch(err => {
            console.log(err)
        })

})

app.post('/send-recipe', (req, res) => {
    // console.log(req.body)
    // res.send("posted")
    const recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        ingridients: req.body.ingridients,
        instructions: req.body.instructions,
        notes: req.body.notes,
        picture: req.body.picture
    })
    recipe.save()
        .then(data => {
            console.log(data)
            res.send(data)
            // res.send(data)
        }).catch(err => {
            console.log(err)
        })

})

//login validation
app.post('/login', (req, res) => {
    email = req.body.email;
    password = req.body.password;
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter the details" })
    }
    //check if email and password matches
    User.findOne({ email: email, password: password })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            else {
                res.json({ message: "Login successful" })

            }

        })
        .catch(err => {
            console.log(err)
        })
})

app.get('/login', (req, res, next) => {
    User.find()
        .select('email password')
        .exec()
        .then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err)
        })
})

app.get('/get-recipe', (req, res) => {
    Recipe.find({}).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
    })
})
app.listen(3000, () => {
    console.log("Server")
})