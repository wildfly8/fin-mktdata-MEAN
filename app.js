require('dotenv').config()

const express = require('express')
const app = express()

const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
const configDB = require('./config/database');

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const apiRouter = require('./routes/api')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', apiRouter)

//setup mongoDB datasource
mongoose.connect(configDB.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() =>  console.log('MongoDB mktDB connection successful.'))
  .catch((err) => console.error(err))

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB'))

//setup a http server and run on a specified port
const httpServer = require('http').createServer(app)
httpServer.listen(4000, () => console.log("mkt http server started at port 4000."))

//run socket.io as server within the same http server instance
const io = require('socket.io').listen(httpServer)
const MktWebsocketClient = require('./mkt-websocket-client')
const wsClient = new MktWebsocketClient(io)
io.on('connection', socket => {
  socket.on('subscribeMktdataFeed', data => {
    wsClient.subscribeMktdataFeed(data)
  }).on('unsubscribeMktdataFeed', data => {
    wsClient.unsubscribeMktdataFeed(data)
      io.emit('unsubscribe-MktdataFeed', data)
  }).on('newdata', data => {
      console.log(data)
      io.emit('new-data', {data: data})
  }).on('updatedata', data => {
    io.emit('update-data', {data: data})
  })
})

module.exports = app