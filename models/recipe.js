"use strict";

// require mongoose
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    dishName: { type: String, required: true },
    incredients: { type: String, required: true },
    instructions: { type: String, required: true },
    time: { type: String }
},
{
    timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);
