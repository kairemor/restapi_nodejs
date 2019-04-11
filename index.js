const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan  = require('morgan')
const http = require('http')
const session = require('express-session')
const fileStore = require('session-file-store').session();

const DishRouter = require('./routes/DishRouter')
const LeaderRouter = require('./routes/leaderRouter')
const PromotionRouter = require('./routes/promoRouter')
const hostname = 'localhost'
const port  = 3000 

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
// app.use(cookieParser('kairemor-12345'))
app.use(session({
    name : 'session_id',
    secret:'kairemor-12345',
    saveUninitialized: false,
    resave: false , 
    store : new fileStore()
}))

// function auth(req, res, next){
//     console.log(req.headers); 
//     console.log('Cookie header ', req.cookie)

//     if (!req.signedCookies.user){
//         var authorization = req.headers.authorization ; 

//         if (!authorization){
//             var error = new Error("You're not authenticate guys "); 
//             res.setHeader("WWW-Authenticate", "Basic"); 
//             res.statusCode = 401 ; 
//             return next(error); 
//         }
    
//         var auth = new Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':'); 
    
//         var username = auth[0];
//         var passwd = auth[1];
    
//         if (username === 'admin' && passwd === 'password'){
//             res.cookie('user', 'admin', {signed:true}) ;
//             return next() ; 
//         }else{
//             var error = new Error("You're not authenticate guys "); 
//             res.setHeader("WWW-Authenticate", "Basic"); 
//             res.statusCode = 401 ; 
//             return next(error);            
//         }
//     }else{
//         if(req.signedCookies.user === 'admin'){
//             return next();
//         }else{
//             var error = new Error("You're not authenticate guys "); 
//             res.setHeader("WWW-Authenticate", "Basic"); 
//             res.statusCode = 401 ; 
//             return next(error);   
//         }
//     }
// } 
function auth(req, res, next){
    console.log(req.headers); 
    console.log('session header ', req.sessio)

    if (!req.session.user){
        var authorization = req.headers.authorization ; 

        if (!authorization){
            var error = new Error("You're not authenticate guys "); 
            res.setHeader("WWW-Authenticate", "Basic"); 
            res.statusCode = 401 ; 
            return next(error); 
        }
    
        var auth = new Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':'); 
    
        var username = auth[0];
        var passwd = auth[1];
    
        if (username === 'admin' && passwd === 'password'){
            req.session.user = 'admin' ;
            return next() ; 
        }else{
            var error = new Error("You're not authenticate guys "); 
            res.setHeader("WWW-Authenticate", "Basic"); 
            res.statusCode = 401 ; 
            return next(error);            
        }
    }else{
        if(req.session.user === 'admin'){
            return next();
        }else{
            var error = new Error("You're not authenticate guys "); 
            res.setHeader("WWW-Authenticate", "Basic"); 
            res.statusCode = 401 ; 
            return next(error);   
        }
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