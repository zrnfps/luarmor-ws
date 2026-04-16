const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(express.static(__dirname))

let count = 0

wss.on('connection', ws => {
    const id = ++count
    console.log(`🔗 Cliente #${id} conectado`)

    ws.on('message', msg => {
        console.log(`📩 #${id}:`, msg.toString())

        // manda pra todos (site + roblox)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString())
            }
        })
    })

    ws.on('close', () => {
        console.log(`❌ Cliente #${id} saiu`)
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`🚀 Rodando na porta ${PORT}`)
})
