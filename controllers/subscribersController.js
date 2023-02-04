"use strict";

const subscriber = require("../models/subscriber");
//require the subscriber module
const Subscriber = require("../models/subscriber");

module.exports ={
    index: (req, res, next) => {
        // Query with find on the Subscriber model
        Subscriber.find({})
        .then(subscribers => {
            res.locals.subscribers = subscribers;
            next();
        })
        .catch(error => {
            console.log(`Error fetching subscribers ${error.message}`);
            next(error);
        });
    },
    indexView: (req, res) => {
        res.render("subscribers/index");
    },
    saveSubscriber: (req, res) => {
        let newSubscriber = new Subscriber({
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode,
            phonenumber: req.body.phonenumber
        });
        newSubscriber
            .save()
            .then(result => {
            res.render("thanks");
            })
            .catch(error => {
                if (error) res.send(error);
            });
    },
    show: (req, res, next) => {
        let subscriberId = req.param.id;
        Subscriber.findById(subscriberId)
                .then(subscriber => {
                    res.locals.subscriber = subscriber;
                    next();
                })
                .catch(error => {
                    console.log(`Error fetching subscriber by ID: ${error.message}`);
                    next(error);
                });
    },
    showView: (req, res) => {
        res.render("subscribers/show");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else (next);
    }
};