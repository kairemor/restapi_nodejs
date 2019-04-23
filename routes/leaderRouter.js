const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const url = 'mongodb://localhost:27017/conFusion';

const Leaders = require('../models/promotions')

const LeaderRouter = express.Router();
LeaderRouter.use(bodyParser.json())


LeaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("The psot request is not allowed in this route : /Promotions/"+ req.params.leaderId )

    })
    .put((req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId , {$set : req.body}, {new : true})
        return Leaders.save()
        .then(dish => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json')
            res.json(dish)
        }, err => next(err))
        .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Leaders.findByIdAndDelete(req.params.leaderId)
            .then(Promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotions)
            }, err => next(err))
            .catch(err => next(err))
    })

    LeaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then(Promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotions)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Leaders.create(req.body)
            .then(Leaders => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Leaders)
            }, err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("The put request is not allowed in this route : /leader " )

    })
    .delete((req, res, next) => {
        Leaders.remove({})
            .then(Promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotions)
            }, err => next(err))
            .catch(err => next(err))
    })


module.exports = LeaderRouter 