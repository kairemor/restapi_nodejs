const express = require('express')
const bodyParser = require('body-parser')
const morgan  = require('morgan')
const http = require('http')

const DishRouter = require('./routes/DishRouter')
const LeaderRouter = require('./routes/leaderRouter')
const PromotionRouter = require('./routes/promoRouter')
const hostname = 'localhost'
const port  = 3000 

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

function auth(req, res, next){
    console.log(req.headers); 

    var authorization = req.headers.authorization ; 

    if (!authorization){
        var error = new Error("You're not authenticate guys "); 
        res.setHeader("WWW-Authenticate", "Basic"); 
        res.statusCode = 401 ; 
        return next(error); 
    }

    var auth = new Buffer(authorization.split(' ')[1], 'base64').toString().split(':'); 

    var username = auth[0];
    var passwd = auth[1];

    if (username === 'admin' && passwd === 'password'){
        return next() ; 
    }else{
        var error = new Error("You're not authenticate guys "); 
        res.setHeader("WWW-Authenticate", "Basic"); 
        res.statusCode = 401 ; 
        return next(error);            
    }

} 

app.use(auth); 
app.use(express.static(__dirname+'/public'));
app.use('/dishes', DishRouter) 
app.use('/promotions', PromotionRouter)
app.use('/leaders', LeaderRouter)

const serve = http.createServer(app)

serve.listen(port, hostname, () => {
    console.log(`server is listening http://${hostname}:${port}`)
})