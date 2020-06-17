const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
    name:String,
    description:String,
    ingridients:String,
    instructions:String,
    notes:String,
    recipeImage:String
})

// mongoose.model("recipe", RecipeSchema)
module.exports = mongoose.model("recipe", RecipeSchema);
