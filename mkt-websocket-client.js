const WS = require('ws')
const ReconnectingWebSocket = require('reconnecting-websocket')

class MktWebsocketClient {

    constructor(io) {
        this.io = io
        this.socketFinnhubOpened = false
        this.socketGdaxOpened = false
        this.socketFinnhub = new ReconnectingWebSocket('wss://ws.finnhub.io?token=' + process.env.FINNHUB_API_KEY, [], {
            WebSocket: WS,
            connectionTimeout: 1000 * 10,  //milliseconds
            reconnectInterval: 1000 * 6
        })
        this.socketFinnhub.addEventListener('open', event => {
            console.log('Finnhub websocket opened. ' + new Date())
            this.socketFinnhubOpened = true
        })
        this.socketFinnhub.addEventListener('message', event => {
            this.io.emit('subscribe-MktdataFeed', JSON.parse(event.data))
        })
        this.socketFinnhub.addEventListener('error', event => {
            console.log('Finnhub websocket error: ', event)
        })
        this.socketFinnhub.addEventListener('close', event => {
            console.log('Finnhub websocket closed.', event)
            this.socketFinnhubOpened = false
        })
        this.socketGdax = new ReconnectingWebSocket('wss://ws-feed.pro.coinbase.com', [], {
            WebSocket: WS,
            connectionTimeout: 1000 * 10,  //milliseconds
            reconnectInterval: 1000 * 6
        })
        this.socketGdax.addEventListener('open', event => {
            console.log('GDAX websocket opened. ' + new Date())
            this.socketGdaxOpened = true
        })
        this.socketGdax.addEventListener('message', event => {
            this.io.emit('subscribe-MktdataFeed', JSON.parse(event.data))
        })
        this.socketGdax.addEventListener('error', event => {
            console.log('GDAX websocket error: ', event)
        })
        this.socketGdax.addEventListener('close', event => {
            console.log('GDAX websocket closed.' + this.socketGdax, event)
            this.socketGdaxOpened = false
        })
    }

    subscribeMktdataFeed = data => {
        if('Finnhub' === data.vendor && this.socketFinnhub != null && this.socketFinnhubOpened) {
            data.symbols.forEach(s =>  {
                this.socketFinnhub.send(JSON.stringify({'type':'subscribe', 'symbol': s}))
                console.log(`Finnhub websocket subscribed for ticker: ${s}`)
            })
          } else if('GDAX' === data.vendor && this.socketGdax != null && this.socketGdaxOpened) {
            this.socketGdax.send(JSON.stringify({'type':'subscribe', 'product_ids': data.symbols, "channels": ["ticker"]}))
            console.log(`GDAX websocket subscribed for tickers: ${data.symbols}`)
          }
    };
    
    unsubscribeMktdataFeed = data => {
        if('Finnhub' === data.vendor && this.socketFinnhub != null && this.socketFinnhubOpened) {
            data.symbols.forEach(s => {
                this.socketFinnhub.send(JSON.stringify({'type':'unsubscribe','symbol': s}))
                console.log(`Finnhub websocket unsubscribed for ticker: ${s}`)
            })
            console.log('Finnhub websocket unsubscribed.')
          } else if('GDAX' === data.vendor && this.socketGdax != null && this.socketGdaxOpened) {
            this.socketGdax.send(JSON.stringify({'type':'unsubscribe','product_ids': data.symbols, 'channels': ["ticker"]}))
            console.log(`GDAX websocket unsubscribed for tickers: ${data.symbols}`)
          }
    };

}

module.exports = MktWebsocketClient