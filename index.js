const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan  = require('morgan')
const http = require('http')
const session = require('express-session')
const fileStore = require('session-file-store')(session);
const passport  = require('passport')
const authenticate = require('./authenticate')
const mongoose = require('mongoose')

const DishRouter = require('./routes/DishRouter')
const LeaderRouter = require('./routes/leaderRouter')
const PromotionRouter = require('./routes/promoRouter')
const UserRouter = require('./routes/UserRouter')
const hostname = 'localhost'
const port  = 3100 
const url = 'mongodb://localhost:27017/conFusion'
const app = express()

const connect = mongoose.connect(url, {useNewUrlParser:true })
connect.then(db => {
    console.log('Connexion to db succes'); 
})
.catch(err => console.log(err));



app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(__dirname+'/public'));
app.use('/users', UserRouter)


app.use(session({
    secret:'kairemor-12345',
    saveUninitialized: false,
    resave: false,
    save : fileStore()
}))
app.use(passport.initialize()); 
app.use(passport.session());

function auth(req, res, next){
    console.log('UserInformation'+ req.user); 
    console.log('session header '+ req.session)
    if (!req.user){
        var err = new Error("You're not authenticate merci "); 
        res.statusCode = 403 ;  
    }else{
        next();
    }
} 
app.use(auth); 
app.use('/dishes', DishRouter) 
app.use('/promotions', PromotionRouter)
app.use('/leaders', LeaderRouter)

const serve = http.createServer(app)

serve.listen(port, hostname, () => {
    console.log(`server is listening http://${hostname}:${port}`)
})