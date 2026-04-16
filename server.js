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
        console.log('📩 recebido:', msg.toString())

        // 🔥 broadcast pra todos
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString())
            }
        })
    })
})

server.listen(8080, () => {
    console.log('🚀 servidor rodando')
})
