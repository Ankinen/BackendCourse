"use strict";

// require mongoose
const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    zipCode: { type: Number, min: [1000, "Zip code too short"], max: 99999 },
    vip: { type: Boolean, default: false },
    phonenumber: { type: String, required: true },
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}]
},
{
    timestamps: true
});

subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode} Vip: ${this.vip} Phone number: ${this.phonenumber}`;
};

subscriberSchema.methods.findLocalSubscribers = function() {
    return this.model("Subscriber")
    .find({zipCode: this.zipCode})
    .exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);   