const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const url = 'mongodb://localhost:27017/conFusion';

const Promotion = require('../models/promotions')

const PromotionRouter = express.Router();
PromotionRouter.use(bodyParser.json())


PromotionRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promoId)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("The psot request is not allowed in this route : /Promotions/" + req.params.promoId)

    })
    .put((req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {
            new: true
        })
        return Promotion.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, err => next(err))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Promotion.findByIdAndDelete(req.params.promoId)
            .then(Promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotions)
            }, err => next(err))
            .catch(err => next(err))
    })

PromotionRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({})
            .then(Promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotions)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Promotion.create(req.body)
            .then(Promotion => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotion)
            }, err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("The put request is not allowed in this route : /promotions ")

    })
    .delete((req, res, next) => {
        Promotion.remove({})
            .then(Promotions => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(Promotions)
            }, err => next(err))
            .catch(err => next(err))
    })


module.exports = PromotionRouter