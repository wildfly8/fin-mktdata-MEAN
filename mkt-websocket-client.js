const WS = require('ws')
const ReconnectingWebSocket = require('reconnecting-websocket')

class MktWebsocketClient {

    constructor(io) {
        this.io = io
        this.socketFinnhub = new ReconnectingWebSocket('wss://ws.finnhub.io?token=' + process.env.FINNHUB_API_KEY, [], {
            WebSocket: WS,
            connectionTimeout: 1000 * 10,  //milliseconds
            reconnectInterval: 1000 * 6
        })
        this.socketGdax = new ReconnectingWebSocket('wss://ws-feed.pro.coinbase.com', [], {
            WebSocket: WS,
            connectionTimeout: 1000 * 10,  //milliseconds
            reconnectInterval: 1000 * 6
        })
    }

    subscribeMktdataFeed = data => {
        if('Finnhub' === data.vendor) {
            this.socketFinnhub.addEventListener('open', event => {
                console.log('Finnhub websocket opened. ' + new Date())
                data.symbols.forEach(s => this.socketFinnhub.send(JSON.stringify({'type':'subscribe', 'symbol': s})))
            })
            this.socketFinnhub.addEventListener('message', event => {
                this.io.emit('subscribe-MktdataFeed', JSON.parse(event.data))
            })
            this.socketFinnhub.addEventListener('error', event => {
                console.log('Finnhub websocket error: ', event)
            })
            this.socketFinnhub.addEventListener('close', event => {
                console.log('Finnhub websocket closed.', event)
            })
          } else if('GDAX' === data.vendor) {
            this.socketGdax.addEventListener('open', event => {
                console.log('GDAX websocket opened. ' + new Date())
                this.socketGdax.send(JSON.stringify({'type':'subscribe', 'product_ids': data.symbols, "channels": ["ticker"]}))
            })
            this.socketGdax.addEventListener('message', event => {
                this.io.emit('subscribe-MktdataFeed', JSON.parse(event.data))
            })
            this.socketGdax.addEventListener('error', event => {
                console.log('GDAX websocket error: ', event)
            })
            this.socketGdax.addEventListener('close', event => {
                console.log('GDAX websocket closed.' + this.socketGdax, event)
            })
          }
    };
    
    unsubscribeMktdataFeed = data => {
        if('Finnhub' === data.vendor) {
            data.symbols.forEach(s => {
                if(this.socketFinnhub != null) {
                    this.socketFinnhub.send(JSON.stringify({'type':'unsubscribe','symbol': s}))
                }
            })
            //this.socketFinnhub = null;
            console.log('Finnhub websocket unsubscribed.')
          } else if('GDAX' === data.vendor) {
            if(this.socketGdax != null) {
                this.socketGdax.send(JSON.stringify({'type':'unsubscribe','product_ids': data.symbols, 'channels': ["ticker"]}))
            }
            //this.socketGdax = null;
            console.log('GDAX websocket unsubscribed.')
          }
    };

}

module.exports = MktWebsocketClient