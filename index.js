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

app.use('/dishes', DishRouter) 
app.use('/promotions', PromotionRouter)
app.use('/leaders', LeaderRouter)

const serve = http.createServer(app)

serve.listen(port, hostname, () => {
    console.log(`server is listening http://${hostname}:${port}`)
})