const express = require('express')
const app = express();
const axios = require('axios');
var cors = require('cors');
const bcrypt = require("bcrypt");
const multer = require('multer');

//pass requests
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.json())
app.use(cors())
app.use('./models/Recipe', express.static('./uploads'))
//var to use User model
const User = require('./models/User')
const Recipe = require('./models/Recipe')

const uri = "mongodb://Sujata:sujata123@cluster0-shard-00-00-novxb.mongodb.net:27017,cluster0-shard-00-01-novxb.mongodb.net:27017,cluster0-shard-00-02-novxb.mongodb.net:27017/db_recipe?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        //does not store file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

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
        reply.send({ status: 200, meals_: data.data });
    }).catch(e => {
        reply.send({ status: 500, meals_: {} });
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
    User.findOne({ email: req.body.email })
        .exec()
        .then(getUser => {
            if (getUser) {
                //conflict error
                return res.status(409).json({
                    message: 'Email exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(data => {
                                console.log(data)
                                res.send(data)
                            }).catch(err => {
                                console.log(err)
                            })
                    }
                });
            }
        })
        .catch();



});

app.post('/send-recipe', (req, res) => {
    // console.log(req.body);
    // res.send("posted")
    const recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        ingridients: req.body.ingridients,
        instructions: req.body.instructions,
        notes: req.body.notes,
        recipeImage: req.body.recipeImage
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
app.post('/login', (req, res, next) => {
    //check if email and password matches
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                console.log("Invalid Email or password")
                return res.status(404).json({
                    error: "Invalid Email or password"
                });
            }
            // Load hash from your password DB.
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.log("Invalid Email or password")
                    return res.status(404).json({
                        error: "Invalid Email or password"
                    });
                }
                if (result) {
                    console.log("Login successful")
                    return res.json({
                        message: "Login successful"
                    });

                }
                res.status(422).json({
                    error: "Invalid Email or password"
                });

            });

        })
        .catch(err => {
            console.log(err)
        });
});


app.get('/get-recipe', (req, res) => {
    Recipe.find({}).then(data => {
        // console.log(data)
        res.send(data)
    }).catch(err => {
        console.log(err)
    })
})
app.listen(3000, () => {
    console.log("Server")
})