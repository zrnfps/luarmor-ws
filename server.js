const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(express.static(__dirname))

wss.on('connection', ws => {
    console.log('🔗 Cliente conectado')

    ws.on('message', msg => {
        console.log('📩', msg.toString())

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString())
            }
        })
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log('🚀 rodando na porta', PORT)
})
