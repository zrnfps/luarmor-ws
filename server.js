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
        const data = msg.toString()

        console.log('📩 recebido:', data)

        // 🔥 envia pra TODOS MENOS quem mandou
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data)
            }
        })
    })

    ws.on('close', () => {
        console.log('❌ Cliente desconectado')
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log('🚀 rodando na porta', PORT)
})
