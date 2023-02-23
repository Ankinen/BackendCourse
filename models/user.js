"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const Subscriber = require("./subscriber");
const userSchema = new Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
    },
    zipCode: {
        type: Number,
        min: [1000, "Zip code too short"],
        max: 99999
    },
    password: {
        type: String,
        required: true
    },
    courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
    subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber"
    }},
    {
        timestamps: true
    }
);

userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`;
});

// userSchema.virtual("username").get(function() {
//     return `${this.name.first[0]} ${this.name.last.substring(0,7)}`;
// });

userSchema.pre("save", function(next) {
    let user = this;
    if (user.subscribedAccount === undefined) {
        Subscriber.findOne({
            email: user.email
        })
        .then(subscriber => {
            user.subscribedAccount = subscriber;
            next();
        })
        .catch(error => {
            console.log(`Error in connecting subscriber:${error.message}`);
            next(error);
        });
    } else {
        next();
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);