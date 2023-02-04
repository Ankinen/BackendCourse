"use strict";

const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db", {useNewUrlParser: true});
mongoose.connection;

let contacts = [
    {
        name: "Annukka Kinnari",
        email: "annukka@kinnari.com",
        zipCode: 12345,
        vip: true,
        phonenumber: "04012343322"
    },
    {
        name: "Chef Eggplant",
        email: "chef@eggplant.com",
        zipCode: 20331,
        vip: true,
        phonenumber: "05023454433"
    },
    {
        name: "Professor Souffle",
        email: "professor@souffle.com",
        zipCode: 19103,
        vip: true,
        phonenumber: "04434565544"
    }
];

Subscriber.deleteMany()
    .exec()
    .then(() => {
        console.log("Subscriber data is empty!");
    });

let commands = [];

contacts.forEach(c => {
    commands.push(Subscriber.create({
        name: c.name,
        email: c.email,
        zipCode: c.zipCode,
        vip: c.vip,
        phonenumber: c.phonenumber
    }));
});

Promise.all(commands)
    .then(r => {
        console.log(JSON.stringify(r));
        mongoose.connection.close();
    })
    .catch(error => {
        console.log(`ERROR: ${error}`);
    });