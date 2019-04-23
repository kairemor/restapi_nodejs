const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const url = 'mongodb://localhost:27017/conFusion';

const Dishe = require('../models/dishes')

const DishRouter = express.Router();
DishRouter.use(bodyParser.json())



/* 
 *Handling the request in the specifiques pafes 
 */
DishRouter.route('/:dishID')
    .get((req, res, next) => {
        Dishe.findById(req.params.dishID)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("The psot request is not allowed in this route : /dishes/" + req.params.dishID)

    })
    .put((req, res, next) => {
        Dishe.findByIdAndUpdate(req.params.dishID, {
            $set: req.body
        }, {
            new: true
        })
        return Dishe.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, err => next(err))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Dishe.findByIdAndDelete(req.params.dishID)
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishes)
            }, err => next(err))
            .catch(err => next(err))
    })
/* 
 *Handling the request in the generales pafes 
 */
DishRouter.route('/')
    .get((req, res, next) => {
        Dishe.find({})
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishes)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Dishe.create(req.body)
            .then(dishe => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishe)
            }, err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("The put request is not allowed in this route : /dishes ")

    })
    .delete((req, res, next) => {
        Dishe.remove({})
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishes)
            }, err => next(err))
            .catch(err => next(err))
    })
/* 
 *Handling subdocument  specficique 
 */
DishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishe.findById(req.params.dishID)
            .then(dish => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId +
            '/comments/' + req.params.commentId);

    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });
/* 
 *Handling subdocument generales 
 */
DishRouter.route('/:dishID/comments')
    .get((req, res, next) => {
        Dishe.findById(req.params.dishID)
            .then(dish => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json')
                    res.json(dish.comments)
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Dishe.findById(req.params.dishID)
            .then(dish => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json')
                        })
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("The put request is not allowed in this route : /dishes" + req.params.dishID + 'comments')
    })
    .delete((req, res, next) => {
        Dishe.remove({})
            .then(dishes => {
                if (dish != null) {
                    for (let i = 0; i < dish.comments.length; i++) {
                        dish.comments.id(dish.comments[i]._id).remove()
                    }
                    dish.save()
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json')
                        })
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err))
    })


module.exports = DishRouter