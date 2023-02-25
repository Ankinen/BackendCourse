"use strict";

module.exports = {
    getSubscriptionPage: (req, res) => {
        res.render("contact");
    },
    index: (req, res) => {
        res.render("index");
    },
    chat: (req, res) => {
        res.render("chat");
    }
};